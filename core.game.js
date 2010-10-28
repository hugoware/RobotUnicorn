ru.game = function(options) {
    var self = {
        resource:new ru.resource(),
        canvas:options.canvas,

        //the current units in the game
        bots:{
            keagan:new keaganbot(),
            hugo:new hugobot()
        },

        //handles creating states for units
        create:{

            //returns an object to control the bot
            unitState:function(){

            },

            //returns game information for a turn
            gameState:function() {

            }

        },

        //checks the state of a bot
        check:function(bot) {

            //get the info for this turn
            var game = self.create.gameState();
            var unit = self.create.unitState();
            var control = null;

            //try and perform the work
            try { control = bot.update(state, unit); }
            catch (e) { unit.error = e.toString(); }

            //check for return errors
            if (!control) unit.error = "Error: No control returned from bot!";

            //handle refreshing the view
            self.validate(bot, control, game);
        },

        //make sure the unit isn't cheating
        validate:function(bot, control) {

        },

        //handles drawing the bot into the view
        refresh:function(bot, control) {

        },

        //updates the timeline for the game
        update:function() {
        
            self.update(self.bots.keagan);
            self.update(self.bots.hugo);
        },

        //prepares the game to run
        begin:function() {
        
            //load in the required resources
            
        
            //start the loading interval
            window.setInterval(self.update, 33);
        }

    };

    //updates the game info
    this.begin = self.begin;
};