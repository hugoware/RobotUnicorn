var hugobot = function() {
    var self = {
        
        state:{
            left:true,
            speed:5
        },
        
        //game : current state of the game
        //bot  : the position and actions for your bot
        update:function(game, bot) {
            
            switch(ru.util.random(100)) {
                case 0: bot.shoot("lazer");
                    break;
                case 1: self.state.left = true;
                    break;
                case 2: self.state.left = false;
                    break;
                case 3: bot.shoot("burst");
                    break;
                case 4: bot.shoot("tracker");
                    break;
                case 4: throw "sample exception!";
                    break;
            }
        
            //moving left and right
            if (self.state.left) {
                bot.position.x -= self.state.speed;
            }
            else {
                bot.position.x += self.state.speed;
            }
            
            //stay in the view
            if (bot.position.x <= 50) self.state.left = false;
            if (bot.position.x >= game.view.width - 150) self.state.left = true;
            
        }
    };
    
    //must expose an update function
    this.update = self.update;
    
    //and a name for your bot
    this.name = "HugoBOT!";
    this.weapons = ["burst", "lazer", "tracker"];
};