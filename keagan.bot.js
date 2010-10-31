var keaganbot = function() {
    var self = {
    
        right:true,
        speed:5,
    
    
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            unit.position.x += self.speed;
        }
    };
    
    //the update options
    this.update = self.update;
    this.image = "resources/player-2-ship.png";
};