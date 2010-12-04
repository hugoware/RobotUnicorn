var keaganbot = function() {
    var self = {
        logging:true,       
               
        game:null,
        unit:null,
        
        right:true,
        speed:3,
        prevSpeed:0,
        weapon:"tracker",
        
        log:function(input){if(self.logging) console.log(input);},
        
        state:{
            dashed:{
                occured:false,
                lastSpeed:null
            },
            dangerStates:{
                generalDanger:false,
                centerDanger:false,
                flank_leftDanger:false,
                flank_rightDanger:false
            }
        },
        
        dangerZones:{
          center:function(){
            return {
                x:self.unit.position.x,
                y:self.unit.position.y + 100,
                width:self.unit.position.width,
                height:100
            };
          },
          flank:{
            left:function(){
                return {
                    x:self.unit.position.x - 150,
                    y:self.unit.position.y + 50,
                    width:self.unit.position.width + 50,
                    height:100
                    };
            },
            right:function(){
                return {
                    x:self.unit.position.x + self.unit.position.width,
                    y:self.unit.position.y + 50,
                    width:self.unit.position.width + 50,
                    height:100
                    };
            }
          }
        },
        
        projectiles:{
                active:{}
        },
        
        //Start of Methods
        //Firing methods
        speedFireWeapon:function() {
                weapon = "tracker";
                if(!self.unit.ready("tracker"))
                {
                        weapon = "burst";
                        if(!self.unit.ready("burst"))
                        {
                                weapon = "lazer";
                        }
                }
                if (self.unit.ready(weapon)) self.unit.shoot(weapon);
        },
        
        //Checking methods
        _checkContain:function(projX, projY, box) {
		return !(
		    projX < box.x ||
		    projX > (box.x + box.width) ||
		    projY < box.y ||
		    projY > (box.y + box.height)
		    );
        },
        detectProjectileinFront:function() {
              for(var projectile in self.projectiles.active)
              {
                var item = self.projectiles.active[projectile];
                
                if(item.x >= self.unit.position.x&&
                        item.x <= self.unit.position.x + self.unit.position.width)
                {
                    self.log("Danger!");
                    return true;
                }
              }
              return false;
        },
        calculateDanger:function(){
            //check the projectiles
	    for (var item in self.projectiles.active) {
		var projectile = self.projectiles.active[item];
                self.state.dangerStates.centerDanger = self._checkContain(projectile.x+projectile.width/2, projectile.y, self.dangerZones.center());
                self.state.dangerStates.flank_leftDanger = self._checkContain(projectile.width, projectile.y, self.dangerZones.flank.left());
                self.state.dangerStates.flank_rightDanger = self._checkContain(projectile.x, projectile.y, self.dangerZones.flank.right());
            }
            
            if(self.state.dangerStates.centerDanger || self.state.dangerStates.flank_leftDanger || self.state.dangerStates.flank_rightDanger)
                self.state.dangerStates.generalDanger = true;
        },
        
        
        //Movement Functions
        dash:function(projectileInfront) {
            if(projectileInfront)
            {
                self.state.dashed.lastSpeed = self.speed;
                self.speed = self.right?9:-9;
                self.state.dashed.occured = true;
            }
        },
        wallBounce:function() {
                if((self.unit.position.x >= self.game.view.width - 150 && self.right == true) || (self.unit.position.x <= 150 && self.right == false))
                {
                        self.right = !self.right;
                        self.speed *= -1;
                        self.log("called flip");
                }
        },
        forceBounce:function() {
            self.right = !self.right;    
            self.speed *= -1;
            self.log("force called flip");
        },
        progressMovement:function() {
            self.wallBounce();
            self.unit.position.x += self.speed;
        },
        stealthMovement:function(){
            //If in danger we are going to move... else sit still
            if(self.state.dangerStates.generalDanger)
            {
                if(self.right == true)
                {
                    if(self.state.dangerStates.flank_rightDanger)
                    {
                        self.forceBounce();
                        self.dash(true);
                    }
                }
                else if(self.right == false)
                {
                    if(self.state.dangerStates.flank_leftDanger)
                    {
                        self.forceBounce();
                        self.dash(true);
                    }
                    
                }
                if(self.state.dangerStates.centerDanger)
                    self.dash(true);
            }
            self.progressMovement();
        },
        
        //Beginning functions
        sync:function(game, unit) {
            self.game = game;
            self.unit = unit;
            self.speed = self.state.dashed.occured?self.state.dashed.lastSpeed:self.speed;
            self.projectiles.active = game.enemy.projectiles;
            self.dispose();
        },
        dispose:function() {
            //Make sure that I don't dash again
            self.state.dashed.occured = false;
            
            //Turn dangerStates off again
            self.state.dangerStates.generalDanger = false;
            self.state.dangerStates.centerDanger = false;
            self.state.dangerStates.flank_leftDanger = false;
            self.state.dangerStates.flank_rightDanger = false;
        },
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            self.sync(game, unit);
            
            self.calculateDanger();
            
            //General
            //self.progressMovement();
            
            //Dodge
            self.stealthMovement();
            
            self.speedFireWeapon();
            
            if(self.logging)
            {
                self.game.target(self.dangerZones.center());
                self.game.target(self.dangerZones.flank.left(), "#fff");
                self.game.target(self.dangerZones.flank.right(), "#303");
            }
            
            
            //self.speedFireWeapon(unit);
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //name and preferred weapons
    this.name = "KeaganBot";
    this.weapons = ["burst", "lazer", "tracker"];
};
