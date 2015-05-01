define(["sammy", "module"], function(Sammy, module){

    function NavigationService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            routeConfig: module.config(),
            
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
                
            }
        };

        self.start = function(){
            self._.checkIfDisposed();
            if(!self._.started){
                
                self._.initRouting();

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
