var hugobot = function() {
    var self = {
		bot:null,
		game:null,
		    
		//writes a log message
		log:false ? function(msg) { console.log(msg); } : function() { },
		
		//keeps doing an action for x times
		repeat:function(count, action, end) {
			self.state.wait(count, end, action);
		},
		
		//waits a specified amount of time and performs an action
		wait:function(count, end, action) {
			self.state.timers.push({
				count:count,
				end:end,
				action:action
			})
		},
		
		//manages the state of the bot
		pos:{
			
			//compares two locations
			hit:function(point, rec) {
				if (point.height && point.width) {
					return self.pos._check(point.x, point.y, rec) ||
						self.pos._check(point.x + point.width, point.y, rec)
						self.pos._check(point.x, point.y + point.height, rec)
						self.pos._check(point.x + point.width, point.y + point.height, rec);
				}
				else {
					return self.pos._check(point.x, point.y, rec);
				}
			},
			
			//checks the coordinates
			_check:function(x, y, rect) {
				return !(x < rec.x ||
					y < rec.y || 
					x > (rec.x + rec.width) ||
					y > (rec.y + rec.height)
					);
			},
			
			//checks for if the bot is in danger
			danger:{
				
					
			}
			
		},
		
		//moves the bot by the amount requested
		move:function(by, force) {
			by = Math.max(Math.min(self.bot.speed, by), -self.bot.speed);
			if (!force) by *= self.state.left ? -1 : 1;
			self.bot.position.x += by;
		},
		
		//handles setting directions
		dir:{
			left:function() { self.state.left = true; },
			right:function() { self.state.left = false; },
			invert:function() { self.state.left = !self.state.left; },
		},
		
		//details about the bot
		state:{
			previous:null,
			current:null,
			stationary:true,
			moving:false,
			left:true,
			danger:false,
			panic:0,
			timers:[],
			sync:function(game, bot) {
				self.bot = bot;
				self.game = game;
				
				//only update when the previous state is known
				if (self.state.previous) {
				
					//update the parameters
					self.state.stationary = self.state.previous.x == bot.position.x;
					self.state.moving = !self.state.stationary;
				
				}
				
				//swap positions
				self.state.previous = {
					x:bot.position.x,
					y:bot.position.y
				};
				
				//unit state information
				self.log(
					(self.state.stationary ? "s" : "_") +
					(self.state.moving ? "m" : "_") +
					(self.state.danger ? "d" : "_") +
					(self.state.left ? "<" : ">") +
					(self.state.panic > 0 ? "p" : "_") + 
					" -- x:" + "0000".substr(bot.position.x.toString().length) + (bot.position.x) +
					" p:" + "0000".substr(self.state.previous.x.toString().length) + (self.state.previous.x)
				)
			},
			
			//called at the end of a turn to update
			//state information
			update:function() {
				var timers = self.state.timers;
				self.state.timers = [];
				
				//check for any timer countdowns
				for(var i = 0; i < timers.length; i++) {
					var timer = timers[i];
					
					//if this timer is expiring
					if (timer.remaining-- > 0) {
						if (timer.end) timer.end();
						continue;
					}
					
					//perform the action as needed
					if(timer.action) timer.action();
				}
			}
		},
		
		//battle patterns for the unit
		pattern:{
			current:"alpha",
			
			//performs the current attack pattern
			execute:function() {
				self.pattern.available[self.pattern.current]();
			},
			
			//changes and activates an attack pattern
			activate:function(name) {
				self.pattern.assign(name);
				self.pattern.execute();
			},
			
			//sets the state to use for attack patterns
			assign:function(name) {
				self.pattern.current = name;
			},

			//patterns that can be used			
			available:{
			
				//opening pattern
				alpha:function() {
					if (self.state.stationary) self.dir.invert();
					self.move(self.bot.speed);
					
					//the scan area
					self.game.target({
						x:self.bot.position.x - 100,
						y:self.bot.position.y - 150,
						width:self.bot.position.x + self.bot.position.width + 100,
						height:100
					}, "#0ff")
				}
			
			}
		
		},
		    
        //game : current state of the game
        //bot  : the position and actions for your bot
        update:function(game, bot) {
			game.target(bot.position);
        
        	//sync the state of the bot
        	self.state.sync(game, bot);
        	
        	//handle the current attack pattern
        	self.pattern.execute();
            
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //and a name for your bot
    this.name = "Hugoware";
    this.weapons = ["burst", "lazer", "tracker"];
};