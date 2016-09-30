function addToPhysicsLoop( Obj ) {
    
    if (Obj.stage) {
        Obj.stage.PhysicsLoop[Obj.ID] = Obj;

        for (var i in Obj.childs) {

            if (Obj.childs[i].extends.physics)
                addToPhysicsLoop(Obj.childs[i]);
        }
    }
}


// Sub Class
function Physics(Parent) {
    var Parent = Parent;
    
    
    //Parent.bouncyness = 0;
    //Parent.friction = 0;
    Parent.velocity = Parent.velocity || Vector2.new(0, 0);
    Parent.rotateVelocity = Parent.rotateVelocity || 0;
    
    
    Parent.Anchored = Parent.anchored || false;

    
    Parent.__defineGetter__('anchored', () => {
        return Parent.Anchored
    });
    Parent.__defineSetter__('anchored', (val) => {
        Parent.Anchored = val;
        
        if (val && Parent.stage && Parent.stage.PhysicsLoop[Parent.ID])
            delete Parent.stage.PhysicsLoop[Parent.ID];
        
        else if(!val && Parent.stage != undefined && Parent.stage.PhysicsLoop[Parent.ID] == undefined)
            Parent.stage.PhysicsLoop[Parent.ID] = updatePhysics;
    });
    Parent.anchored = Parent.anchored;
    
    
    
    
    
    
    Parent.Velocity = Vector2.new();
    Parent.Velocity.X = Parent.velocity.x || 0;
    Parent.Velocity.Y = Parent.velocity.x || 0;
    
    
    Parent.__defineSetter__('velocity', function(val) {
        
        if (val != undefined && val.x != undefined && val.y != undefined && val.x != NaN && val.y != NaN) {
            Parent.Velocity.X = val.x;
            Parent.Velocity.Y = val.y;
            
            addToPhysicsLoop( Parent );
        }
    })
    Parent.__defineGetter__('velocity', () => {
        return Parent.Velocity;
    })
    
    
    
    Parent.Velocity.__defineSetter__('x', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Velocity.X = val;
            
            addToPhysicsLoop( Parent );
        }
    })
    Parent.Velocity.__defineGetter__('x', () => {
        return Parent.Velocity.X;
    })
    
    
    
    Parent.Velocity.__defineSetter__('y', (val) => {
        
        if (val != undefined && val != NaN) {
            Parent.Velocity.Y = val;
            
            addToPhysicsLoop( Parent );
        }
    })
    Parent.Velocity.__defineGetter__('y', () => {
        return Parent.Velocity.Y;
    })
    
    
    
    
    
    if (!Parent.collisionEnter) Parent.collisionEnter = {};
    Parent.collisionEnter["physics"] = function( collisionInfo ) {
        
        if (!Parent.anchored && collisionInfo.canCollide && CheckCollision( Parent, collisionInfo.Object, PHYSICSSETTINGS.deltaTime )) {
            
            
            if (collisionInfo.Object.anchored || collisionInfo.Object.anchored == undefined) {
                Parent.velocity = Vector2.add(
                    collisionInfo.velocity1,
                    // -
                    Vector2.multiply(
                        collisionInfo.direction,
                        Vector2.multiply(Vector2.new( Math.abs(collisionInfo.velocity1.x), Math.abs(collisionInfo.velocity1.y) ),1.5)
                    )
                )
            } else if (collisionInfo.Object.collisions[ Parent.ID ]) {
                
                var force;
                if (Parent.mass < collisionInfo.Object.mass)
                    force = Parent.mass / collisionInfo.Object.mass;
                else
                    force = -(collisionInfo.Object.mass / Parent.mass) + 1;
                
                if (Parent.mass == collisionInfo.Object.mass) force = 0.5;
                else if (Parent.mass <= 0) force = 0;
                else if (collisionInfo.Object <= 0) force = 1;
                
                if (Parent.mass > 0) {
                    collisionInfo.Object.velocity = Vector2.subtract(
                        collisionInfo.Object.velocity,
                        // -
                        Vector2.multiply(Vector2.multiply(
                            collisionInfo.direction,
                            Vector2.new( Math.abs(Parent.velocity.x), Math.abs(Parent.velocity.y) )
                        ),force * 1.5)
                    )
                }
                if (collisionInfo.Object.mass > 0) {
                    Parent.velocity = Vector2.add(
                        Parent.velocity,
                        // +
                        Vector2.multiply(Vector2.multiply(
                            collisionInfo.direction,
                            Vector2.new( Math.abs(Parent.velocity.x), Math.abs(Parent.velocity.y) )
                        ),(-force+1) * 1.5)
                    )
                }
            }
        }
    }
    
    return true;
}


function updatePhysics( Obj, deltaTime ) {

    if (Obj && Obj.anchored == false) {


        Obj.position = Vector2.add(
            Obj.position,
            Vector2.multiply(Obj.velocity, deltaTime)
        );

        Obj.rotation += Obj.rotateVelocity * deltaTime;


        Obj.velocity = Vector2.add(
            Vector2.subtract(
                Obj.velocity,
                Vector2.multiply(Obj.velocity, Obj.stage.airDensity)
            ),
            (Obj.stage.gravityType == Enum.gravity.global ? Obj.stage.gravity : Vector2.unit(Vector2.subtract(Obj.stage.gravity, Obj.position)))
        );
        Obj.rotateVelocity -= Obj.rotateVelocity * Obj.stage.airDensity;
    }
}