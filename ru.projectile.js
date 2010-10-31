ru.projectile = function(options) {
    var self = {
    
        //update the position of the projectile
        update:function(game) {
        
            //move first
            options.instance.update(game, options.control,{
                x:options.target.position.x + (options.target.position.width / 2),
                y:options.target.position.y + (options.target.position.height / 2)
                });
                
            //check for a hit
            var hit = self.check(game, game.view.players.player1);
            if (!hit) hit = self.check(game, game.view.players.player2);
            
            //display an effect
            if (hit) {
                game.effects.add({
                    name:"explode",
                    x:hit.x,
                    y:hit.y,
                    live:7,
                    center:true
                });
            }
            
            //decay the unit
            if (options.instance.settings.decay-- < 0) options.remove();
        },
        
        //update the projectile in the view
        draw:function(canvas) {
            canvas.draw({
                resource:options.control.resource.resource,
                x:options.control.x,
                y:options.control.y
            });
        },
        
        //checks for hitting a unit
        check:function(game, player) {
            var hit = self.isHit(player);
            if (hit) {
                player.bot.life.current -= options.instance.settings.damage;
                options.remove();
            }
            return hit;
        },
        
        //checks if a unit was hit or not
        isHit:function(player) {
        
            //the player to check
            var rect = {
                l:player.bot.position.x,
                r:player.bot.position.x + player.bot.position.width,
                t:player.bot.position.y,
                b:player.bot.position.y + player.bot.position.height,
            };

            //the area of the projectile
            var check = {
                x:options.control.x,
                width:options.control.width,
                y:options.control.y,
                height:options.control.height
            };
            
            //check each of the points
            var hit = null;
            hit = self._between(check.x, check.y, rect);
            if (!hit) hit = self._between(check.x + check.width, check.y, rect);
            if (!hit) hit = self._between(check.x, check.y + check.height, rect);
            if (!hit) hit = self._between(check.x + check.width, check.y + check.height, rect);
            return hit;
        },
        
        //checks for values between a range
        _between:function(x, y, rect) {
            if ((x > rect.l && x < rect.r) && (y > rect.t && y < rect.b)) return { x:x, y:y };
            return null;
        },
        
        //prepares the projectile to be used
        init:function() { }
    
    };
    
    //public members
    this.update = self.update;
    this.draw = self.draw;
    
};