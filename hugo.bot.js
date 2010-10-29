var hugobot = function() {
    var self = {
    
        //game: current state of the game
        //unit: the position and actions for your bot
        update:function(game, unit) {
            unit.position.x += 4;
        
        }
    };
    
    //the update options
    this.update = self.update;
    this.image = "resources/delete-icon.png";
    this.height = 100;
    this.width = 100;
};