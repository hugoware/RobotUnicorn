var keaganbot = function() {
    var self = {
        
        right:true,
        speed:3,
                
                weapon:"tracker",
                speedFireWeapon:function(unit) {
                        weapon = "tracker";
                        if(!unit.ready("tracker"))
                        {
                                weapon = "burst";
                                if(!unit.ready("burst"))
                                {
                                        weapon = "lazer";
                                }
                        }
                        if (unit.ready(weapon)) unit.shoot(weapon);
                },
                
                isProjectileInfront:function() {
                
                },
                dash:function() {
                        
                },
                wallBounce:function(unit) {
                        if(unit.position.x >= 850 || unit.position.x <= 150)
                        {
                                self.right = !self.right;
                                self.speed = 1;
                                self.speed *= -1;
                        }
                },
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            self.wallBounce(unit);
                        unit.position.x += self.speed;
                        
                        self.speedFireWeapon(unit);
                        
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //name and preferred weapons
    this.name = "KeaganBot";
    this.weapons = ["burst", "lazer", "tracker"];
};
