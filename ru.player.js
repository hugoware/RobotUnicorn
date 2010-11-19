//common update and manage functionality
ru.player = function(bot, options, isPlayer2) {
	var enemy;
    var self = {
		
        //parameters for all bots
        settings:{
            yPadding:40,
            xPadding:50
        },
        
        //ship icon to use
        ship:ru.resource.load({name:isPlayer2 ? "player2" : "player1"}),
        
        //displays the bot in the view
        draw:function(canvas) {
            if (self.state.isDead()) return;
            canvas.draw({
                resource:self.ship.resource,
                x:bot.position.x,
                y:bot.position.y,
                flip:isPlayer2
            });
        },
    
        //updates a bot based on the game state
        update:function(game) {
            if (self.pause) return;
        
            //if the bot has an error, skip the turn
            if (bot.error) return self.manage.error();
        
            //prepare the game states
            var control = self.manage.state.bot();
            var state = self.manage.state.game(game);
            
            //let the bot have a turn
            try { bot.update(state, control.instance); }
            catch (e) { bot.error = "Exception: " + e.toString(); }
            
            //then apply the changes
            self.manage.apply(game, control, state);
        
        },
        
        //handles checking that the bot is following rules
        manage:{
        
            //handles errors for a unit
            error:function(game) {
                
                //apply the penalty
                if (bot.errorDelay == null) {
                    options.game.effects.add({
                        name:"exception",
                        live:options.unit.errorDelay,
                        x:bot.position.x + (bot.position.width / 2),
                        y:bot.position.y + (bot.position.height / 2),
                        center:true
                    });
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
                        },
						enemy:{//All of the opponents information
							projectiles:game.projectiles.grab(!isPlayer2),
							position:{
								x:enemy.position.x,
								y:enemy.position.y,
								width:self.ship.width,//Not Entirly Accurate
                                height:self.ship.height
							},
							health:enemy.life.current,
                            speed:options.unit.speed,
							ready:function(weapon) {
                                weapon = ru.util.alias(weapon || "lazer");
                                return enemy.cooldown[weapon] && enemy.cooldown[weapon] <= 0;
                            }
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
							health:bot.life.current,
                            speed:options.unit.speed,
                            shoot:function(weapon) {
                                state.action = "shoot";
                                state.weapon = ru.util.alias(weapon || "lazer");
                            },
                            ready:function(weapon) {
                                weapon = ru.util.alias(weapon || "lazer");
                                return bot.cooldown[weapon] && bot.cooldown[weapon] <= 0;
                            },
                            previous:bot.previous
                        },
                        action:null,
                        weapon:null
                    };
                    return state;
                }
            
            },
            
            //attempts to apply the requested rules for a turn
            apply:function(game, control, state) {
            	var status = { game:game, control:control, state:state };
            	
            	//verifies no rules have been broken
            	var apply = [];
            	for (var i = 0; i < self.manage.rules.length; i++) {
            		var rule = self.manage.rules[i];
            		
            		//if returning true apply the rule
            		//if returning false, cause an error
            		//if returning null, do not crash, but do not apply
            		//if an exception, display as an error
            		try {
	            		//verify this works
		        		var result = rule.require(status);
	            		if (result === true) {
		            		apply.push(rule);
	            		} 
	            		else if (result === false) {
	            			throw rule.error;
	            		}
            		}
            		//append an error
            		catch(e) {
            			bot.error = e || "Exception : No idea?!?!?";
            			apply = [];
            			break;
            		}
            	
            	}
            	
				//apply the changes (if any)
				for(var item in apply) apply[item].apply(status);
            	
            	//lastly, cleanup for the bot
            	self.manage.housekeeping(game, control, state);
            	
            },
            
            //cleanup functions for the bots
            housekeeping:function(game, control, state) {
            	
                //stay in the view (not an error for now)
                var max = { left:self.settings.xPadding, right:state.view.width - (bot.position.width + self.settings.xPadding) };
                if (bot.position.x < max.left) bot.position.x = max.left;
                if (bot.position.x > max.right) bot.position.x = max.right;
                
                //refresh the unit
                for(var item in bot.cooldown) {
                    bot.cooldown[item]--;
                }
                
                //update the last state for the unit
                control.instance.position = ru.util.clone(bot.position);
                bot.previous = control.instance;
            
            },
            
            //validation to make sure the bot behaves
            //in an acceptable manner
			rules:[
				{// make sure the bot moved an allowed distance
					require:function(status) { 
						return Math.abs(bot.position.x - status.control.instance.position.x) <= options.unit.speed
					}, 
					apply:function(status) { bot.position.x = status.control.instance.position.x; },
					error:"Exception: Moved too far on a turn!"
				},
				
				{//make sure the gun is ready to fire
					require:function(status) {
						if (status.control.action != "shoot") return;
						if (bot.cooldown[status.control.weapon] > 0) return false;
						return true;
					},
					apply:function(status) {
	                    var projectile = options.game.projectiles.add({
	                        type:status.control.weapon,
	                        startX:bot.position.x + (bot.position.width / 2),
	                        startY:bot.position.y + (isPlayer2 ? 0 : bot.position.height),
	                        down:!isPlayer2
	                    });
	                    bot.cooldown[status.control.weapon] = projectile.cooldown;
					},
					error:"Exception: Fired weapon before it was ready!"
				}
			]
        
        },
        
        //returns details about the current bot
        state:{
            isDead:function() {
                return bot.life.current <= 0;
            }
        },
        
        //causes the unit stop actions
        stop:function() {
            self.pause = true;
            bot.error = null;
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
    
	//Find the enemy bot
	enemy = (bot == options.player1)?options.player2:options.player1;
	
    //common exposed functionality
    this.bot = bot;
    this.remove = self.remove;
    this.update = self.update;
    this.draw = self.draw;
    this.stop = self.stop;
    this.isDead = self.state.isDead;
    
    //prepare the unit
    self.init();
    
};