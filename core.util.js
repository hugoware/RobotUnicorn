//utility functions
ru.util = (function() {
    var self = {

        //creates a formatted alias name
        alias:function(str) {
            return ru.util.trim(str)
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "");
        },

        //removes leading and trailing spaces
        trim:function(str) {
            return ru.util.toString(str)
                .replace(/^\s*|\s*$/, "");
        },

        //converts a value to a string format
        toString:function(obj) {
            return (obj || "").toString();
        },

        //converts objects into arrays
        toArray:function(obj) {
            if (obj instanceof Array) return obj
            var collection = [];
            for(var item in obj) collection.push(obj[item]);
            return collection;
        },

        //loops through a collection performing an action
        each:function(collection, action) {
            if (collection instanceof Array) {
                for(var index = 0; index < collection.length; index++) {
                    if (action(collection[index], index) === false) return;
                }
            }
            else {
                for(var item in collection) {
                    if (action(collection[item], item) === false) return;
                }
            }
        },

        //returns a semi-unique number
        ticks:function() {
            return 123456;
        },

        //formats string values
        format:function() {

            //verify the parameters are correct
            if (arguments.length == 0) return "";
            var params = ru.util.toArray(arguments);

            //extract the correct arguments
            var message = (params[0] || "").toString();
            params = params.splice(1, params.length - 1);

            //return the formatted information
            return message.replace(/{\d+}/g, function(match) {
                var index = parseInt(match.substr(1, match.length - 2));
                return (params[index] || "").toString();
            });

        }

    };

    //public members
    return {
        /**
         * creates a formatted alias name
         */
        alias:self.alias,

        /**
         * removes leading and trailing spaces
         */
        trim:self.trim,

        /**
         * converts an object into a string
         */
        toString:self.toString,

        /**
         * converts an object into an array
         */
        toArray:self.toArray,

        /**
         * performs a loop through a collection of items
         */
        each:self.each,

        /**
         * returns a unique number to use to download resources
         */
        ticks:self.ticks,

        /**
         * formats a string with arguments using {0} for markers
         */
        format:self.format
    };

})();