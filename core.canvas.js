//handles drawing to the canvas view
ru.canvas = function(options) {
    var self = {
        canvas:null,
        context:null,
        sprites:[],

        //applies a request to draw a resource to the canvas
        draw:function(params) {
            self.sprites.push(params);
            return self.instance;
        },

        //clears the view entirely
        clear:function(params) {
            return self.instance;
        },

        //flushes waiting draw requests
        refresh:function(params) {
            self.sprites = [];
            return self.instance;
        },

        //causes all sprites to be drawn
        update:function() {

            //render each of the sprites into the view
            ru.util.each(self.sprites, function(sprite) {
            
                //draw the image
                self.context.drawImage(
                    sprite.resource.content,
                    sprite.x,
                    sprite.y,
                    sprite.width || sprite.resource.width,
                    sprite.height || sprite.resource.height
                    );

            });
            
            //unload the sprites
            self.refresh();

        },

        //creates the canvas in the html
        init:function() {

            //create the canvas information
            self.canvas = document.getElementById(options.target);
			self.context = self.canvas.getContext('2d');

            //set the attributes for the element
            var style = ru.util.format("height:{0};width:{0};", options.height, options.width);
            self.canvas.setAttribute("width", options.width);
            self.canvas.setAttribute("height", options.height);
            self.canvas.setAttribute("style", style);

        }

    };
    
    //initalize the canvas
    self.init();

    //public members
    return {

        /**
         * draws a sprite into the view
         */
        draw:self.draw,

        /**
         * Causes the canvas to draw all waiting sprites
         */
        update:self.update

    };
    
};




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