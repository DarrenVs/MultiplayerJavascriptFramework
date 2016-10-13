Enum.worlds.PingPong = PingPong;

function PingPong( stage ) {
    var self = this;
    GameObject( self );
    this.parent = stage;
    
    stage.airDensity = 0.02;
    
    stage.gravityType = Enum.gravity.global;
    stage.gravity = Vector2.new(0,0);
    
    stage.name = "PingPong";
    
    
    //TODO
    stage.gameState = {
        scored: function( goalID ) {
            
            if (stage.gameState.score[ goalID ] != undefined)
                stage.gameState.score[ goalID ]++;
            else console.error("goalID invalid")
        }
    }
    
    
    var ArenaResolution = Vector2.new(1000, 650)
    
    function spawnGoal(properties) {
        
        var newGoal = new Goal(properties)
        newGoal.parent = stage;
    }
    
    
    //--    Draw world  --\\
    var wallWidth = 100;
    var platformHeight = ArenaResolution.y/4;
    
    
    //Top boundry
    new Wall({
        position: Vector2.new(ArenaResolution.x/2, 0),
        size: Vector2.new(ArenaResolution.x, wallWidth),
    }).parent = stage;
    
    
    //Bottom boundry
    new Wall({
        position: Vector2.new(ArenaResolution.x/2, ArenaResolution.y),
        size: Vector2.new(ArenaResolution.x, wallWidth),
    }).parent = stage;
    
    
    spawnGoal({
        position: Vector2.new(0, ArenaResolution.y/2),
        size: Vector2.new(wallWidth, ArenaResolution.y),
    })
    spawnGoal({
        position: Vector2.new(ArenaResolution.x, ArenaResolution.y/2),
        size: Vector2.new(wallWidth, ArenaResolution.y),
    })
    
    
    var leftPlatform = new Platform({
        position: Vector2.new(wallWidth, ArenaResolution.y/2),
        size: Vector2.new(20, platformHeight),
    })
    leftPlatform.parent = stage;
    /*var rightPlatform = new Platform({
        position: Vector2.new(ArenaResolution.x - wallWidth, ArenaResolution.y/2),
        size: Vector2.new(20, platformHeight),
    })
    rightPlatform.parent = stage;*/
    
    new Ball({position: Vector2.new(ArenaResolution.x/2, ArenaResolution.y/2),size:Vector2.new(20,20)}).parent = stage;
    //new Ball({position: Vector2.new(ArenaResolution.x/2, ArenaResolution.y/2),size:Vector2.new(20,20)});
    
    
    var debugText = new EmptyObject({
        position: Vector2.new(250, 100),
    })
    debugText.parent = stage;
    
    self.update[ "gameManager" ] = () => {
        
        leftPlatform.controller = clientID;//Object.keys(Playerlist)[0];
        if (Object.keys(Playerlist)[0] == clientID)
            leftPlatform.position.x = ArenaResolution.x - wallWidth;
        else
            leftPlatform.position.x = wallWidth;
        //rightPlatform.controller = Object.keys(Playerlist)[1];
        
        debugText.text = "Connected playerID's: " + Object.keys(Playerlist) + "      Current room: " + room;
    }
}