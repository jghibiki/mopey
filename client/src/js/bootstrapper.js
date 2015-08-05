define(["ko", "mainWindowViewModel",  "domReady!", "chain"], function(ko, MainWindowVMModule, NavigationServiceModule, chain){
    "use strict";

    var MainWindowVM = MainWindowVMModule.get();
    var NavigationService = null;
    var AuthenticationService = null;
    var ContentService = null;

    /*
     * Loading Services
     */
    function LoadServices(context, errorCallback, next){
        require(["navigationService", "contentService", "authenticationService"], function(NavigationServiceModule, ContentServiceModule, AuthenticationServiceModule){
            chain.get()
                .cc(LoadNavigationService)
                .cc(LoadContentService)
                .cc(LoadAuthenticationService)
                .end(
                        {
                            "NavigationServiceModule":NavigationServiceModule,
                            "ContentServiceModule": ContentServiceModule,
                            "AuthenticationServiceModule": AuthenticationServiceModule
                        },
                        function(context){
                            next();
                        }
                    );
        });
    }

    function LoadNavigationService(context, error, next){
        NavigationService = context.NavigationServiceModule.get();
        next(context);
    }

    function LoadContentService(context, error, next){
        ContentService = context.ContentServiceModule.get();
        next(context);
    }

    function LoadAuthenticationService(context, error, next){
        AuthenticationService = context.AuthenticationServiceModule.get()
        next(context);
    }   

    /*
     * Initialize Services
     */

    function InitializeServices(context, error, next){
        chain.get()
            .cc(InitializeNavigationService)
            .cc(InitializeContentService)
            .cc(InitializeAuthenticationService)
            .end({}, function(){
                next();
            });
    }
    
    function InitializeNavigationService(context, error, next){
        NavigationService.init();
        next();
    }

    function InitializeContentService(context, error, next){
        ContentService.init();
        next();
    }
    function InitializeAuthenticationService(context, error, next){
        AuthenticationService.init();
        next();
    }

    /*
     * Start Services
     */

    function StartServices(context, error, next){
       chain.get()
            .cc(StartNavigationService)
            .cc(StartContentService)
            .end({}, function(){
                next();
            });
    }

    function StartNavigationService(context, error, next){
        NavigationService.start();
        next();
    }

    function StartContentService(context, error, next){
        NavigationService.start();
        next()
    }


    /*
     * Init UI 
     */

    function InitializeUIComponents(context, error, next){
        require(["ko-content", "ko-enter", "domReady!"], function(koContentPlugin, koEnterPlugin, koTouchTapPlugin){
            next();
        });
    }

    /*
     * Start UI
     */

    function StartUI(context, error, next){
            ko.applyBindings(MainWindowVM);
            MainWindowVM.shown();
            next();
    }



    chain.get()
        .cc(InitializeUIComponents)
        .cc(LoadServices)
        .cc(InitializeServices)
        .cc(StartServices)
        .cc(StartUI)
        .end();


});
