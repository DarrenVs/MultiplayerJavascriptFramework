Enum.classType.Goal = Goal;

//Base Class
function Goal(properties) {
    var self = this;
    
    
    
    GameObject(self, properties, "Goal");
    
    this.extends = {
        collision: Collision(this),
    }
    
    self.mass = 1;
    
    
    self.collisionEnter[ "Goal" ] = function( collisionInfo ) {
        
        /*if (collisionInfo.Object.classType == "Ball") {
            
            self.stage.gameState.Scored();
        }*/
    }
}