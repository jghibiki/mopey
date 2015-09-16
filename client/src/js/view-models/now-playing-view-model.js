define(["ko", "nativeCommunicationManager"], function(ko, NativeCommunicationManagerModule){
    
    function NowPlayingViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            
            timer: null,

            nativeCommunicationManager: NativeCommunicationManagerModule.get() 
        };

        self.currentRequest = ko.observable(null);
        self.loading = ko.observable(false);
        self.errorMessage = ko.observable(null);

        self.shown = function(){
            if(!self._.shown){

                self._.timer = setInterval(self.getCurrentRequest, 10000);
                self.getCurrentRequest();

                self._.shown = true;
            }
        };

        self.hidden = function(){
            if(self._.shown){

                clearInterval(self._.timer)

                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.dispose){

                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;

                self._.dispose = true;
            }
        }

        self.getCurrentRequest = function(){
            if(!self.loading()){

                self.loading(true);
                self.errorMessage(null);

                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_CURRENT_REQUEST,
                    function(response){
                        if("Error" in response){
                            self.errorMessage(response.Error);
                            self.loading(false);
                        }
                        else{
                            self.currentRequest(response.result);
                            self.loading(false);
                        }
                    },
                    null,
                    null
                );

            }
        }
    }

    return {
        get: function(){
            return new NowPlayingViewModel();
        },
        type: function(){
            return NowPlayingViewModel;
        }
    };

});
