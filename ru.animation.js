ru.animation = function(options) {
    var self = {
        resource:ru.resource.load({options.name})
    
        update:function(game) {
        },
        
        draw:function(canvas) {
        }
    
    };
    
    this.update = self.update;
    this.draw = self.draw;

};