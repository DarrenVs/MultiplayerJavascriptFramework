//	Index
var objectCount = 0;


function GameObject() {
	var self = this;
	
	self.position = {x:0, y:0};
	self.velocity = {x:0, y:0};
	self.size = {x:10, y:10};
	self.scale = {x:1, y:1};
	self.classType = "EmptyObject";
	
	self.ID = objectCount++;
}



exports.new = () => {
	
	return new GameObject();
}