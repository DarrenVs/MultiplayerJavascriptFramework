Enum.classType.Platform = Platform;

//Sub Class
function Platform(properties) {
    var self = this;
    
    GameObject(self, properties, "Platform");
    
    this.extends = {
        physics: Physics(this),
        collision: Collision(this),
    };
    
    
    self.anchored = false;
    self.mass = 100;
    self.colour = "#714b4b"
    
    var xPos = self.position.x;
    
    
    self.start["test"] = () => {
        
        //if (self.sender == clientID)
    }
    
    self.update[ "movement" ] = () => {
        
        if (self.controller == clientID) {

            if (INPUT["87"]) self.velocity = Vector2.add(self.velocity, new Vector2.new(0,-3));
            if (INPUT["83"]) self.velocity = Vector2.add(self.velocity, (new Vector2.new(0,3)));


            SendObject( self );
        }
    }
    
    
    
    self.collisionEnter[ "ReplicateBounce" ] = ( collisionInfo ) => {
        
        if (self.controller == clientID && collisionInfo.canCollide && collisionInfo.Object.classType == "Ball") {
            
            
            if (collisionInfo.Object.extends.velocity)
                collisionInfo.Object.velocity = Vector2.add(
                    collisionInfo.Object.velocity,
                    Vector2.multiply(Vector2.unit(Vector2.subtract(collisionInfo.Object.position, self.position)), collisionInfo.Object.ballSpeed || 10)
                );
            SendObject( collisionInfo.Object )
        }
    }
}