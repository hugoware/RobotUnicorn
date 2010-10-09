//handles drawing to the canvas view
ru.core.canvas = (function() {
    var self = {
        canvas:{},

        /**
         * draws the requested detail into the view at the next refresh
         */
        draw:function(params) {

        },

        /**
         * clears the current view
         */
        clear:function(params) {

        },

        /**
         * flushes all waiting drawing views
         */
        refresh:function(params) {

        },

        /**
         * prepares the canvas in the view
         */
        init:function(params) {
        },

        //public members
        instance:{

            draw:self.draw,
            init:self.init
        }
    };
    return self.instance;
})();



// var Canvas = {
	
	// //window and canvas
	// screen:{
		
		// //the screen to render onto
		// canvas:{},
		// context:{},
		
		// //draws a resource to the screen
		// draw:function(params) {
			// //get the image to draw
            // var resource = Canvas.resources.images[params.name];
                        
			// //draw the elements on the screen
			// if (params.height && params.width) {
					// Canvas.screen.context.drawImage(
							// resource,
							// params.x,
							// params.y,
							// params.width,
							// params.height
							// );
			// }
			// //just use the defaults for the size
			// else {
					// Canvas.screen.context.drawImage(
							// resource,
							// params.x,
							// params.y
							// );
			// }
			
		// },
		
		// //clear out images for the canvas
		// clear:function() {
		// },
		
		// //prepare the screen
		// init:function() {
			// Canvas.screen.canvas = document.getElementById("screen");
			// Canvas.screen.context = Canvas.screen.canvas.getContext('2d');	
		// }
		
	// },
	
	// //Canvas resources and files
	// resources:{
		
		// //images in the Canvas
		// images:{},
		
		// //loads an external resource
		// loadImage:function(params) {
			// var resource = new Image();
			// resource.src = params.url;
			// resource.onload = params.loaded;
			// Canvas.resources.images[params.name] = resource;
		// },
		
		// //scripts in the Canvas
		// scripts:{},
		
		// //loads an external resource
		// loadScript:function(params) {
			// var resource = new Script(params);
			// resource.src = params.url;
			// resource.onload = params.loaded;
			
			// if(params.execute)
			// {
				// resource.executeScript();
				// return;
			// }
			// Canvas.resources.scripts[params.name] = resource;
		// }
	// },
	
	// //prepares the Canvas screen
	// init:function() {
		// Canvas.screen.init();
	// }
	
// };

// function Unit(params){
		// //var frames = [params.frames];
		// //var currentFrame = params.currentFrame;
		// var position = {
				// x: params.x,
				// y: params.y
				// };
		// var display = params.canvas;
		// var name = params.name;
		// var demensions = params.demensions;

		// this.update(params) {
			// //check if unit is on canvas
			// position.x += params.x;
			// position.y += params.y;
			
			// Canvas.screen.draw{
				// name: name,
				// x: position.x,
				// y: position.y,
				// height: demensions.height,
				// width: demensions.width
			// }
		// }
				
		
		
// };