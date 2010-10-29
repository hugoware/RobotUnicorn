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
            unitState:function(unit) {
                return {
                    position:{
                        x:unit.position.x,
                        y:unit.position.y,
                    }
                };
            },

            //returns game information for a turn
            gameState:function() {
                return {
                };
            }

        },

        //checks the state of a bot
        check:function(bot) {

            //get the info for this turn
            var game = self.create.gameState();
            var unit = self.create.unitState(bot);
            var control = null;

            //try and perform the work
            try { bot.update(game, unit); }
            catch (e) { unit.error = e.toString(); }

            //handle refreshing the view
            self.validate(bot, unit, game);
        },

        //make sure the unit isn't cheating
        validate:function(bot, unit) {
            bot.position.x = unit.position.x;
            self.refresh(bot);
        },

        //handles drawing the bot into the view
        refresh:function(bot) {
        
            //draw the new position for the bot
            self.canvas.draw({
                resource:bot.resource,
                x:bot.position.x,
                y:bot.position.y
            });

        },

        //gets a unit ready for use
        prepare:function(unit) {
        
            //load in the required resources
            self.resource.load.image({
                name:unit.name,
                url:unit.image,
                height:unit.height,
                width:unit.width
            });
            
            //grab the image to use
            unit.resource = self.resource.find.image(unit.name);
            
            //update the starting parameters
            unit.position = {
                x:0,
                y:0
            };
        
        },
        
        //updates the timeline for the game
        update:function() {
        
            //update the bot positions
            self.check(self.bots.keagan);
            self.check(self.bots.hugo);
            
            //update the bullets in the view
            //self.projectiles.update();
            
            //update the view
            self.canvas.update();
            
        },

        //prepares the game to run
        begin:function() {
        
            //prepare the views
            self.prepare(self.bots.keagan);
            self.prepare(self.bots.hugo);
            
            //update the second player
            self.bots.hugo.position.y = 300;
            
            //start the loading interval
            window.setInterval(self.update, 33);
        }

    };

    //updates the game info
    this.begin = self.begin;
};