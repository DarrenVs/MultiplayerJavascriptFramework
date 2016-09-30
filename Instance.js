//functions
function newClass( className ) {
	
	if (!Classes[ className ]) {
		
		var Class = require("./Classes/" + className);
		if (Class == undefined)
			error(className + " is an invalid classname.");
		
		
		Classes[ className ] = Class;
	}
	
	return Classes[ className ].new();
}



//Values
Classes = {
	
}



exports.new = ( className ) => {
	
	return newClass( className );
}