var hugobot = function() {
    var self = {
	bot:null,
	game:null,
	    
	//writes a log message
	logging:false,
	log:function(msg) { if (self.logging) console.log(msg); },
	
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
	
	//helper methods
	util:{
	    
	    //grabs a random number within a range
	    random:function(min, max) {
		
		//if just passed in a min value
		if (max == null) {
		    max = min;
		    min = 0;
		}
		
		//get the range
		return Math.min(Math.max(0, (Math.random() * max)), max) + min;
		
	    }
	    
	},
	
	//manages the state of the bot
	pos:{
	    
	    //checks for boundaries in the view
	    boundary:{
		
		//gets the current boundaries
		current:function() {
		    var state = {
			left:self.pos.boundary.left(),
			right:self.pos.boundary.right()
		    };
		    if (state.right) self.log("blocked right");
		    if (state.left) self.log("blocked left");
		    return state;
		},
		
		//at the right side of the screen
		right:function() {
		    return ((self.bot.position.x + self.bot.position.width)) > (self.game.view.width - 150);
		},
		
		//at the right left of the screen
		left:function() {
		    return (self.bot.position.x) > (self.game.view.width + 50);
		}
	    },
	    
	    //compares two locations
	    hit:function(point, rec) {
		if (point.height && point.width) {
		    window.d = { p: point, r: rec };
		    return self.pos._check(point.x, point.y, rec) ||
			self.pos._check(point.x + point.width, point.y, rec) ||
			self.pos._check(point.x, point.y + point.height, rec) ||
			self.pos._check(point.x + point.width, point.y + point.height, rec);
		}
		else {
		    return self.pos._check(point.x, point.y, rec);
		}
		
		//ugh.. okay IDE... if you say so...
		//returning false since apparently this function
		//won't return a value in all instances
		return false;
	    },
	    
	    //returns if the enemy is in the target area or not
	    target:{
		narrow:function() {
		    return self.pos.hit(self.game.enemy.position, self.pos.danger.zones.target.narrow());
		},
		medium:function() {
		    return self.pos.hit(self.game.enemy.position, self.pos.danger.zones.target.medium());
		},
		wide:function() {
		    return self.pos.hit(self.game.enemy.position, self.pos.danger.zones.target.wide());
		}
	    },
	    
	    //checks the coordinates
	    _check:function(x, y, rect) {
		return !(
		    x < rect.x ||
		    x > (rect.x + rect.width) ||
		    y < rect.y ||
		    y > (rect.y + rect.height)
		    );
	    },
	    
	    //checks for if the bot is in danger
	    danger:{
		
		//general area checking for danger
		nearby:function() {
		    var zone = self.pos.danger.zones.nearby();
		    
		    //details to check for danger
		    var detail = {
			center:0,
			left:0,
			right:0,
			near:[]
		    };
		    
		    //check the projectiles
		    for (var item in self.game.enemy.projectiles) {
			var projectile = self.game.enemy.projectiles[item];
			if (self.pos.hit(projectile, zone)) {
			    if (self.logging) self.game.target(projectile, "#0f0");
			    
			    //check for hits
			    var right = self.pos.danger.right(projectile);
			    var left = self.pos.danger.left(projectile);
			    var center = self.pos.danger.center(projectile);
			    
			    //update the danger areas
			    detail.center += center ? 1 : 0;
			    detail.right += right ? 1 : 0;
			    detail.left += left ? 1 : 0;
			    
			    //add this detail item
			    detail.near.push({
				left:left,
				right:right,
				center:center,
				projectile:projectile
			    })
			    
			}   
		    }
		    
		    //return the final object
		    detail.any = detail.near.length > 0;
		    return detail;
		
		},
		
		//checking for danger on the right side of the ship
		right:function(projectile) {
		    return self.pos.hit(projectile, self.pos.danger.zones.right());
		},
		
		//checking for danger on the left side of the ship
		left:function(projectile) {
		    return self.pos.hit(projectile, self.pos.danger.zones.left());
		},
		
		//checking for danger on the left side of the ship
		center:function(projectile) {
		    return self.pos.hit(projectile, self.pos.danger.zones.center());
		},
		
		//areas to check for danger
		zones:{
		    distance:{
			height:320,
			top:200
		    },
		    
		    //any projectiles in the area
		    nearby:function() {
			return {
			    x:self.bot.position.x - 100,
			    y:self.bot.position.y - self.pos.danger.zones.distance.top,
			    width:self.bot.position.width + 200,
			    height:self.pos.danger.zones.distance.height
			};
		    },
		    
		    //is a projectile to the right side
		    right:function() {
			return {
			    x:self.bot.position.x + 100,
			    y:self.bot.position.y - self.pos.danger.zones.distance.top,
			    width:self.bot.position.width,
			    height:self.pos.danger.zones.distance.height
			};
		    },
		    
		    //is a projectile to the left side
		    left:function() {
			return {
			    x:self.bot.position.x - 100,
			    y:self.bot.position.y - self.pos.danger.zones.distance.top,
			    width:self.bot.position.width,
			    height:self.pos.danger.zones.distance.height
			};
		    },
		    
		    //is the projectile in the center
		    center:function() {
			return {
			    x:self.bot.position.x - 25,
			    y:self.bot.position.y - self.pos.danger.zones.distance.top,
			    width:self.bot.position.width + 50,
			    height:self.pos.danger.zones.distance.height
			};
		    },
		    
		    //the targeting for the player
		    target:{
			narrow:function() {
			    return {
				x:self.bot.position.x + 30,
				y:0,
				width:self.bot.position.width - 60,
				height:150
			    };
			},
			medium:function() {
			    return {
				x:self.bot.position.x,
				y:0,
				width:self.bot.position.width,
				height:150
			    };
			},
			wide:function() {
			    return {
				x:self.bot.position.x - 125,
				y:0,
				width:self.bot.position.width + 250,
				height:150
			    };
			}
		    }
		}
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
	    invert:function() { self.state.left = !self.state.left; }
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
		return;
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
		    
		    var danger = self.pos.danger.nearby();
		    var boundary = self.pos.boundary.current();
		    if (danger.any) {
			
			//always start moving if danger is centered
			self.state.moving = danger.center > 0;
			
			//if moving check the directions
			if (danger.left > 0 && danger.left > danger.right) self.state.left = false;
			else if (danger.right > 0 && danger.right > danger.left) self.state.left = true;
			
			//also check for boundaries
			if (boundary.right) self.state.left = true;
			else if (boundary.left) self.state.left = false;

			//move at max speed
			if (self.state.moving) self.move(self.bot.speed);
			
		    }
		    //if no danger keep moving around
		    else {
			self.state.moving = true;
			
			//move to the enemy
			self.state.left = self.game.enemy.position.x < self.bot.position.x;
			
			//move a random distance
			if (self.state.moving) self.move(self.util.random(self.bot.speed));
		    }
		    
		    //fire at will!
		    if (self.pos.target.narrow()) {
			if (self.bot.ready("burst")) self.bot.shoot("burst");
		    }
		    //loose finding for lazers
		    if (self.pos.target.medium()) {
			if (self.bot.ready("lazer")) self.bot.shoot("lazer");
		    }
		    //wider areas go ahead and shoot
		    if (self.pos.target.wide()) {
			if (self.bot.ready("tracker")) self.bot.shoot("tracker");
		    }
		    
		}
	    
	    }
	
	},
		    
        //game : current state of the game
        //bot  : the position and actions for your bot
        update:function(game, bot) {
    
	    //sync the state of the bot
	    self.state.sync(game, bot);
	    
	    //the scan area
	    if (self.logging) {
		self.game.target(self.bot.position);
		self.game.target(self.pos.danger.zones.nearby(), "#0ff");
		self.game.target(self.pos.danger.zones.left(), "#ff0");
		self.game.target(self.pos.danger.zones.right(), "#ff0");
		self.game.target(self.pos.danger.zones.center(), "#ff0");
		self.game.target(self.pos.danger.zones.target.narrow(), "#f0f");
		self.game.target(self.pos.danger.zones.target.medium(), "#808");
		self.game.target(self.pos.danger.zones.target.wide(), "#303");
	    }
	    
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