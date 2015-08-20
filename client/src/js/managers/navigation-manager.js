define(["ko", "navigationService", "authenticationManager"], function(ko, NavigationServiceModule, AuthenticationManagerModule){

    function NavigationManager(){
        var self = this;

        self._ = {
            disposed: false,
            urlCache: null,
            
            navigationService: NavigationServiceModule.get(),
            authenticationManager: AuthenticationManagerModule.get(),
            
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

        self.loggedInSubscription = self._.authenticationManager.loggedIn.subscribe(function(loggedIn){
            if(!loggedIn){
                self._.navigationService.currentRoute("login");
                location = "/#/login";
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
            if(self._.navigationService.validRoute(route)){
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
            else{
                self._.navigationService.currentRoute("login");
                location = "/#/login";
            }
        }

        self.getRouteDetails = function(route){
            var routes = self.getRoutes();
            for(var x=0; x<routes.length; x++){
                if(routes[x].route === route){
                    return routes[x];
                }
            }
            return null;
        }

        self.validRoute = function(route){
            return self._.navigationService.validRoute(route);
        };

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
