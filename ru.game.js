ru.game = function(options) {
    var self = {
        
        //common object
        canvas:new ru.canvas(options.canvas),
        
        //types of projectiles in the view
        projectiles:{
            id:0,
            add:function(params) {
                var identity = "p"+(self.projectiles.id++);
                
                //then create the actual projectile object
                var instance = new options.weapons[params.type]();
                params.cooldown = instance.settings.cooldown;
                
                //unique details for the projectile
                var control = {
                    x:params.startX - (instance.settings.sprite.width / 2),
                    y:params.startY + (params.down ? 0 : -instance.settings.sprite.height),
                    down:params.down,
                    decay:instance.settings.decay,
                    speed:instance.settings.speed,
                    resource:ru.resource.load({name:params.type}),
                    height:instance.settings.sprite.height,
                    width:instance.settings.sprite.width
                };
                
                //save the actual projectile to use
                self.view.projectiles[identity] = new ru.projectile({
                    instance:instance,
                    control:control,
                    remove:function() { self.projectiles.remove(identity); },
                    target:params.down 
                        ? self.view.players.player2.bot 
                        : self.view.players.player1.bot
                });
                
                //return the details 
                return params;
            },
            
            //drops a projectile from the game
            remove:function(id) {
                id = ru.util.alias(id);
                delete self.view.projectiles[id];
            },
            
            //updates and draws each of the projectiles
            update:function() {
                ru.util.each(self.view.projectiles, function(item) {
                    self._update(item);
                });
            }
        },

        //on screen effects for the game
        effects:{
            id:0,
            add:function(params) {
                var identity = "i"+(self.effects.id++);
                var image = ru.resource.load({name:params.name});
                
                //display into the view
                self.view.effects[identity] = new ru.effect({
                    image:image,
                    x:params.x - (params.center ? (image.resource.width / 2) : 0),
                    y:params.y - (params.center ? (image.resource.height / 2) : 0),
                    remove:function() { self.effects.remove(identity); },
                    live:params.live
                });
            },
            
            //drops a projectile from the game
            remove:function(id) {
                id = ru.util.alias(id);
                delete self.view.effects[id];
            },
            
            //updates and draws each of the projectiles
            update:function() {
                ru.util.each(self.view.effects, function(item) {
                    self._update(item);
                });
            }
        
        },
        
        //the current units in the game
        view:{
            hud:new ru.hud({ game:self, canvas:options.canvas, weapons:options.weapons, player1:options.player1, player2:options.player2 }),
            projectiles:{},
            effects:{},
            players:{
                player1:new ru.player(options.player1, options, false),
                player2:new ru.player(options.player2, options, true),
                playerIsDead:function() {
                    return self.view.players.player1.isDead() ||
                        self.view.players.player2.isDead();
                }
            },
            background:new ru.background(options.background)
        },
        
        //verifies game state information
        state:{
        
            //checks the players for status changes
            update:function() {
                if (self.view.players.playerIsDead())
                    self.state.end();
            },
            
            //ends the game 
            end:function() {
                self.view.players.player1.stop();
                self.view.players.player2.stop();
                
                //clear out all projectiles
                self.view.effects = {};
                self.view.projectiles = {};
                
            }
        
        },
        
        //updates the timeline for the game
        update:function() {
        
            //repaint the view
            self._update(self.view.background);
            
            //update each of the players
            self._update(self.view.players.player1);
            self._update(self.view.players.player2);
        
            //update the bullets in the view
            self.projectiles.update();
            
            //update the special effects
            self.effects.update();
            
            //finally check the game state
            self.state.update();
            
            //then the hud view
            self._update(self.view.hud);
            
            //update the view
            self.canvas.update();
        },
        
        //performs common updating calls
        _update:function(unit) {
            unit.update(self);
            unit.draw(self.canvas, self);
        },

        //prepares the game to run
        begin:function() {
        
            //start the loading interval
            var rate = parseInt(1000 / options.fps);
            window.setInterval(self.update, rate);
        }

    };
    
    //share the game throughout
    options.game = self;

    //updates the game info
    this.begin = self.begin;
};