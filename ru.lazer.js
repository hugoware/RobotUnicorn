//a standard lazer beam
ru.lazer = function() {
    var self = {
        
        //details about how this projectile works
        settings:{
            speed:5,
            decay:110,
            damage:20,
            cooldown:30,
            sprite:{
                name:"lazer",
                height:50,
                width:30
            }
        },
        
        //handles moving the projectile
        update:function(game, control, target) {
            control.y += control.down ? self.settings.speed : -self.settings.speed;
        }
        
    };
    
    //public members
    this.update = self.update;
    this.settings = self.settings;
    
};