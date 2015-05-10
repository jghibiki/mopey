define(["ko", "navigationService"], function(ko, NavigationServiceModule){

    function NavigationManager(){
        var self = this;

        self._ = {
            disposed: false,
            
            navigationService: NavigationServiceModule.get()
        };

        
        self.currentRoute = ko.observable();

        self.currentRouteSubscription = self._.navigationService.currentRoute.subscribe(function(newRoute){
            self.currentRoute(newRoute);
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
