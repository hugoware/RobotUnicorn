var keaganbot = function() {
    var self = {
    
        right:true,
        speed:3,
    
    
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
			self.right = self.right == true && unit.position.x < 499 ? true : false;
			self.right = self.right == false && unit.position.x > 0 ? false : true;
            unit.position.x += self.right ? self.speed : -self.speed;
        }
    };
    
    //the update options
    this.update = self.update;
    this.image = "resources/player-2-ship.png";
};