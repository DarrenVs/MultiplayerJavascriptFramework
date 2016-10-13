//Sub class
function Health(Object) {
    
    
    
    Object.__defineGetter__('health', () => {
        
        return Object._health;
    })
    Object.__defineSetter__('health', (val) => {
        
        Object._health = val;
        
        if (val <= 0)
            Object.die();
    })
    
    Object.die = () => {
        
        Object.destroy();
    }
    
    Object.health = Object.health || 100;
}