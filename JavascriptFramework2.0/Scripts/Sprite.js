//SubClass
function Sprite( Parent, Img, sprites, animations ) {
    var self = this;
    self.parent = Parent;
    
    var spriteImg = Img;
    var sprites = sprites;
    self.parent.animations = animations || {};
    self.spriteOffset = Vector2.new();
    self.spriteSize = self.parent.size;
    
    for (var i in sprites)
        sprites[i].cellSize = Vector2.new( sprites[i].size.x / sprites[i].columns, sprites[i].size.y / sprites[i].rows );
    
    
    
    self.parent.currentAnimation = "";
    this.__defineGetter__('currentAnimation', function() {
        return self.parent.currentAnimation;
    });
    this.__defineSetter__('currentAnimation', function(val) {
        if (self.parent.animations[val] != undefined)
            self.parent.currentAnimation = val;
        else console.log(val + " animation does not exist");
    });
    
    
    
    //Set the currentAnimation to the first animation in the animations list
    for (var i in self.parent.animations) {self.parent.currentAnimation = i; break;}
    
    

    
    this.update = function() {
        var currentFrame = self.parent.animations[ self.parent.currentAnimation ].keyFrames[ Math.floor(self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame) ];
        var currentSprite = sprites[ self.parent.animations[ self.parent.currentAnimation ].sprite ];
        
        if (self.parent.animations[ self.parent.currentAnimation ].loop)
            self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame = (self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame + self.parent.animations[ self.parent.currentAnimation ].speed ) % (self.parent.animations[ self.parent.currentAnimation ].keyFrames.length);
        /*else if (self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame < self.parent.animations[ self.parent.currentAnimation ].keyFrames.length)
            self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame = (self.parent.animations[ self.parent.currentAnimation ].currentKeyFrame + self.parent.animations[ self.parent.currentAnimation ].speed ) % (self.parent.animations[ self.parent.currentAnimation ].keyFrames.length);*/
        
        transformObject(self.parent);
        
        ctx.drawImage(
            
            spriteImg,
            currentSprite.position.x + (currentFrame % currentSprite.columns) * (currentSprite.size.x / currentSprite.columns) + 1, // Crop position.x
            currentSprite.position.y + Math.floor(currentFrame / currentSprite.columns) * (currentSprite.size.y / currentSprite.rows) + 1, // Crop position.y
            
            currentSprite.cellSize.x - 2, currentSprite.cellSize.y - 2, // Crop size
            
            -(self.spriteSize != undefined ? self.spriteSize.x : currentSprite.cellSize.x) * .5 + self.spriteOffset.x, // Image PositionX
            -(self.spriteSize != undefined ? self.spriteSize.y : currentSprite.cellSize.y) * .5 + self.spriteOffset.y, // Image PositionY
            
            self.spriteSize != undefined ? self.spriteSize.x : currentSprite.cellSize.x, //Sprite sizeX
            self.spriteSize != undefined ? self.spriteSize.y : currentSprite.cellSize.y // Sprite sizeY
        );
    }
}



//To create easy images in the Enum
function newImage( src ) {
    
    var Img = new Image();
    Img.src = src;
    
    return Img;
}