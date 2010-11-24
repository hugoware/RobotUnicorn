var keaganbot = function() {
    var self = {
        game:null,
        unit:null,
        
        
                right:true,
                speed:3,
                prevSpeed:0,
                weapon:"tracker",
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
                        self.speed += self.right?7:-7;
                },
                wallBounce:function() {
                        if(self.unit.position.x >= 850 || self.unit.position.x <= 150)
                        {
                                self.right = !self.right;
                                self.speed = 1;
                                self.speed *= -1;
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
                    self.wallBounce();
                    self.unit.position.x += self.speed;
                },
                sync:function(game, unit) {
                    self.game = game;
                    self.unit = unit;
                    self.prevSpeed = (self.speed != self.prevSpeed)?self.speed:self.prevSpeed;
                    self.projectiles.active = game.enemy.projectiles;
                },
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            self.sync(game, unit);
            
            self.progressMovement();            
            
            self.speedFireWeapon(unit);
            self.dash(self.detectProjectileinFront());
            self.speed = self.prevSpeed;
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //name and preferred weapons
    this.name = "KeaganBot";
    this.weapons = ["burst", "lazer", "tracker"];
};
