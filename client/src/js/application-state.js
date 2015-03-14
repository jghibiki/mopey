define(["ko", "module"], function(ko, module){
    
    function ApplicationState(){
        var self = this;

        self._ = {
            disposed:false,

        };


        self.clientUrl = ko.observable();
        self.apiUrl = ko.observable();

        // routing and content population
        self.currentFlow = ko.observable("");
        self.currentRoute = ko.observable('/');
        self.currentContent = ko.observable("");

        // footer navigation items
        self.navItems = ko.observableArray([]);


        // user authentication
        self.loggedIn = ko.observable(false);
        self.accessToken = ko.observable("");
        self.expirationDate = ko.observable("");


        self.dispose = function(){
            if(!self._.disposed){
                self.currentRoute = null;
                self.currentContent = null;
                self.navItems = null;
                
                self._.disposed = true;
            }
        };

    }

    return {
        get: function(){
            return new ApplicationState();
        },
        type: function(){
            return ApplicationState;
        }
    };
});
