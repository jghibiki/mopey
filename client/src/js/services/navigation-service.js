define(["ko","sammy", "module", "authenticationManager"], function(ko,Sammy, module, AuthenticationManagerModule){

    function RouteChild(parentRoute, routeDict){
        var self = this;

        if(routeDict.route === undefined){
            throw new Error("Route child config error, missing route.");
        }
        self.route = parentRoute + "/" + routeDict.route;

        if(routeDict.viewModel=== undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing viewModel.");
        }
        self.viewModel = routeDict.viewModel;

        if(routeDict.config === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing config.");
        }
        self.config = routeDict.config;
        self.children = [];

        if(routeDict.children === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing children.");
        }
        var child;
        for(child in routeDict.children){
            self.children.push(self.route, new RouteChild(child));
        }

        self.hashRoute = function() {
            return "#/" + self.route;
        };

    }

    function Route(routeDict){
        var self = this;
        if(routeDict.route === undefined){
            throw new Error("Route config error, missing route");
        }
        self.route = routeDict.route;

        if(routeDict.presedence === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing presedence.");
        }
        self.presedence = routeDict.presedence;

        if(routeDict.friendlyName === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing friendlyName.");
        }
        self.friendlyName = routeDict.friendlyName;

        if(routeDict.viewModel === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing viewModel.");
        }
        self.viewModel = routeDict.viewModel;

        if(routeDict.admin === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing admin.");
        }
        self.admin = routeDict.admin;

        if(routeDict.loggedIn === undefined){
            throw new Error("Route config error for route " + routeDict.route + ". Missing loggedIn.");
        }
        self.loggedIn = routeDict.loggedIn;

        if(routeDict.config === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing config.");
        }
        self.config = routeDict.config;

        if(routeDict.children === undefined){
            throw new Error("Route config error for route: " + routeDict.route + ". Missing children.");
        }
        self.children = [];

        var child;
        for(child in routeDict.children){
            self.children.push(self.route, new RouteChild(child));
        }

        self.hashRoute = function() {
            return "#/" + self.route;
        };
    }


    function NavigationService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            routeConfig: module.config(),
            sammy: Sammy(),
            authenticationManager: AuthenticationManagerModule.get(),
            
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("Must start NavigationManager before using it.");
                }
            },
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("NavigationManager is already disposed.");
                }
            },
            initRouting: function(){
                //Build Route Objects and Child Heirarchy
                log.debug("Building route objects");
                var i;
                for(i = 0; i < self._.routeConfig.length; i++){
                    self.routes.push(new Route(self._.routeConfig[i]));
                }

                //Setting up sammy routing
                //self._.sammy.get("", function(){
                //    self.currentRoute("queue");
                //});

                self._.sammy.get("/", function(){
                    self.currentRoute("queue");
                });

                self._.sammy.get("#/", function(){
                    self.currentRoute("queue");
                });

                for(i = 0; i < self.routes.length; i++){
                    self._.sammy.get("#/" + self.routes[i].route, function(context){
                        route = context.path.substr(3,context.path.length).split("?")[0]
                        if(self.validRoute(route)){
                            self.currentRoute(route);
                        }
                        else{
                            self.currentRoute("login");
                            location = "#/login";
                        }
                    });
                }
            }
        };

        self.currentRoute = ko.observable().extend({ ratelimit: { timeout: 500, method: "notifyWhenChangesStop"}});
        self.updateNaviation = ko.observable();

        self.routes = [];

        self.init = function(){
            self._.initRouting();
        };

        self.start = function(){
            self._.checkIfDisposed();
            if(!self._.started){
                
                
                //trigger dynamic working vm load
                self._.sammy.run();

                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfStarted();
        };

        self.dispose = function(){
            if(!self._.disposed){

                self._.disposed = true;
            }
        };
        
        self.validRoute = function(route){
            for(var x=0; x<self.routes.length; x++){
                if(self.routes[x].route === route){
                    route = self.routes[x];
                    break;
                }
            }
            if(route.loggedIn){
                if(self._.authenticationManager.loggedIn()){
                    if(route.admin){
                        if(self._.authenticationManager.admin()){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return true;
                    }
                }
            }
            else{
                return true;
            }
        }
    }

    return {
        get: function(){
            return new NavigationService();
        },
        type: function(){
            return NavigationService;
        }
    };

});
