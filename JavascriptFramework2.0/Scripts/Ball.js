Enum.classType.Ball = Ball;

//Sub Class
function Ball(properties) {
    var self = this;
    
    GameObject(self, properties, Enum.classType.Ball);
    this.classType = Enum.classType.Ball;
    
    this.extends = {
        physics: Physics(this),
        collision: Collision(this),
    };
    
    
    self.colliderType = Enum.colliderType.circle
    self.anchored = false;
    self.mass = 0;
    self.colour = "#714b4b"
    
    self.ballSpeed = 200;
    self.velocity = Vector2.new( Math.random()-.5, Math.random()-.5)
    
    self.update[ "speed" ] = () => {
        
        self.velocity = Vector2.multiply(Vector2.unit(self.velocity), self.ballSpeed);
        //self.ballSpeed+=PHYSICSSETTINGS.deltaTime;
    }
    
    self.text = "NETWORKING TEST";
}