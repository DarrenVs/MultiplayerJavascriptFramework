var canvas, ctx;
var RENDERSETTINGS = {
    lastTransformObject: null,
    renderDate: new Date().getTime(),
    renderTime: 0,
    deltaTime: 1/60,
}
var PHYSICSSETTINGS = {
    lastTransformObject: null,
    renderDate: new Date().getTime(),
    renderTime: 0,
    deltaTime: 1/60,
}
var objectCount = 0;
var connectionList = {};
var ObjectPool = {
    count: 0,
}

var Game = {
    
};

activeObjects = {}


function loadScript( fullScriptName ) {
    
    var Element = document.createElement('script');
    Element.setAttribute('src', fullScriptName);
    
    document.head.appendChild( Element );
}
var classes = {};
function Instance( fullScriptName ) {
    
    if (classes[ fullScriptName ] != undefined)
        return new classes[ fullScriptName ]();
    else
        console.error("class does not exist");
}

loadScript("./scripts/test.js");
window.setTimeout(()=>{console.log(Instance("test.js").name);}, 1000)


function updateObject(Obj) {

    if (Obj.update) {
        for (i in Obj.update) {
            if (Obj.parent)
                Obj.update[i]( Obj, RENDERSETTINGS.deltaTime );
        }
    }
    

    if (Obj.childs) {
        for (i in Obj.childs)
            updateObject(Obj.childs[i]);
    }

}
function updateDrawObject(Obj) {

    while (true) {
        lowwerObjectIndex = DrawLoop.indexOf(Obj) - 1;

        if (DrawLoop[lowwerObjectIndex] && DrawLoop[lowwerObjectIndex].zIndex > Obj.zIndex)
            DrawLoop.splice(lowwerObjectIndex, 2, Obj, DrawLoop[lowwerObjectIndex]);
        else break;
    }
}


window.addEventListener("load", function () {

    //  Index
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    Inputs();



    //Resize event
    (window.onresize = function() {
        
        console.log("resize");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })();
    
    
    


    //  Values
    function drawFrame() {
        RENDERSETTINGS.renderTime = Math.min((new Date().getTime() - RENDERSETTINGS.renderDate) * 0.001, 10);
        RENDERSETTINGS.renderDate = new Date().getTime();
        
        RENDERSETTINGS.FPS = 1 / RENDERSETTINGS.renderTime;
        RENDERSETTINGS.frameCount++;
        
        //Clear canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        /*ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);*/

        
        //Update stageObjects
        for (var stageIndex in Game) {
            //RENDERSETTINGS.deltaTime = Math.min(RENDERSETTINGS.renderTime - i, 1/60);


            //Draw Objects on canvas
            for (var ObjIndex in Game[stageIndex].DrawLoop) {
                
                if (activeObjects[Game[stageIndex].DrawLoop[ObjIndex]] != undefined
                &&  activeObjects[Game[stageIndex].DrawLoop[ObjIndex]].DrawObject != undefined)
                    activeObjects[Game[stageIndex].DrawLoop[ObjIndex]].DrawObject.update();
                else
                    delete Game[stageIndex].DrawLoop[ObjIndex];
            }
        }
        
        
        
        
        MOUSE_CLICK = {};
        INPUT_CLICK = {};
        
        window.requestAnimationFrame(drawFrame);
    }
    drawFrame();
    //window.setInterval(drawFrame, (1/30)*1000); //Incase you want a fixed amount of FPS for debugging
    
    window.setInterval(function(){
        PHYSICSSETTINGS.renderTime = Math.min((new Date().getTime() - PHYSICSSETTINGS.renderDate) * 0.001, 10);
        PHYSICSSETTINGS.renderDate = new Date().getTime();
        
        PHYSICSSETTINGS.FPS = 1 / PHYSICSSETTINGS.renderTime;
        PHYSICSSETTINGS.frameCount++;
        
        for (var stageIndex in Game) {
            
            updateObject(Game[stageIndex]);
            //Update Physics
            for (var ObjID in Game[stageIndex].PhysicsLoop) {

                delete Game[stageIndex].PhysicsLoop[ObjID];
                updatePhysics( activeObjects[ObjID], PHYSICSSETTINGS.deltaTime );
            }


            //Update Collisions
            Game[stageIndex].testedObjects = {};
            for (var ObjID in Game[stageIndex].CollisionLoop) {

                delete Game[stageIndex].CollisionLoop[ObjID];
                updateCollision( activeObjects[ObjID], PHYSICSSETTINGS.deltaTime );
            }
        }
    })
    
    
    
    LoadWorld(Game.PingPong = new Stage(), Enum.worlds.PingPong);
    
})






