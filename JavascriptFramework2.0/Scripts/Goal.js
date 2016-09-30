Enum.classType.Goal = Goal;

//Base Class
function Goal(properties) {
    var self = this;
    
    
    
    GameObject(self, properties, Enum.classType.Ball);
    this.classType = Enum.classType.Ball;
    
    this.extends = {
        collision: Collision(this),
    }
    
    self.mass = 1;
    
    
    self.collisionEnter[ "Goal" ] = function( collisionInfo ) {
        
        /*if (collisionInfo.Object.classType == Enum.classType.Ball) {
            
            self.stage.gameState.Scored();
        }*/
    }
}