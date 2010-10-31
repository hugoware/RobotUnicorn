//utility functions
ru.util = new function() {
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
        
        //performs a random action
        random:function() {
            var args = self.toArray(arguments);
            return args.length == 1 ? self._randomNumber(0, args[0])
                : args.length == 2 ? self._randomNumber(args[0], args[1])
                : 0;
        },
        
        //creates a copy of a object
        clone:function(obj, deep) {
            var clone = {};
            for (var item in obj) {
                clone[item] = typeof obj[item] == "object" ? self.clone(obj[item]) : obj[item];
            }
            return clone;
        },
        
        //picks a random item from a selection
        pick:function() {
            var args = self.toArray(arguments);
            var index = self.random(0, args.length - 1);
            return args[index];
        },
        
        //picks a random number within a range
        _randomNumber:function(min, max) {
            if (min >= max) return min;
            return parseInt((Math.random() * (max + 1)) + min);
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

    //public actions
    this.alias = self.alias;
    this.trim = self.trim;
    this.toString = self.toString;
    this.toArray = self.toArray;
    this.each = self.each;
    this.ticks = self.ticks;
    this.format = self.format;
    this.random = self.random;
    this.clone = self.clone;
    this.pick = self.pick;

};