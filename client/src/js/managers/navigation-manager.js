define(["ko", "navigationService"], function(ko, NavigationServiceModule){

    function NavigationManager(){
        var self = this;

        self._ = {
            disposed: false,
            urlCache: null,
            
            navigationService: NavigationServiceModule.get(),
            
            checkIfDisposed: function(){
                if(!self._.disposed){
                    throw new Error("Navigation Manager is disposed");
                }
            }
        };

        
        self.currentRoute = ko.observable();

        self.currentRouteSubscription = self._.navigationService.currentRoute.subscribe(function(newRoute){
            var i;
            for(i=0; i<self._.navigationService.routes.length; i++){
                if(self._.navigationService.routes[i].route === newRoute){
                    self.currentRoute(self._.navigationService.routes[i]);
                    break;
                }
            }
        });


        /*
         * Gets the list of navigable routes
         */
        self.getRoutes = function(){
            return self._.navigationService.routes.sort();
        }

        /*
         *  Sets the route
         */
        self.setRoute = function(route){
            if(typeof route == "undefined" || route == null){
                throw new Error("NavigationManager.setRoute requites a non-null route");
            }
            if(self._.urlCache === null || self._.urlCache === ""){
                self._.navigationService.currentRoute(route);
                location = "/#/" + route
            }
            else{
                location = "/#/" + route + self._.urlCache;
                self._.navigationService.currentRoute(route);
                location = "/#/" + route + self._.urlCache;
                self._.urlCache = null;
            }
        }

        /*
         * Gets the route
         */
        self.getRoute = function(){
            return self.currentRoute();
        }

        self.cacheUrlVariable = function(key, value){
            if(self._.urlCache === null){
                self._.urlCache = "?" + key + "=" + encodeURI(value);
            }
            else{
                self._.urlCache += "&" + key + "=" + encodeURI(value);
            }
        }

        self.dispose = function(){
            if(!self._.disposed){

                self._.navigationService.dispose();
                self._.navigationService = null;

                self._.disposed = true;
            }
        };
    }

    return {
        get: function(){
            return new NavigationManager();
        },
        type: function(){
            return NavigationManager;
        }
    };
});