//Base Class
function Stage(properties) {

    //this.gravity = Vector2.new(1, 9.8);
    this.gravity = Vector2.new();//canvas.width/2, canvas.height/2);
    this.gravityType = Enum.gravity.global;//Enum.gravity.worldPoint;
    
    this.airDensity = .01;

    var self = this;
    
    this.__defineGetter__('mousePosition', function(val) {
        return Vector2.subtract( MOUSE.Position, self.position );
    });
    
    GameObject(this, properties);
    
    this.stage = this || Game[Object.keys(Game).length];
    
    
    self.PhysicsLoop = {};
    
    self.CollisionLoop = {};
    self.testedObjects = {};

    self.DrawLoop = [];

    self.gridSize = Vector2.new(100, 100);
    self.CollisionGrid = {
        grid:{

        },



        new:function( Obj ) {

            var Grids = {};

            var min = Vector2.new(Infinity, Infinity);
            var max = Vector2.new(-Infinity, -Infinity);
            
            for (var index in Vector2.directions) {

                var gridLocation = Vector2.new(
                    Math.floor((Obj.globalPosition.x + Vector2.directions[index].x * Obj.hitbox.x*.5) / self.gridSize.x) * self.gridSize.x,
                    Math.floor((Obj.globalPosition.y + Vector2.directions[index].y * Obj.hitbox.y*.5) / self.gridSize.y) * self.gridSize.y
                );

                if (self.CollisionGrid.grid[gridLocation.x + "x" + gridLocation.y] == undefined)
                    self.CollisionGrid.grid[gridLocation.x + "x" + gridLocation.y] = {};

                if (Grids[gridLocation.x + "x" + gridLocation.y] == undefined)
                    Grids[gridLocation.x + "x" + gridLocation.y] = true;
                
                if (gridLocation.x < min.x)
                    min.x = gridLocation.x;
                if (gridLocation.y < min.y)
                    min.y = gridLocation.y;

                if (gridLocation.x > max.x)
                    max.x = gridLocation.x;
                if (gridLocation.y > max.y)
                    max.y = gridLocation.y;
            }
            
            
            var x = min.x
			for (var y = min.y; y <= max.y; y += self.gridSize.y) {
				
				if (self.CollisionGrid.grid[x + "x" + y] == undefined)
					self.CollisionGrid.grid[x + "x" + y] = {};
				
				if (self.CollisionGrid.grid[x + "x" + y][Obj.ID] == undefined)
					self.CollisionGrid.grid[x + "x" + y][Obj.ID] = true;
					self.CollisionGrid.grid[x + "x" + y][Obj.ID] = true;
				
				if (Grids[x + "x" + y] == undefined)
					Grids[x + "x" + y] = true;
			}
			
			var x = max.x
			for (var y = min.y; y <= max.y; y += self.gridSize.y) {
				
				if (self.CollisionGrid.grid[x + "x" + y] == undefined)
					self.CollisionGrid.grid[x + "x" + y] = {};
				
				if (self.CollisionGrid.grid[x + "x" + y][Obj.ID] == undefined)
					self.CollisionGrid.grid[x + "x" + y][Obj.ID] = true;
				
				if (Grids[x + "x" + y] == undefined)
					Grids[x + "x" + y] = true;
			}
			
			
			var y = min.y
			for (var x = min.x; x <= max.x; x += self.gridSize.x) {
				
				if (self.CollisionGrid.grid[x + "x" + y] == undefined)
					self.CollisionGrid.grid[x + "x" + y] = {};
				
				if (self.CollisionGrid.grid[x + "x" + y][Obj.ID] == undefined)
					self.CollisionGrid.grid[x + "x" + y][Obj.ID] = true;
				
				if (Grids[x + "x" + y] == undefined)
					Grids[x + "x" + y] = true;
			}
			var y = max.y
			for (var x = min.x; x <= max.x; x += self.gridSize.x) {
				
				if (self.CollisionGrid.grid[x + "x" + y] == undefined)
					self.CollisionGrid.grid[x + "x" + y] = {};
				
				if (self.CollisionGrid.grid[x + "x" + y][Obj.ID] == undefined)
					self.CollisionGrid.grid[x + "x" + y][Obj.ID] = true;
				
				if (Grids[x + "x" + y] == undefined)
					Grids[x + "x" + y] = true;
            }

            return Grids;
        },
    }
    
    
    self.destroy = function() {
        
        if (Object.parent)
            delete Object.parent.childs[ Object.ID ];
        delete activeObjects[ Object.ID ];
        Object.Parent = undefined;
        delete Game[ self.name ];
    }
}

