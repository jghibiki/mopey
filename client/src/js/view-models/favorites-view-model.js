define(["ko", "nativeCommunicationManager", "authenticationManager"], function(ko, NativeCommunicationManagerModule, AuthenticationManagerModule){

    function FavoritesViewModel(){
        var self = this;

        self._ = {
            started: false,
            disposed: false,

            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
            authenticationManager: AuthenticationManagerModule.get()
        }

        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;
            }
        };

        self.hidden = function(){
            if(self._.shown){
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;

                self._.authenticationManager.dispose();
                self._.authenticationManager = null;

                self._.disposed = true;
            }
        };
    }

    return {
        get: function(){
            return new FavoritesViewModel();
        },
        type: function(){
            return FavoritesViewModel;
        }
    }
});
