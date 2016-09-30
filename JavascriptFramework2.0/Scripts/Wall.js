Enum.classType.Wall = Wall;

//Base Class
function Wall(properties) {
    var self = this;
    
    GameObject(self, properties, Enum.classType.Ball);
    this.classType = Enum.classType.Ball;
    
    this.extends = {
        collision: Collision(this),
    }
}