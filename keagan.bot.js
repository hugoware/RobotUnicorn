var keaganbot = function() {
    var self = {
    
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            unit.position.x += unit.speed;
        
            //return control actions for this bot
            return control;
        }
    };
    
    //the update options
    this.update = self.update;
    this.image = "resources/keagan-ship.jpg";
    this.height = 100;
    this.width = 100;
};