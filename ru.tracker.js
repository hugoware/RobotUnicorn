//slow moving tracking shot
ru.tracker = function() {
    var self = {
        
        //details about how this projectile works
        settings:{
            speed:1,
            decay:200,
            gain:0.5,
            drag:0.33,
            damage:20,
            draw:0,
            cooldown:250,
            sprite:{
                name:"tracker",
                height:50,
                width:50,
                half:25
            }
        },
        
        //handles moving the projectile
        update:function(game, control, target) {
            
            //get the direction to draw the shot to
            var diff = target.x - (control.x + self.settings.sprite.half);
            var left = diff < 0;
            var draw = Math.min(Math.abs(diff), self.settings.draw);
           
            //update the draw power
            self.settings.speed += self.settings.gain;
            self.settings.draw = self.settings.speed * self.settings.drag;
            
            //move the projectile
            if (draw) control.x += left ? -draw : draw;
            control.y += control.down ? self.settings.speed : -self.settings.speed;
        }
        
    };
    
    //public members
    this.update = self.update;
    this.settings = self.settings;
    
};