var keaganbetabot = function() {
    var self = {
        logging:false,
        game:null,
        unit:null,
        
        log:function(input){if(self.logging) console.log(input);},//Log output if setting is true
        
        properties:{
          
          dir:{
	    atRightWall:function(){return (((self.unit.position.x + self.unit.position.width)) >= (self.game.view.width - 150));},
	    atLeftWall:function(){return ((self.unit.position.x) <= (50));},
            left:true,
            right:false,
            paused:false
          },
          
          danger:{
	    burstWatch:false,
            center:false,
	    leftFlank:false,
	    rightFlank:false,
	    general:false,
	    multi:function(){return ((this.center&&this.leftFlank) || (this.center && this.rightFlank) || (this.leftFlank && this.rightFlank));},
	    multiSides:function(){return (this.leftFlank && this.rightFlank);}
          },
          
          attack:{
            
          },
	  
          speed:3,
	  safeSpeedInc:function(){return (self.unit.speed - self.properties.speed);}
        },  
        
	manuvers:{
	  
	  evasive:function(){
	    if(self.properties.danger.general)//If in danger at all
	    {
		
		if(self.properties.danger.multi())//If multiple sides are in danger
		{
		    if(self.properties.danger.multiSides())//If both sides sit still
			self.properties.dir.paused = true;
		    self.movement.invertDirection();//If 'cornered' turn around and dash
		    self.manuvers.dash();
		}
		else{//If only in danger on one side
		    //((self.properties.dir.left && self.properties.danger.rightFlank) || (self.properties.dir.right && self.properties.danger.leftFlank))
		    //States that should be fine
		    if(self.properties.danger.center)
		    {//If danger in the center
			self.manuvers.dash();
		    }
		    if(((self.properties.dir.right && self.properties.danger.rightFlank) || (self.properties.dir.left && self.properties.danger.leftFlank)))
		    {//If danger is infront and moving the same dir
			//self.movement.invertDirection();
			//self.manuvers.dash();
			self.properties.dir.paused = true;
		    }
		}
	    }
	  },
	  
	  dash:function(){
	    var safeSpeed = self.properties.safeSpeedInc();
	    
	    if(self.properties.dir.left)
		safeSpeed *= -1;
	    
	    self.unit.position.x += safeSpeed;
	  },
	  
	  speedFireWeapon:function() {
                if(!self.unit.ready(weapon = "burst"))
		{
		    if(!self.unit.ready(weapon = "tracker"))
		    {
		    
			    weapon = "lazer";
		    }
                }
                if (self.unit.ready(weapon)) self.unit.shoot(weapon);
	  }
	},
	
        activityZones:{
           
           dangerZones:{
	    
	    calculateDanger:function(){
		//check the projectiles
		for (var item in self.game.enemy.projectiles) {
		    var projectile = self.game.enemy.projectiles[item];
		    if (self.activityZones.checkZones(projectile, this.centerZone())) {
			if (self.logging) self.game.target(projectile, "#0ff");
			self.properties.danger.center = true;
		    }
		    else{//If the projectile isn't in the center zone
			if(self.activityZones.checkZones(projectile, this.flankZones.leftZone())){
			    if (self.logging) self.game.target(projectile, "#ff0");
			    self.properties.danger.leftFlank = true;
			}
			else{//If the projectile isn't in the left zone
			    if(self.activityZones.checkZones(projectile, this.flankZones.rightZone())){
			        if (self.logging) self.game.target(projectile, "#ff0");
				self.properties.danger.rightFlank = true;
			    }
			}
		    }
		    if(self.properties.danger.center || self.properties.danger.leftFlank || self.properties.danger.rightFlank)//If any are in danger set general to true
			self.properties.danger.general = true;
		    
		}
	    },
	    
	    burstWatchZone:function(){
		return {
                    x:self.unit.position.x,
                    y:self.unit.position.y + 370,
                    width:self.unit.position.width,
                    height:40
                    };	
	    },
	    
            centerZone:function(){
                return {
                    x:self.unit.position.x,
                    y:self.unit.position.y + 100,
                    width:self.unit.position.width,
                    height:100
                    };
            },
            flankZones:{
                leftZone:function(){
                    return {
                        x:self.unit.position.x - 150,
                        y:self.unit.position.y + 40,
                        width:self.unit.position.width + 50,
                        height:100
                        };
                },
                rightZone:function(){
                    return {
                        x:self.unit.position.x + self.unit.position.width,
                        y:self.unit.position.y + 40,
                        width:self.unit.position.width + 50,
                        height:100
                        };
                }
            }
           },
           
           enemyZones:{
            
           },
           
           checkZones:function(point, rect){
            if (point.height && point.width) {
		return this._check(point.x, point.y, rect) ||
		    this._check(point.x + point.width, point.y, rect) ||
		    this._check(point.x, point.y + point.height, rect) ||
		    this._check(point.x + point.width, point.y + point.height, rect);
	    }
	    return this._check(point.x, point.y, rect);
           },
           
           _check:function(x, y, rect){
            return !(x < rect.x || x > (rect.x + rect.width) ||
		    y < rect.y || y > (rect.y + rect.height) );
           }
           
        },
        
        movement:{
          
          progress:function(){
            if(!self.properties.dir.paused)
	    {
		this._wallBounceCheck();
            
		var adjSpeed = self.properties.speed;
		
		if(self.properties.dir.left)
		    adjSpeed *= -1;
		
		self.unit.position.x += adjSpeed;
	    }
          },
          
	  invertDirection:function(){
		self.properties.dir.right = !self.properties.dir.right;
                self.properties.dir.left = !self.properties.dir.left;
	  },
	  
          _wallBounceCheck:function(){
            if((self.properties.dir.atLeftWall()) || (self.properties.dir.atRightWall()))
            {
                this.invertDirection();
                self.log("called flip to the " + (self.properties.dir.right ? "right->":"<-left"));
            }
            this._wallBounceErrorCheck();
          },
          
          _wallBounceErrorCheck:function(){
            if(self.properties.dir.right == self.properties.dir.left)
            {
                self.properties.dir.right != self.properties.dir.left;
                self.log("Error right and left directions the same! Fix applied");
            }
          }
        },
        
        general:{
	    
            syncStates:function(game, unit){
                self.game = game;
                self.unit = unit;
		this.resetState.resetAllStates();
            },
	    
            //game: current state of the game
            //unit: the position and actions for your bot
            update:function(game, unit){
                self.general.syncStates(game, unit);
		
		self.activityZones.dangerZones.calculateDanger();
		
		self.manuvers.evasive();
		
                self.movement.progress();
		
		self.general.showRiticuleBounds();
		
		self.manuvers.speedFireWeapon();
            },
            
	    showRiticuleBounds:function(){
		if(self.logging){
		    self.game.target(self.activityZones.dangerZones.centerZone());
		    self.game.target(self.activityZones.dangerZones.flankZones.leftZone(), "#fff");
		    self.game.target(self.activityZones.dangerZones.flankZones.rightZone(), "#fff");
	    
		    self.game.target(self.activityZones.dangerZones.burstWatchZone(), "#00f");
		}
	    },
	    
	    resetState:{
		resetAllStates:function(){
		  this.resetDangerState();
		  this.resetPausedState();
		},
		
		resetDangerState:function(){
		    self.properties.danger.burstWatch
		    = self.properties.danger.center
		    = self.properties.danger.leftFlank
		    = self.properties.danger.rightFlank
		    = self.properties.danger.general = false;
		},
		
		resetPausedState:function(){
		    self.properties.dir.paused = false;
		}
	    }
        }
    
    };
        
    //must expose an update function
    this.update = self.general.update;
    
    //name and preferred weapons
    this.name = "KeaganBotBeta";
    this.weapons = ["burst", "lazer", "tracker"];
};