function updateStage(Obj) {
    
    //Delete object from old stage childrens list
    if (Obj.parent && Obj.parent.stage != undefined) {
        
        Obj.stage = Obj.parent.stage
        Obj.stage.DrawLoop.push(Obj.ID);
        Obj.anchored = Obj.anchored;
        Obj.position = Obj.position;
    }
    Obj.ID = Obj.ID;
    
    for (i in Obj.childs) {
        updateStage(Obj.childs[i]);
    }
}


function getObjectRotation(Obj) {
    
    return Obj.parent ? Obj.rotation + getObjectRotation(Obj.parent) : Obj.rotation;
}
function getObjectPosition(Obj) {
    
    return ((Obj.parent && Obj.parent != Obj.stage) ? Vector2.add(Vector2.multiply(Obj.position, Obj.parent.scale), getObjectPosition(Obj.parent)) : Obj.position);
}
function getObjectScale(Obj) {
    
    return ((Obj.parent && Obj.parent != Obj.stage) ? Vector2.add(Obj.parent.scale, getObjectScale(Obj.parent)) : Obj.scale);
}
function getFullName(Obj) {
    
    return ((Obj.parent && Obj.parent != Obj.stage) ? getFullName(Obj.parent) + ":" + Obj.ID : Obj.ID);
}



/*function resetObject( Obj ) {
    if (activeObjects[ Object.ID ])
        delete activeObjects[ Object.ID ]
    if (Obj.parent) Obj.destroy();
}*/
//Base Class
function GameObject(Object, properties, classType) {
    
    var Object = Object;
    var self = this
    Object.SetterProperties = {};
    
    Object.__defineGetter__('forward', () => {return Vector2.fromAngle(getObjectRotation(Object)+180);})
    Object.__defineGetter__('right', () => {return Vector2.fromAngle(getObjectRotation(Object)+270);})
    
    Object.__defineGetter__('globalPosition', () => {return getObjectPosition(Object);})
    Object.__defineGetter__('globalRotation', () => {return getObjectRotation(Object);})
    Object.__defineGetter__('globalScale', () => {return getObjectScale(Object);})
    Object.__defineGetter__('fullName', () => {return getFullName(Object);})
    
    Object.__defineGetter__('parent', () => {
        
        return Object._Parent;
    })
    Object.__defineSetter__('parent', (val) => {
        
        if (val) {

            Object._Parent = val;
            val.childs[ Object.ID ] = Object;
            updateStage( Object );
        }
    })
    Object.__defineGetter__('stage', () => {
        
        return Object._Stage;
    })
    Object.__defineSetter__('stage', (val) => {
        
        if (val && val != Object._Stage) {

            Object._Stage = val;
            for (var i in Object.start) {
                if (typeof(Object.start[i]) == "function")
                    Object.start[i]();
            }
        }
    })
    Object.__defineGetter__('ID', () => {
        
        return Object._ID;
    })
    Object.__defineSetter__('ID', (val) => {
        
        if (activeObjects[ Object._ID ])
            delete activeObjects[ Object._ID ];
        
        Object._ID = val;
        
        activeObjects[ Object._ID ] = Object
    })
    

    addDrawObject( Object );

    
    //Property Index\\
    Object.name = "UnamedObject";
    Object.parent = undefined;
    Object.stage = undefined;
    Object.zIndex = 0;
    Object.classType = classType;
    Object.update = {};
    Object.extends = {};
    Object.childs = {};
    Object.position = Vector2.new(0,0);
    Object.rotation = 0;
    Object.size = Vector2.new(10,10);
    Object.scale = Vector2.new(1,1);
    Object.ID = objectCount++;
    for (var i in properties) Object[i] = properties[i];
    
    
    
    
    //Methods\\
    Object.destroy = function() {
        
        if (Object.parent)
            delete Object.parent.childs[ Object.ID ];
        delete activeObjects[ Object.ID ];
        Object.Parent = undefined;
        /*resetObject( Object )
        ObjectPool[ Object.ID ] = Object;
        ObjectPool.count++;*/
    }
    
    Object.start = {} //should be filled with functions that should be run once this object enters a stage
}






function transformObject(Obj) {

    if (Obj.parent == undefined)
        ctx.setTransform(1, 0, 0, 1, Obj.position.x, Obj.position.y);
    else {
        transformObject(Obj.parent);
        ctx.transform(1, 0, 0, 1, Obj.position.x, Obj.position.y);
    }

    ctx.rotate((Obj.rotation / 180) * Math.PI);
    ctx.transform(Obj.scale.x, 0, 0, Obj.scale.y, 0, 0);
}























































