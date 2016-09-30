var INPUT = {};
var INPUT_CLICK = {};
var MOUSE = {
    Position: {x:0,y:0},
};
var MOUSE_CLICK = {};

//Static Class
function Inputs() {
    
	// {{EVENTS}} \\
    window.onkeydown = function (e) {
        if (!INPUT[e.keyCode]) INPUT_CLICK[e.keyCode] = true;

        INPUT[e.keyCode] = true;
        
        //console.log(INPUT);
    }
    window.onkeyup = function (e) {
        INPUT[e.keyCode] = false;
    }

    
    window.onmousedown = function (e) {
        if (!MOUSE_CLICK[e.type]) MOUSE_CLICK[e.type] = true;

        MOUSE[e.type] = true;
        MOUSE["mouseup"] = false;
    }
    window.onmouseup = function (e) {
        MOUSE[e.type] = true;
        MOUSE["mousedown"] = false;
    }
    
    window.touchstart = function (e) {
        if (!MOUSE_CLICK[e.type]) MOUSE_CLICK[e.type] = true;

        MOUSE[e.type] = true;
        MOUSE["mouseup"] = false;
    }
    window.touchend = function (e) {
        MOUSE[e.type] = true;
        MOUSE["mousedown"] = false;
    }

    window.onmousewheel = function (e) {
        if (MOUSE["mousewheel"] == undefined)
            MOUSE["mousewheel"] = {
                delta: Vector2.new(e.wheelDeltaX, e.wheelDeltaY)
            };

        else
            MOUSE["mousewheel"].delta = Vector2.new(e.wheelDeltaX, e.wheelDeltaY);
    }

    canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        MOUSE["Position"] = Vector2.new(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    }, false);
    canvas.addEventListener('touchmove', function (e) {
        var rect = canvas.getBoundingClientRect();
        MOUSE["Position"] = Vector2.new(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    }, false);
}