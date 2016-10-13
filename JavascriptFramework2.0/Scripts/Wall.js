Enum.classType.Wall = Wall;

//Base Class
function Wall(properties) {
    var self = this;
    
    GameObject(self, properties, "Wall");
    
    this.extends = {
        collision: Collision(this),
    }
}