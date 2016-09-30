function updateObjectsGrid( Obj ) {
    
    if (Obj.stage != undefined) {
        var newGrids = Obj.stage.CollisionGrid.new( Obj );

        for (var oldGrid in Obj.oldGrids) {

            if (newGrids[oldGrid] == undefined)
                delete Obj.stage.CollisionGrid.grid[oldGrid][Obj.ID];
        }

        Obj.oldGrids = newGrids;

        Obj.stage.CollisionLoop[Obj.ID] = Obj;

        for (var i in Obj.childs) {

            if (Obj.childs[i].extends.collision)
                Obj.childs[i].position = Obj.childs[i].position;
        }
    }
}


//Sub Class
function Collision(Parent) {
    var Parent = Parent;
    var self = this;
    
    
    Parent.canCollide = true;
    Parent.colliderType = Parent.colliderType || Enum.colliderType.box;
    Parent.hitbox = Parent.hitbox || Parent.size;
    Parent.mass = Parent.mass || 1;
    Parent.ignoreObjectIDs = Parent.ignoreObjectIDs || {};
    Parent.ignoreObjectType = Parent.ignoreObjectType || {};
    Parent.collisionStay = Parent.collisionStay || {};
    Parent.collisionEnter = Parent.collisionEnter || {};
    Parent.collisionExit = Parent.collisionExit || {};
    Parent.collisionActive = Parent.collisionActive ||true;
    
    Parent.oldGrids = {};
    
    
    
    Parent.Position = Vector2.new();
    Parent.Position.X = Parent.position.x;
    Parent.Position.Y = Parent.position.y;
    
    
    Parent.__defineSetter__('position', function(val) {
        
        if (val != undefined && val.x != undefined && val.y != undefined && val.x != NaN && val.y != NaN) {
            Parent.Position.X = val.x;
            Parent.Position.Y = val.y;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.__defineGetter__('position', () => {
        return Parent.Position;
    })
    
    
    
    Parent.Position.__defineSetter__('x', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Position.X = val;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.Position.__defineGetter__('x', () => {
        return Parent.Position.X;
    })
    
    
    
    Parent.Position.__defineSetter__('y', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Position.Y = val;
            
            updateObjectsGrid( Parent );
        }
    })
    Parent.Position.__defineGetter__('y', () => {
        return Parent.Position.Y;
    })
    
    
    Parent.position = Parent.position;
    
    
    
    
    
    Parent.__defineGetter__('collisionDirection', () => {
        return Vector2.unit(Vector2.divide(Parent.CollisionDirection, Parent.collisionCount));
    })
    Parent.__defineSetter__('collisionDirection', (val) => {
        Parent.CollisionDirection = val;
    })
    Parent.__defineGetter__('collisionDepth', () => {
        return Parent.CollisionDepth / Parent.collisionCount;
    })
    Parent.__defineSetter__('collisionDepth', (val) => {
        Parent.CollisionDepth = val;
    })
    
    
    Parent.collisions = {};
    
    
    Parent.collisionStay["collision"] = function( collisionInfo ) {
        
        if (Parent.anchored != undefined && !Parent.anchored && collisionInfo.canCollide && CheckCollision( Parent, collisionInfo.Object, PHYSICSSETTINGS.deltaTime )) {
            
            var force;
            if (Parent.mass < collisionInfo.Object.mass)
                force = Parent.mass / collisionInfo.Object.mass;
            else
                force = -(collisionInfo.Object.mass / Parent.mass) + 1;
            
            if (Parent.mass == collisionInfo.Object.mass) force = 0.5;
            else if (collisionInfo.Object.mass <= 0) force = 0;
            else if (Parent.mass <= 0) force = 1;
            
            if (collisionInfo.Object.mass > 0) {
                Parent.position = Vector2.add(
                    Parent.position,
                    // +
                    Vector2.multiply(Vector2.multiply(
                        collisionInfo.direction,
                        // *
                        collisionInfo.distanceToEdge //* (collisionInfo.Object.anchored ? 1 : 1)
                    ),force)
                );
            }
        }
    }
    
    return true;
}


function updateCollision( Obj1, deltaTime ) {
    
    if (Obj1 && Obj1.stage != undefined) {
        Obj1.stage.testedObjects[ Obj1.ID ] = true;
        
        for (var grid in Obj1.oldGrids) {
            for (var Obj2ID in Obj1.stage.CollisionGrid.grid[ grid ]) {

                var Obj2 = activeObjects[ Obj2ID ];
                
                if (Obj2 == undefined || !Obj2.extends.collision) //Clear dead/recycled objects
                    delete Obj1.stage.CollisionGrid.grid[ grid ][ Obj2ID ];
                    
                else if (Obj1.ID != Obj2ID && Obj2.extends.collision != undefined) {
                    
                    //Get collision info
                    collisionInfo = CheckCollision(Obj1, Obj2, deltaTime)
                    
                    if (collisionInfo) {
                        
                        Obj1.collisions[ Obj2.ID ] = Obj1.collisions[ Obj2.ID ] || {};
                        for (var index in collisionInfo) Obj1.collisions[ Obj2.ID ][ index ] = collisionInfo[ index ];
                        
                        Obj1.collisions[ Obj2.ID ].lifeTime = Obj1.collisions[ Obj2.ID ].lifeTime || 2;
                        
                        if (!Obj1.stage.testedObjects[ Obj2ID ])
                            updateCollision( Obj2, deltaTime )
                    }
                }
            }
        }

        for (var Obj2ID in Obj1.collisions) {

            var collisionInfo = Obj1.collisions[ Obj2ID ];
            var Obj2 = activeObjects[ Obj2ID ];


            if (collisionInfo.lifeTime == 2) {
                for (var i in Obj1.collisionEnter)
                    Obj1.collisionEnter[ i ](collisionInfo);

            } else if (collisionInfo.lifeTime <= 0) {
                for (var i in Obj1.collisionExit)
                    Obj1.collisionExit[ i ](collisionInfo);

            } if (collisionInfo.lifeTime > 0 && collisionInfo.lifeTime < 2) {
                for (var i in Obj1.collisionStay)
                    Obj1.collisionStay[ i ](collisionInfo);

                delete Obj1.collisions[ Obj2ID ];
            }

            collisionInfo.lifeTime -= 1;
        }
    }
}




function CheckCollision( Obj1, Obj2, deltaTime ) {
    
    
    var canCollide =  (!Obj1.ignoreObjectIDs[Obj2.ID]             
                    && !Obj2.ignoreObjectIDs[Obj1.ID]           
                    && !Obj1.ignoreObjectType[Obj2.ClassType]   
                    && !Obj2.ignoreObjectType[Obj1.ClassType]
                    && Obj1.canCollide
                    && Obj2.canCollide);
    
    
    //Check for collision type
    if (Obj1.colliderType == Enum.colliderType.circle && Obj2.colliderType == Enum.colliderType.circle) {
        
        var collisionRadius = (Obj1.hitbox.x + Obj2.hitbox.x) * 0.5;
        
        //Check collision
        if (Vector2.magnitude(Obj1.globalPosition, Obj2.globalPosition) < collisionRadius) {
            
            var direction = Vector2.unit(Vector2.subtract(Obj1.globalPosition, Obj2.globalPosition));
            var distance = ((Vector2.magnitude(Obj1.globalPosition, Obj2.globalPosition) / collisionRadius) * -1 + 1) * collisionRadius;
            
            //Return results
            return {
                collision: true,
                Object: Obj2,
                canCollide: canCollide,
                position1: Vector2.new(Obj1.position.x, Obj1.position.y),
                position2: Vector2.new(Obj2.position.x, Obj2.position.y),
                velocity1: Obj1.velocity ? Vector2.new(Obj1.velocity.x, Obj1.velocity.y) : Vector2.new(),
                velocity2: Obj2.velocity ? Vector2.new(Obj2.velocity.x, Obj2.velocity.y) : Vector2.new(),
                direction: direction,
                distanceToEdge: distance,
            };
        }
    }
    else if (Obj1.colliderType == Enum.colliderType.box || Obj2.colliderType == Enum.colliderType.box) {
        
        
        //Check collision
        if ((Obj1.globalPosition.x + Obj1.hitbox.x*.5 > Obj2.globalPosition.x - Obj2.hitbox.x*.5 &&
             Obj1.globalPosition.x - Obj1.hitbox.x*.5 < Obj2.globalPosition.x + Obj2.hitbox.x*.5)
        &&  (Obj1.globalPosition.y + Obj1.hitbox.y*.5 > Obj2.globalPosition.y - Obj2.hitbox.y*.5 &&
             Obj1.globalPosition.y - Obj1.hitbox.y*.5 < Obj2.globalPosition.y + Obj2.hitbox.y*.5)) {
            
            
            //Get edges
            var Obj1CounterVelocity = Vector2.multiply((Obj1.velocity ? Obj1.velocity : Vector2.new()), deltaTime);
            var Obj2CounterVelocity = Vector2.multiply((Obj2.velocity ? Obj2.velocity : Vector2.new()), deltaTime);
            var edges = {
                [((Obj1.globalPosition.y - Obj1CounterVelocity.y - Obj1.hitbox.y*.5) - (Obj2.globalPosition.y - Obj2CounterVelocity.y + Obj2.hitbox.y*.5))]: "down",
                [((Obj1.globalPosition.y - Obj1CounterVelocity.y + Obj1.hitbox.y*.5) - (Obj2.globalPosition.y - Obj2CounterVelocity.y - Obj2.hitbox.y*.5))]: "up",
                [((Obj1.globalPosition.x - Obj1CounterVelocity.x - Obj1.hitbox.x*.5) - (Obj2.globalPosition.x - Obj2CounterVelocity.x + Obj2.hitbox.x*.5))]: "left",
                [((Obj1.globalPosition.x - Obj1CounterVelocity.x + Obj1.hitbox.x*.5) - (Obj2.globalPosition.x - Obj2CounterVelocity.x - Obj2.hitbox.x*.5))]: "right",
            }
            
            
            //Get the direction
            var directionIndex = Infinity;
            for (var i in edges) {
                if (Math.abs(i) < Math.abs(directionIndex))
                    directionIndex = i;
            }
            
            
            //Get the distance
            var distance = {
                down: Math.abs((Obj1.globalPosition.y - Obj1.hitbox.y*.5) - (Obj2.globalPosition.y + Obj2.hitbox.y*.5)),
                up: Math.abs((Obj1.globalPosition.y + Obj1.hitbox.y*.5) - (Obj2.globalPosition.y - Obj2.hitbox.y*.5)),
                left: Math.abs((Obj1.globalPosition.x - Obj1.hitbox.x*.5) - (Obj2.globalPosition.x + Obj2.hitbox.x*.5)),
                right: Math.abs((Obj1.globalPosition.x + Obj1.hitbox.x*.5) - (Obj2.globalPosition.x - Obj2.hitbox.x*.5))
            }
            
            
            //Return results
            return {
                collision: true,
                Object: Obj2,
                canCollide: canCollide,
                position1: Vector2.new(Obj1.position.x, Obj1.position.y),
                position2: Vector2.new(Obj2.position.x, Obj2.position.y),
                velocity1: Obj1.velocity ? Vector2.new(Obj1.velocity.x, Obj1.velocity.y) : Vector2.new(),
                velocity2: Obj2.velocity ? Vector2.new(Obj2.velocity.x, Obj2.velocity.y) : Vector2.new(),
                direction: Vector2.directions[ edges[ directionIndex ] ],
                distanceToEdge: distance[ edges[ directionIndex ] ],
            };
        }
    }
    
    //Return results
    return false
}