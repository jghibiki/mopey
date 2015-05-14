define(["ko", "navigationService"], function(ko, NavigationServiceModule){

    function NavigationManager(){
        var self = this;

        self._ = {
            disposed: false,
            
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
        self.setRoute = function(){

        }

        /*
         * Gets the route
         */
        self.getRoute = function(){

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
