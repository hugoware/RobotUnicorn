//slow moving tracking shot
ru.tracker = function() {
    var self = {
        
        //details about how this projectile works
        settings:{
            speed:1,
            decay:200,
            gain:0.25,
            drag:0.25,
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
            self.settings.draw += left ? -self.settings.drag : self.settings.drag;
            
            //move the projectile
            control.x += self.settings.draw
            control.y += control.down ? self.settings.speed : -self.settings.speed;
            
            //update the trailing
            self.settings.trail.push({
                y:control.y,
                x:control.x
            });
            
            //update the trailing
            var fade = 1;
            for (var i = self.settings.trail.length - 1; i-- > Math.max(self.settings.trail.length - 8, 0);) {
                if (i % 2 != 0 || fade > 3) continue;
                game.effects.add({
                    name:"tracker-fade-"+fade++,
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