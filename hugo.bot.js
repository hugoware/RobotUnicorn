var hugobot = function() {
    var self = {
    	//successful get
    
        //battle pattern
        pattern:{
            current:"delta",
            delta:function(game, bot) {
                bot.position.x += bot.speed /5;
                if (bot.ready("lazer")) bot.shoot("lazer");
            }
        },
    
        //game : current state of the game
        //bot  : the position and actions for your bot
        update:function(game, bot) {
            self.pattern[self.pattern.current](game, bot);
            
            
            
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //and a name for your bot
    this.name = "Hugoware";
    this.weapons = ["burst", "lazer", "tracker"];
};