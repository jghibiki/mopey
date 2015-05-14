define(["ko", "navigationManager", "chain"], function(ko, NavigationManagerModule, chain){
    
    function ContentService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            navigationManager: NavigationManagerModule.get(),
            
            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("Content Service not initialized.");
                }
            },
            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("Content Service not started.");
                }
            },
            checkIfDisposed: function(){
                if(!self._.disposed){
                    throw new Error("Content Service disposed");
                }
            },
            preloadVM(context, error, next){
                if(self.loadedVMs[context.viewModel] !== undefined){
                    context.module = self.loadedVMs[context.viewModel];
                    next(context);
                }
                else{
                    context.chain.cc(self._.loadVM);
                    next(context);
                }
            },
            loadVM(context, error, next){
                require([context.viewModel], function(ViewModelModule){
                    var context = {
                        "module": ViewModelModule.get()
                    };
                    next(context);
                });
            }
        };

        self.loadedVMs = {};

        self.init = function(){
//            if(!self._.initialized){
//                var routes = self._.navigationManager.getRoutes();
//
//                var vms = {};
//                var loadChain = chain.get();
//                var i;
//                for(i=0; i < routes.length; i++){
//                    
//                    var j;
//                    for(j=0; j<routes[i].children; i++){
//                        var obj;
//                        require([routes[i].children[j].viewModel], function(vm){
//                             obj = vm.get();
//                        });
//                    }
//                }
//                callback();
//            }
        };


        self.scheduleLoad = function(context){
            context.chain.cc(self._.preloadVM)
        }

        self.start = function(){
            self._.checkIfInitialized();
            if(!self._.started){
                self._.started = true;
            }
        };

        self.stop = function(){
            if(self._.started){
                self._.started = false;
            }
        };


        self.dispose = function(){
            if(!self._.disposed){

                for(var vm in self.loadedVMs){
                    vm.dispose();
                    vm = null;
                }
                self.loadedVMs = null;

                self._.navigationManager.dispose();
                self._.navigationManager = null;

                self._.disposed = true;
            }
        };
    }

    return {
        get: function(){
            return new ContentService();
        },

        type: function(){
            return ContentService;
        }
    };

});
