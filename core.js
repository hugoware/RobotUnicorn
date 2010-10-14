var ru = {};
ru.core = (function() {
    var self = {

        //prepares the application
        init:function() {

            //initialize the canvas
            ru.canvas.init({
                target: "view",
                height: "100%",
                width: "100%"
            });

            //start the game loop
            //setTimeout(ru.game.loop, 33);

        }

    };

    //public members
    return {

        /**
         * starts the game in the browser
         */
        init:self.init

    };
    
})();