//common update and manage functionality
ru.player = function(bot, options, isPlayer2) {
    var self = {
    
        //parameters for all bots
        settings:{
            yPadding:40
        },
        
        //ship icon to use
        ship:ru.resource.load({name:isPlayer2 ? "player2" : "player1"}),
        
        //displays the bot in the view
        draw:function(canvas) {
            canvas.draw({
                resource:self.ship.resource,
                x:bot.position.x,
                y:bot.position.y,
                flip:isPlayer2
            });
        },
    
        //updates a bot based on the game state
        update:function(game) {
        
            //if the bot has an error, skip the turn
            if (bot.error) return self.manage.error();
        
            //prepare the game states
            var control = self.manage.state.bot();
            var state = self.manage.state.game(game);
            
            //let the bot have a turn
            try { bot.update(state, control.instance); }
            catch (e) { bot.error = "Exception: " + e.toString(); }
            
            //then apply the changes
            self.manage.apply(game, control);
        
        },
        
        //handles checking that the bot is following rules
        manage:{
        
            //handles errors for a unit
            error:function() {
                
                //apply the penalty
                if (bot.errorDelay == null) {
                    bot.errorDelay = options.unit.errorDelay;
                    bot.life.current -= options.unit.errorPenalty;
                }
                
                //decrease the error time 
                if (bot.errorDelay-- <= 0) {
                    bot.errorDelay = null;
                    bot.error = null;
                }
                
            },
        
            //gets state objects to use with the bot
            state:{
            
                //readable details for the game state
                game:function(game) {
                    return {
                        view:{
                            height:options.canvas.height,
                            width:options.canvas.width,
                        }
                    };
                },
                
                //the control a bot has for a turn
                bot:function() {
                    var state = {
                        instance:{
                            cooldown:ru.util.clone(bot.cooldown),
                            position:{
                                x:bot.position.x,
                                y:bot.position.y,
                                width:self.ship.width,
                                height:self.ship.height
                            },
                            shoot:function(weapon) {
                                state.action = "shoot";
                                state.weapon = ru.util.alias(weapon || "lazer");
                            },
                            ready:function(weapon) {
                                weapon = ru.util.alias(weapon || "lazer");
                                return bot.cooldown[weapon] && bot.cooldown[weapon] <= 0;
                            }
                        },
                        action:null,
                        weapon:null
                    };
                    return state;
                }
            
            },
            
            //attempts to apply the requested rules for a turn
            apply:function(game, control) {
                
                //check the movement
                if (Math.abs(bot.position.x - control.instance.position.x) > control.instance.speed) {
                    bot.error = "Moved too far on a turn!";
                    return;
                }
                //movement is okay
                else {
                    bot.position.x = control.instance.position.x;
                }
                
                //if firing a weapon
                if (control.action == "shoot" && 
                    bot.cooldown[control.weapon] <= 0) {
                    
                    //create a projectile for the view
                    var projectile = game.projectiles.add({
                        type:control.weapon,
                        startX:bot.position.x,
                        startY:bot.position.y,
                        down:!isPlayer2
                    });
                    
                    //update the cooldown
                    bot.cooldown[control.weapon] = projectile.cooldown;
                    
                }
                
                //refresh the unit
                for(var item in bot.cooldown) {
                    bot.cooldown[item]--;
                }
            }
        
        },
        
        //returns details about the current bot
        state:{
            isDead:function() {
                return bot.life.current <= 0;
            }
        },
        
        //prepares this bot for use
        init:function() {
        
            //set the cooldown values
            bot.cooldown = {};
            for (var i = 0; i < Math.min(bot.weapons.length, options.unit.maxWeapons); i++) {
                bot.cooldown[bot.weapons[i]] = 0;
            }
            
            //manage the life of the unit
            bot.life = {
                current:options.unit.life,
                max:options.unit.life
            };
        
            //update the starting parameters
            bot.position = {
                x:(options.canvas.width / 2) - (self.ship.resource.width / 2),
                y:self.settings.yPadding,
                width:self.ship.resource.width,
                height:self.ship.resource.height
            };
            
            //if this is player two, move him to the bottom
            if (isPlayer2) 
                bot.position.y = (options.canvas.height - (self.settings.yPadding + self.ship.resource.height));
        
        }
    
    };
    
    //common exposed functionality
    this.bot = bot;
    this.remove = self.remove;
    this.update = self.update;
    this.draw = self.draw;
    this.isDead = self.state.isDead;
    
    //prepare the unit
    self.init();
    
};