//manages resources for the view
ru.resource = new function() {
    var self = {
        resources:{},
    
        //loads an external resource into the game
        load:function(params) {
            if (!params) return;
            if (params.name && self.resources[params.name]) return self.resources[params.name];

            //start the image load
            if (!params.type) params.type = self._getTypeFromUrl(params.url);
            var resource = self._getResourceForType(params.type);
            
            //start the load process now
            params.loaded = params.loaded || function() { };
            resource.src = params.url + "?" + (new Date()).toString();
            resource.onload = function() {
                params.loaded(resource);
            };
            
            //return the result
            var resource = {
                resource:resource,
                type:params.type,
                url:params.url,
                name:ru.util.alias(params.name)
            };
            
            //save this if needed
            if (params.name && !self.resources[params.name]) self.resources[params.name] = resource;
            
            //and return it for use
            return resource;
            
        },
        
        //makes a guess at the type of resource
        _getTypeFromUrl:function(url) {
            if (url.match(/\.(png|jpg|jpeg|gif)$/i))
                return "image";
            else if (url.match(/\.(js)$/i))
                return "script";
            else
                return "unknown"
        },
        
        //the resource to load in
        _getResourceForType:function(type) {
            if (type == "image")
                return new Image();
            else if (type == "script")
                return new Script();
            else
                return null;
        }
    
    };
    
    //loads an external resource
    this.load = self.load;
    
};