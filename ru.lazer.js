//a standard lazer beam
ru.lazer = function() {
    var self = {
        
        //details about how this projectile works
        settings:{
            speed:4,
            decay:150,
            damage:15,
            cooldown:60,
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