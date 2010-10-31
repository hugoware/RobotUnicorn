var ru = {};
ru.core = new function() {
    var self = {
        game:null,
    
        //begins initalizing the game
        create:function(options) {
            self.create = self.reset;
            self.reset(options);
        },
        
        //restarts the game over
        reset:function(options) {
        
            //preload the resources
            var waiting = 0;
            ru.util.each(options.preload, function(item) {
                waiting++;
                
                //set a job to count the loading attempts
                item.loaded = function() {
                    if (--waiting > 0) return;
                    self._start(options);
                };
                
                //start the request
                ru.resource.load(item);
                
            });
            
        },
        
        //finally starts the game after resources have been loaded
        _start:function(options) {
            setTimeout(function() { 
                self.game = new ru.game(options);
                self.game.begin();
            }, options.delay);
        }
    
    };
    
    //creates a new game entirely
    this.create = self.create;
    this.reset = self.reset;
    
};