Enum.classType.Crate = Crate;

//Base Class
function Crate(properties) {
    var self = this;
    
    GameObject(self, properties, "Crate");
    
    this.extends = {
        collision: Collision(self),
        health: Health(self),
    }
}