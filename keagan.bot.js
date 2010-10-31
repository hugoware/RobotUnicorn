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
    
    //must expose an update function
    this.update = self.update;
    
    //name and preferred weapons
    this.name = "KeaganBot";
    this.weapons = ["burst", "lazer", "tracker"];
};