//common update and manage functionality
ru.hud = function(options) {
    var self = {
        fonts:{
            name:"bold 16px sans-serif"
        },
        
        resources:{},
        
        //areas to draw within
        zone:{
            player1:{ 
                name: { x:250, y:30 },
                health:{ x:0, y:0 },
                cooldown:{ x:0, y:10 },
                error:{ x:400, y:30 }
            },
            player2:{ 
                name: { x:250, y:options.canvas.height - 20 },
                health:{ x:0, y:options.canvas.height - 50 },
                cooldown:{ x:0, y:options.canvas.height - 40 },
                error:{ x:400, y:options.canvas.height - 20 }
            }
        },
    
        update:function() {
        },
        
        //draws the hud into the view
        draw:function(canvas, game) {
        
            //player names
            self._update.player(canvas, options.player1, self.zone.player1);
            self._update.player(canvas, options.player2, self.zone.player2);
            
            //if there is a winner
            self._update.victory(canvas, game);
            
        },
        
        _update:{
        
            //updates the victory view
            victory:function(canvas, game) {
            
                //check if any player has lost
                var image = null;
                if (game.view.players.player1.isDead() && game.view.players.player2.isDead()) {
                    image = self.resources.drawGame;
                }
                else if (game.view.players.player1.isDead()) {
                    image = self.resources.player2win;
                }
                else if (game.view.players.player2.isDead()) {
                    image = self.resources.player1win;
                }
                
                //if not, just exit
                if (!image) return;
                canvas.draw({
                    resource:image.resource,
                    x:(options.canvas.width / 2) - (image.resource.width / 2),
                    y:(options.canvas.height / 2) - (image.resource.height / 2)
                });
                
            },
        
            //updates an individual players information
            player:function(canvas, player, zone) {
            
                //update the health bar
                var bar = Math.max(0, (220 * (player.life.current / player.life.max)));
                canvas.rectangle({ color:"#0c0", x:(zone.health.x+10), y:(zone.health.y + 10), height:30, width:bar });
                canvas.draw({ resource:self.resources.health.resource, x:zone.health.x, y:zone.health.y, width:240, height:50 });
                
                //show the name of the player
                canvas.write({ text:player.name, font:self.fonts.name, x:zone.name.x, y:zone.name.y });
                
                //show any errors
                if (player.error) canvas.write({ text:player.error, color:"#f00", font:self.fonts.name, x:zone.error.x, y:zone.error.y });
                
                //weapon states
                var x = canvas.size.width - 50;
                ru.util.each(player.cooldown, function(item, name) {
                    var image = self.resources[name][item > 0 ? "cooldown" : "ready"];
                    canvas.draw({ resource:image.resource, x:x, y:zone.cooldown.y });
                    x -= image.resource.width;
                });
                
            }
        
        },
        
        //load the resources to use
        init:function() {
            self.resources.health = ru.resource.load({name:"health"});
            self.resources.player1win = ru.resource.load({name:"player1win"});
            self.resources.player2win = ru.resource.load({name:"player2win"});
            self.resources.drawGame = ru.resource.load({name:"drawGame"});
        
            //load each of the weapon icons
            ru.util.each(options.weapons, function(item, name) {
                self.resources[name] = {
                    ready:ru.resource.load({name:name + "-ready"}),
                    cooldown:ru.resource.load({name:name + "-cooldown"}),
                };
            });
        
        }
    
    };
    
    //public members
    this.update = self.update;
    this.draw = self.draw;
    self.init();
    
};