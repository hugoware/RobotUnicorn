var keaganbot = function() {
    var self = {
        game:null,
        unit:null,
        
        
                right:true,
                speed:3,
                prevSpeed:0,
                weapon:"tracker",
                actionStates:{
                    dashed:{
                        occured:false,
                        lastSpeed:null
                    }
                },
                projectiles:{
                        active:{}
                },
                //Start of Methods
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
                
                isProjectileInfront:function() {
                
                },
                dash:function(projectileInfront) {
                    if(projectileInfront)
                    {
                        self.actionStates.dashed.lastSpeed = self.speed;
                        self.speed = self.right?9:-9;
                        self.actionStates.dashed.occured = true;
                    }
                },
                wallBounce:function() {
                        if((self.unit.position.x >= 850 && self.right) || (self.unit.position.x <= 150 && !self.right))
                        {
                                self.right = !self.right;
                                self.speed *= -1;
                                //console.log("called flip");
                        }
                },
                detectProjectileinFront:function() {
                      for(var projectile in self.projectiles.active)
                      {
                        var item = self.projectiles.active[projectile];
                        //console.log(item.x);
                        self.game.target({
                            x:self.unit.position.x,
                            y:0,
                            width:self.unit.position.width,
                            height:600
                            }, "#0ff");
                        self.game.target(item,"#fff");
                        if(item.x >= self.unit.position.x&&
                                item.x <= self.unit.position.x + self.unit.position.width)
                        {
                            console.log("Danger!");
                            return true;
                        }
                      }
                      return false;
                },
                progressMovement:function() {
                    self.dash(self.detectProjectileinFront());
                    
                    self.wallBounce();
                    self.unit.position.x += self.speed;
                },
                sync:function(game, unit) {
                    self.game = game;
                    self.unit = unit;
                    self.speed = self.actionStates.dashed.occured?self.actionStates.dashed.lastSpeed:self.speed;
                    self.projectiles.active = game.enemy.projectiles;
                    self.dispose();
                },
                dispose:function() {
                    self.actionStates.dashed.occured = false;
                },
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            self.sync(game, unit);
            
            self.progressMovement();            
            
            self.speedFireWeapon(unit);
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //name and preferred weapons
    this.name = "KeaganBot";
    this.weapons = ["burst", "lazer", "tracker"];
};
