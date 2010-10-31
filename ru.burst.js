//a fast and powerful lazer beam
ru.burst = function() {
    var self = {
        
        //details about how this projectile works
        settings:{
            speed:25,
            decay:40,
            damage:10,
            cooldown:150,
            sprite:{
                name:"burst",
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