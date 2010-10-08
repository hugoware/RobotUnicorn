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
        
        //verify the parameters are correct
        if (arguments.length == 0) return "";
        var params = ru.core.util.toArray(arguments);
        
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