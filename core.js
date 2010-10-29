var ru = {};
ru.core = (function() {
    var self = {
        game:null,
        canvas:null,

        //prepares the application
        init:function() {

            //create the canvas view
            self.canvas = new ru.canvas({
                target: "view",
                height: "500px",
                width: "600px"
            });
            
            //start the loop
            self.game = new ru.game({
                canvas:self.canvas
            });
            self.game.begin();
            
        }
    };
    
    //start the game 
    window.ru = self;
    window.setTimeout(self.init, 1000);
})();