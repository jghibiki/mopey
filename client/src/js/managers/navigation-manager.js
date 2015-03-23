define(["ko", "applicationState", "jquery", "sammy", "module"], function(ko, applicationStateModule, $, Sammy, module){

    function NavigationManager(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            routes: null,
            
            defaultFlow : module.config().defaultFlow,
            defaultRoute: module.config().defaultRoute,
            links: module.config().links,
            flows: module.config().flows,
            linkGroups: {},

            applicationState: applicationStateModule.get(),

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
                var navItems = [];

                                
                //build linkGroups
                for(var flow in self._.flows){
                    self._.linkGroups[flow] = {}
                    for(var i =0; i <self._.flows[flow].length; i++){
                        for(var link in self._.links){
                            if(self._.flows[flow][i] === link){
                                self._.linkGroups[flow][link] = self._.links[link]
                            }
                        }
                    }
                }

                

                //build route for links
                self._.routes = Sammy();
                for(var link in self._.links){
                    console.log(link);
                    self._.routes.get(link, function(context){
                        console.log("Updating "+ context.path.replace("/", ""));
                        self._.updateContentTags(context.path.replace("/", ""));
                    });
                }
                self._.routes.get("", function(){
                    self._.updateContentTags(self._.defaultRoute);
                });
                self._.routes.notFound = function(){
                    self._updateContrntTages(self._.defaultRoute);
                }
                
            },
            initContent: function(){
                /*
                var modules = [];
                for(link in self._.links){
                */

                    
            },
            updateContentTags: function(newLink){
                if(self._.initialized){
                    if(newLink == "") {
                        newLink = self._.defaultRoute;
                    }
                    if(self._.links.hasOwnProperty(newLink)){
                        if(self._.applicationState.currentFlow() == "") {
                            self._.applicationState.currentFlow(self._.defaultFlow);
                        }
                        //set current route 
                        self._.applicationState.currentRoute(newLink);

                        //set current content
                        self._.applicationState.currentContent(self._.links[newLink]["viewModel"]);

                        //this means we have left the original/previous
                        //flow
                        if(self._.linkGroups[self._.applicationState.currentFlow()].hasOwnProperty(newLink)){
                            for(var group in self._.linkGroups){
                                if(self._.linkGroups[group].hasOwnProperty(newLink)){
                                    self._.applicationState.currentFlow(group);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            updateNavigationItems: function(newFlow){
                self._.applicationState.navItems(self._.linkGroups[newFlow]);
            }
        };

        self.urlChangedSubscription = self._.applicationState.currentRoute.subscribe(function(newValue){
            self._.updateContentTags(newValue);
        });

        self.flowChangedSubscription = self._.applicationState.currentFlow.subscribe(function(newFlow){
            self._.updateNavigationItems(newFlow);
        });

        self.initialize = function(){
            if(!self._.initialized){
                self._.initRouting();
                self._.initContent();
                self._.initialized = true;
            }
        };

        self.start = function(){
            self._.checkIfDisposed();
            if(!self._.started && self._.initialized){

                self._.routes.run();

                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfStarted();
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.urlChangedSubscription.dispose();
                self.urlChangedSubscription = null;

                self.flowChangedSubscription.dispose();
                self.flowChangedSubscription = null;

                self._.applicationState.dispose();
                self._.applicationState = null;
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
