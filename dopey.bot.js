var dopeybot = function() {
    var self = {
        
        state:{
            left:true,
            speed:1
        },
        
        //game : current state of the game
        //bot  : the position and actions for your bot
        update:function(game, bot) {
			game.enemy.position.x = 10;
			bot.position.x -= bot.speed;
            bot.shoot("tracker")
            switch(ru.util.random(100)) {
                case 0: bot.shoot("lazer");
                    break;
                // case 4: throw ru.util.pick(
                    // "What does this button do?",
                    // "Restroom break - BRB dudez...",
                    // "Self-destruct? Uh oh!",
                    // "Pitch? Yaw? Bah... just details..."
                    // );
                    // break;
            }
            
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //and a name for your bot
    this.name = "Dopey Bot";
    this.weapons = ["tracker"];
};