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
            },
            trail:[]
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
            
            //update the trailing
            self.settings.trail.push({
                y:control.y,
                x:control.x
            });
            
            //update the trailing
            for (var i = self.settings.trail.length - 1; i-- > Math.max(self.settings.trail.length - 5, 0);) {
                game.effects.add({
                    name:"tracker",
                    life:1,
                    x:self.settings.trail[i].x,
                    y:self.settings.trail[i].y
                });
            }
            
        }
        
    };
    
    //public members
    this.update = self.update;
    this.settings = self.settings;
    
};