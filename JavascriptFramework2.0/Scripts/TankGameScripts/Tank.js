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
    
    self.size = Vector2.new(20, 30);
    
    
    
    self.update[ "movement" ] = () => {
        
        if (self.controller == clientID) {

            if (INPUT["87"]) self.velocity = Vector2.add(self.velocity, new Vector2.new(0,-3));
            if (INPUT["83"]) self.velocity = Vector2.add(self.velocity, (new Vector2.new(0,3)));
            if (INPUT["68"]) self.velocity = Vector2.add(self.velocity, new Vector2.new(-3,0));
            if (INPUT["65"]) self.velocity = Vector2.add(self.velocity, (new Vector2.new(3,0)));


            SendObject( self );
        }
    }
}