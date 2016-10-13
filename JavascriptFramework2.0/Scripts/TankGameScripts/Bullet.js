Enum.classType.Bullet = Bullet;

//Base Class
function Bullet(properties) {
    var self = this;
    
    GameObject(self, properties, "Bullet");
    
    this.extends = {
        collision: Collision(self),
        physics: Physics(self),
        health: Health(self),
    }
    
    
    self.colliderType = Enum.colliderType.circle;
    
    
    
    self.start[ "move" ] = (deltaTime) => {
        
        self.velocity = Vector2.multiply( self.forward, 700 );
    }
    
    
    self.collisionEnter[ "HitSomething" ] = (collisionInfo) => {
        
        if (collisionInfo.Object.extends.health)
            
            collisionInfo.Object.health -= 100;
        //}
    }
}