


Vector2 = {
    
    
    new: function(x, y) {
        
        return {x: x || 0, y: y || 0}
    },
    
    
    
    add: function(pos1, pos2) {
        
        var pos3 = Vector2.new();
        if (typeof(pos2) == "number") {
            pos3.x = pos1.x + pos2;
            pos3.y = pos1.y + pos2;
        } else {
            pos3.x = pos1.x + pos2.x;
            pos3.y = pos1.y + pos2.y;
        }
        return pos3;
    },
    
    
    
    subtract: function(pos1, pos2) {
        
        var pos3 = Vector2.new();
        if (typeof(pos2) == "number") {
            pos3.x = pos1.x - pos2;
            pos3.y = pos1.y - pos2;
        } else {
            pos3.x = pos1.x - pos2.x;
            pos3.y = pos1.y - pos2.y;
        }
        return pos3;
    },
    
    
    
    multiply: function(pos1, pos2) {
        
        var pos3 = Vector2.new();
        if (typeof(pos2) == "number") {
            pos3.x = pos1.x * pos2;
            pos3.y = pos1.y * pos2;
        } else {
            pos3.x = pos1.x * pos2.x;
            pos3.y = pos1.y * pos2.y;
        }
        return pos3;
    },
    
    
    
    divide: function(pos1, pos2) {
        
        var pos3 = Vector2.new();
        if (typeof(pos2) == "number") {
            pos3.x = pos1.x / pos2;
            pos3.y = pos1.y / pos2;
        } else {
            pos3.x = pos1.x / pos2.x;
            pos3.y = pos1.y / pos2.y;
        }
        return pos3;
    },
    
    
    
    magnitude: function(pos1, pos2) {
        pos2 = pos2 || Vector2.new(0,0);
        pos1 = pos1 || Vector2.new(0,0);
    
        return Math.sqrt( Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) );
    },
    
    
    
    toAngle: function(pos1, pos2) {
        pos2 = pos2 || Vector2.new(0,0);
        pos1 = pos1 || Vector2.new(0,0);
        
        return Math.atan2( pos1.x - pos2.x, (pos1.y - pos2.y)*-1 ) * 180 / Math.PI;
    },
    
    
    
    fromAngle: function(angle) {
        
        angle+=90;
        return Vector2.new (
            Math.cos( angle * Math.PI / 180 ) * -1,
            Math.sin( angle * Math.PI / 180 ) * -1
        );
    },
    
    
    
    unit: function(pos1) {
        
        var distance = Vector2.magnitude(pos1);
        return Vector2.new (
            pos1.x / distance,
            pos1.y / distance
        );
    },
    
    
    
    compare: function(pos1, pos2) {
        
        return (pos1.x == pos2.x && pos1.y == pos2.y)
    },
    
    directions: {
        
    },
    
    corners: {},
}

Vector2.directions.up = Vector2.new(0, -1);
Vector2.directions.right = Vector2.new(-1, 0);
Vector2.directions.down = Vector2.new(0, 1);
Vector2.directions.left = Vector2.new(1, 0);

Vector2.corners.topLeft = Vector2.new(-1, -1);
//Vector2.corners.topRight = Vector2.new(1, -1);
Vector2.corners.bottomRight = Vector2.new(1, 1);
//Vector2.corners.bottomLeft = Vector2.new(-1, 1);