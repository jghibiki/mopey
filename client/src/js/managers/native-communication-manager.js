define(["nativeCommunicationService", "apiMappings", "authenticationManager", "module"], function(NativeCommunicationServiceModule, apiMappings, AuthenticationManagerModule, module){
    function NativeCommunicationManager(){
        var self = this;
        
        self._ = {
            disposed: false,
            nativeCommunicationService: NativeCommunicationServiceModule.get(),
            authenticationManager: AuthenticationManagerModule.get(),
            apiMappings: apiMappings
        }
        
        self.endpoints = module.config()

        self.sendNativeRequest = function(endpoint, successCallback, uriParameters, payload){
            self._.nativeCommunicationService.sendNativeRequest(self._.apiMappings.baseUrl, endpoint, self._.authenticationManager.token(), successCallback, uriParameters, payload) 
        }

        self.dispose = function(){
            if(!self._.disposed){
                self._.nativeCommunicationService.dispose();
                self._.nativeCommunicationService = null;
                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new NativeCommunicationManager();
        },
        type: function(){
            return NativeCommunicationManager;
        }
    };
});
