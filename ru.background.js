ru.background = function(options) {
    var self = {
        
        //keeping track of the object
        data:{
            image:ru.resource.load({ url:options.image }),
            rate:0.08,
            moveLeft:true,
            barrier:90,
            size:{
                x:0,
                y:0,
                height:options.height + 100,
                width:options.width + 100,
            }
        },
    
        //where to draw this object
        draw:function(canvas) {
            canvas.draw({
                resource:self.data.image.resource,
                size:self.data.size
            });
        },
        
        //performs updating logic
        update:function(game) {
            var data = self.data;
        
            if (data.moveLeft) {
                data.size.x -= data.rate;
                if (data.moveLeft) data.moveLeft = !(data.size.x < -data.barrier);
            }
            else {
                data.size.x += data.rate;
                if (!data.moveLeft) data.moveLeft = (data.size.x > 0);
            }
        
        },
        
        //prepares the unit for the game
        init:function() {
            
        }
    };
    
    //handles drawing the image into the view
    this.draw = self.draw;
    this.update = self.update;
    self.init();
    
};