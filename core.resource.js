//manages resources for the view
ru.resource = function() {
    var self = {
        images:{},
        scripts:{},

        //loads an external resource
        resource:function(type, params) {
            if (!params) return;

            //start the image load
            var instance = type == "image" ? new Image() : new Script();
			instance.onload = params.loaded;

            //save the instance
            return {
                content:instance,
                load:params.allowCache
                    ? function() { instance.src = params.url; }
                    : function() { instance.src = params.url + "?" + ru.util.ticks(); },
                url:params.url,
                name:ru.util.alias(params.name),
                height:params.height,
                width:params.width
            };

        },

        //handles finding values
        find:{

            //gets a loaded resource by a name
            image:function(name) {
                name = ru.util.alias(name);
                return self.images[name];
            },

            //gets a loaded resource by a name
            script:function(name) {
                name = ru.util.alias(name);
                return self.scripts[name];
            }

        },

        //handles loading external values
        load:{

            //includes a new image resource
            image:function(params) {
                var resource = new self.resource("image", params);
                self.add(resource, self.images);
                resource.load();
                return self.instance;
            },

            //creates a new script and saves the resource
            script:function(params) {
                var resource = new self.resource("script", params);
                self.add(resource, self.scripts);
                resource.load();
                return self.instance;
            }

        },

        //adds a new item to the resource list
        add:function(resource, target) {
            self.remove(resource.name, target);
            target[resource.name] = resource;
        },

        //load each of the resources with the provided delegate
        batch:function(collection, load) {
            if (!(collection instanceof Array)) collection = [collection];
            ru.util.each(collection, function(item, index) {
                load(item);
            });
        },

        //removes an image from the view
        remove:function(name, target) {
            name = ru.util.alias(name);
            delete target[name];
        }

    };
    
    //public exposed members
    return {

        /**
         * handles loading external resources
         */
        load:{

            /**
             * loads in external scripts (allows a collection of scripts)
             */
            script:function(images) { self.batch(images, function(image) { self.load.script(image); }); },

            /**
             * loads in external images (allows a collection of images)
             */
            image:function(images) { self.batch(images, function(image) { self.load.image(image); }); }

        },

        /**
         * Accesses loaded values
         */
        find:{

            /**
             * Finds an image resource that has already been loaded
             */
            image:self.find.image,

            /**
             * Finds a script resource that has already been loaded
             */
            script:self.find.script

        }

    };

};