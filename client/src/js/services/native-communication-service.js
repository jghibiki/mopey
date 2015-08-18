define(["jquery"], function($){
    function NativeCommunicationService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("Must initialize Native Communication Service before using it.");
                }
            },

            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("Must start Native Communication Service before using it.");
                }
            },

            checkIfDisposed: function(){
                if(self._disposed){
                    throw new Error("Native Communication Service has already been disposed.");
                }
            }
        };


        self.init = function(){
            self._.checkIfDisposed();
            if(!self._.initialized){        
                self._.initialized = true;
            }
        };

        self.start = function(){
            self._.checkIfInitialized();
            self._.checkIfDisposed();

            if(!self._.started){
                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfStarted();
            if(self._.started){
                self.started = false
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.stop()

                self._.disposed = true;
            }
        };
            
        self.sendNativeRequest = function(baseUrl, endpoint, token, successCallback, uriParameters, payload){
            self._.checkIfDisposed();
            self._.checkIfStarted();

            if(baseUrl === undefined || baseUrl === "" || baseUrl == null){
                throw new Error("Cannot send a remote request with an undefined or empty baseUrl");
            }
            if(endpoint === undefined || endpoint === null){
                throw new Error("Cannot send a remote request without specifying an endpoint.")
            }

            var uri = self.buildUri(endpoint.uri, uriParameters);

            if ((payload === undefined || payload === null) 
                    && (successCallback == undefined || successCallback == null)
                    && (uriParameters == undefined || uriParameters == null || uriParameters == "")){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    headers: {"Authorization": token}
                });
            }

            else if ((payload === undefined || payload === null) 
                    && (uriParameters == undefined || uriParameters == null || uriParameters == "")){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    headers: {"Authorization": token},
                    success: successCallback
                });
            }

            else if ((payload === undefined || payload === null) 
                    && (successCallback == undefined || successCallback == null)){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    headers: {"Authorization": token}
                });
            }

            else if ((payload === undefined || payload === null) ){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    headers: {"Authorization": token},
                    success: successCallback
                });
            }

            else if((successCallback == undefined || successCallback == null)
                    && (uriParameters == undefined || uriParameters == null || uriParameters == "")){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    data: JSON.stringify(payload),
                    contentType:"application/json",
                    headers: {"Authorization": token}
                });
            }

            else if(uriParameters == undefined || uriParameters == null || uriParameters == ""){
                $.ajax({
                    url: baseUrl + uri,
                    type: endpoint.verb,
                    dataType: "json",
                    data: JSON.stringify(payload),
                    contentType:"application/json",
                    headers: {"Authorization": token},
                    success: successCallback
                });
            }

            else{
                throw new Error("Invalid combination of parameters. uriParameters and payload cannot both be not-null or not-undefined.")
            }
        }

        self.buildUri = function(uri, uriParameters){
            for(var key in uriParameters){
                token = "{" + key + "}";
                index = uri.indexOf(token)
                if(token !== -1){
                    uri = uri.replace(token, String(uriParameters[key]));  
                }
            }
            return uri;
        }

    }
    
    return {
        get: function(){
            return new NativeCommunicationService();
        },
        type: function(){
            return NativeCommunicationService;
        }
    }

});
