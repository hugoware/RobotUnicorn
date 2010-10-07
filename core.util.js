//utility functions
ru.core.util = {

    //converts any object into an array
    toArray:function(obj) {
        var collection = [];
        for(var item in obj) collection.push(obj[item]);
        return collection;
    },
    
    //formats a string value
    format:function() {
        return arguments[0];
    }

};