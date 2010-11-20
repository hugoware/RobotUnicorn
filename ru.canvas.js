//handles drawing to the canvas view
ru.canvas = function(options) {
    var self = {
        canvas:null,
        context:null,
        sprites:[],

        //applies a request to draw a resource to the canvas
        draw:function(params) {
            params.isImage = true;
            self.sprites.push(params);
            return self.instance;
        },
        
        //draws a rectangle image
        rectangle:function(params) {
            params.isRectangle = true;
            self.sprites.push(params);
            return self.instance;
        },
        
        //applies a request to write text to the canvas
        write:function(params) {
            params.isText = true;
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
        
        //actual drawing methods
        drawing:{
        
            //draws images into the view
            image:function(sprite) {
            
                //check for a size parameter
                if (sprite.size) {
                    sprite.x = sprite.size.x;
                    sprite.y = sprite.size.y;
                    sprite.height = sprite.size.height;
                    sprite.width = sprite.size.width;
                }
            
                //create the image in the view
                self.context.drawImage(
                    sprite.resource,
                    sprite.x,
                    sprite.y,
                    sprite.width || sprite.resource.width,
                    sprite.height || sprite.resource.height
                    );
            },
            
            //draws text into the view
            text:function(sprite) {
                self.context.fillStyle = sprite.color || "white";  
                self.context.font = sprite.font || "bold 14px sans-serif";
                self.context.fillText(sprite.text, sprite.x, sprite.y);
            },
            
            //draws text into the view
            rectangle:function(sprite) {
                self.context.fillStyle = sprite.color;
				self.context.strokeStyle = sprite.line;				
                if (sprite.color) self.context.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);
				if (sprite.line) self.context.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height);
            }
        },

        //causes all sprites to be drawn
        update:function() {

            //render each of the sprites into the view
            ru.util.each(self.sprites, function(sprite) {
            
                if (sprite.isImage)
                    self.drawing.image(sprite);
                else if (sprite.isText)
                    self.drawing.text(sprite);
                else if (sprite.isRectangle)
                    self.drawing.rectangle(sprite);
                    
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
            var style = ru.util.format("height:{0};width:{1};", options.height + "px", options.width + "px");
            self.canvas.setAttribute("width", options.width + "px");
            self.canvas.setAttribute("height", options.height + "px");
            self.canvas.setAttribute("style", style);

        }

    };
    
    //initalize the canvas
    self.init();

    //public members
    this.draw = self.draw;
    this.write = self.write;
    this.update = self.update;
    this.rectangle = self.rectangle;
    this.size = {
        width:parseInt(options.width),
        height:parseInt(options.height)
    };
    
};