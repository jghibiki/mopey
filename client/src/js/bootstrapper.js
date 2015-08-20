define(["ko", "mainWindowViewModel", "chain"], function(ko, MainWindowVMModule, chain){
    "use strict";

    var MainWindowVM = MainWindowVMModule.get();

    var NavigationService = null;
    var NavigationManager = null

    var AuthenticationService = null;
    var AuthenticationManager = null;

    var NativeCommunicationService = null;
    var NativeCommunicationManager = null;

    var ContentService = null;
    var ContentManager = null;


    /*
     * Loading Services
     */
    function LoadServices(context, errorCallback, next){
        require(["navigationService", 
                    "contentService",  
                    "authenticationService",
                    "nativeCommunicationService"
                ], 
                function(
                    NavigationServiceModule, 
                    ContentServiceModule, 
                    AuthenticationServiceModule,
                    NativeCommunicationServiceModule){
            chain.get()
                .cc(LoadNavigationService)
                .cc(LoadContentService)
                .cc(LoadAuthenticationService)
                .cc(LoadNativeCommunicationService)
                .end(
                        {
                            "NavigationServiceModule":NavigationServiceModule,
                            "ContentServiceModule": ContentServiceModule,
                            "AuthenticationServiceModule": AuthenticationServiceModule,
                            "NativeCommunicationServiceModule": NativeCommunicationServiceModule
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

    function LoadNativeCommunicationService(context, error, next){
        NativeCommunicationService = context.NativeCommunicationServiceModule.get();
        next(context)
    }

    /*
     * Initialize Services
     */

    function InitializeServices(context, error, next){
        chain.get()
            .cc(InitializeNavigationService)
            .cc(InitializeContentService)
            .cc(InitializeAuthenticationService)
            .cc(InitializeNativeCommunicationService)
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
    function InitializeNativeCommunicationService(context, error, next){
        NativeCommunicationService.init();
        next();
    }

    /*
     * Start Services
     */

    function StartServices(context, error, next){
       chain.get()
            .cc(StartNavigationService)
            .cc(StartContentService)
            .cc(StartAuthenticationService)
            .cc(StartNativeCommunicationService)
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
    
    function StartAuthenticationService(context, error, next){
        AuthenticationService.start();
        next();
    }

    function StartNativeCommunicationService(context, error, next){
        NativeCommunicationService.start();
        next();
    }

    /*
     * Load Managers
     */
    function LoadManagers(context, error, next){
        require(["authenticationManager",
                "contentManager",
                "nativeCommunicationManager",
                "navigationManager"],
                function(
                    AuthenticationManagerModule,
                    ContentManagerModule,
                    NativeCommunicationManagerModule,
                    NavigationManagerModule
                ){
            chain.get()
            .cc(LoadAuthenticationManager)
            .cc(LoadContentManager)
            .cc(LoadNativeCommunicationManager)
            .cc(LoadNavigationManager)
            .end({
                    "AuthenticationManagerModule": AuthenticationManagerModule,
                    "ContentManagerModule": ContentManagerModule,
                    "NativeCommunicationManagerModule": NativeCommunicationManagerModule,
                    "NavigationManagerModule": NavigationManagerModule
                },
                function(conext, next, error){
                    next();
            });
        });
    }

    function LoadAuthenticationManager(context, error, next){
        AuthenticationManager = context.AuthenticationManagerModule.get();
        next(context);
    }

    function LoadContentManager(context, error, next){
        ContentManager = context.ContentManagerModule.get();
        next(context);
    }

    function LoadNativeCommunicationManager(context, error, next){
        NativeCommunicationManager = context.NativeCommunicationManager.get();
        next(context);
    }

    function LoadNavigationManager(context, error, next){
        NavigationManager = context.NavigationManager.get();
        next(context);
    }


    /*
     * Init UI 
     */

    function InitializeUIComponents(context, error, next){
        require(["ko-content", "ko-enter", "ko-touch-tap", "domReady!"], function(koContentPlugin, koEnterPlugin, koTouchTapPlugin, domReady){
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
