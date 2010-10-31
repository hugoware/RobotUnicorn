ru.effect = function(options) {
    var self = {
        
        //updates the effect live time
        update:function(game) {
            if (options.live-- > 0) return;
            options.remove();
        },
        
        //draws the effect to the correct area
        draw:function(canvas) {
            canvas.draw({
                resource:options.image.resource,
                x:options.x,
                y:options.y
            });
        }
    
    };
    
    //public members
    this.update = self.update;
    this.draw = self.draw;
    
};