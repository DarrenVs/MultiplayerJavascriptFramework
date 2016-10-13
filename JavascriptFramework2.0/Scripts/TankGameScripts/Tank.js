Enum.classType.Tank = Tank;

//Sub Class
function Tank(properties) {
    var self = this;
    
    GameObject(self, properties, "Tank");
    
    this.extends = {
        physics: Physics(this),
        collision: Collision(this),
    };
    
    
    self.anchored = false;
    self.mass = 100;
    self.colour = "#714b4b"
    
    self.start[ "fixSize" ] = () => {
        
        self.size = self.hitbox = Vector2.new(20, 30);
    }
    
    var turret = new EmptyObject({
        size:Vector2.new(15, 15),
    })
    turret.update[ "rotate" ] = () => {
        
        if (turret.stage)
            turret.rotation = Vector2.toAngle( Vector2.subtract( cannon.globalPosition, cannon.stage.mousePosition ) );
    }
    var cannon = new EmptyObject({
        size:Vector2.new(10, 30),
        position:Vector2.new(0,15),
    })
    cannon.parent = turret;
    turret.parent = self;
    
    
    var Fire = function( parent ) {
        
        var bullet = new Bullet()
        
        bullet.position = Vector2.add(
            parent.globalPosition,
            Vector2.multiply( parent.forward, parent.size.y )
        )
        bullet.rotation = parent.globalRotation;
        bullet.parent = parent.stage;
    }
    
    self.controller = clientID;
    
    
    self.update[ "movement" ] = () => {
        
        if (self.controller == clientID) {

            if (INPUT["87"]) self.velocity = Vector2.add(self.velocity, new Vector2.new(0,-3));
            if (INPUT["83"]) self.velocity = Vector2.add(self.velocity, (new Vector2.new(0,3)));
            if (INPUT["68"]) self.velocity = Vector2.add(self.velocity, new Vector2.new(3,0));
            if (INPUT["65"]) self.velocity = Vector2.add(self.velocity, (new Vector2.new(-3,0)));
            
            
            
            if (INPUT_CLICK["32"]) {
                
                Fire(cannon);
                //self.velocity = new Vector2.new(0,-500);
            }


            SendObject( self );
        }
    }
}