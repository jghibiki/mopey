requirejs.config({
    //base url from the index page
    baseUrl: "js",

    //web app entry point
    deps:["bootstrapper", "jquery"],

    paths:{

        //require plugins 
        "viewModel" : "require-plugins/viewModel",
        "singleton" : "require-plugins/singleton",
        "domReady" : "require-plugins/domReady",
        "text" : "require-plugins/text",
        "path" : "require-plugins/path",

        //third party libs
        "underscore" : "third-party/underscore",

        //plugins
        "ko-content" : "ko-plugins/ko-content",
        "ko-touch-tap" : "ko-plugins/ko-touch-tap",
        "ko-enter": "ko-plugins/ko-enter",

        //third party libs
        "ko" : "third-party/knockout-3.2.0",
        "sammy" : "third-party/sammy",
        "fetch": "third-party/fetch",
        "is": "third-party/is.min",

        //utils
        "chain": "utils/chain",
    },


    map: {
       '*': {

            //view-models
            "contentViewModel" : "singleton!viewModel!views/content.html:view-models/content-view-model",
            "footerViewModel" : "singleton!viewModel!views/footer.html:view-models/footer-view-model",
            "mainWindowViewModel" : "singleton!view-models/main-window-view-model",
            "homeViewModel": "singleton!viewModel!views/home.html:view-models/home-view-model",
            "navigationViewModel" : "singleton!viewModel!views/navigation.html:view-models/navigation-view-model",
            "workingViewModel" : "singleton!viewModel!views/working.html:view-models/working-view-model",
            "queueViewModel": "singleton!viewModel!views/queue.html:view-models/queue-view-model",
            "accountViewModel": "singleton!viewModel!views/account.html:view-models/account-view-model",
            "karmaViewModel": "singleton!viewModel!views/karma.html:view-models/karma-view-model",
            "searchViewModel": "singleton!viewModel!views/search.html:view-models/search-view-model",

            //managers
            "singletonManager": "managers/singleton-manager",
            "navigationManager" : "singleton!managers/navigation-manager",
            "contentManager" : "singleton!managers/content-manager",

            //services
            "navigationService" : "singleton!services/navigation-service",
            "contentService" : "singleton!services/content-service",
            
            //plugins
            "ko-content" : "ko-plugins/ko-content",
            "ko-touch-tap" : "ko-plugins/ko-touch-tap",

            //third party libs
            "ko" : "third-party/knockout-3.2.0",
            "sammy" : "third-party/sammy",
            "fetch": "third-party/fetch",
            "is": "this-pary/is.min",

            //utils
            "chain": "utils/chain",

       }
    },


    config:{
        "services/navigation-service": [
            /*
            {
              route: "abc",                 // The url part for the route

              presedence: 1,                // the higher the presedence, the higher in the 
                                            // navigation menu it will appear.
                                            // If multiple routes have the same presedence
                                            // they will be arranged randomly.

              friendlyName: "The ABC's",    // A friendly name for the route, 
                                            // used in the navigation pane 
                                            // as the link title.

              viewModel: "abcViewModel",    // The view model this route will 
                                            // be mapped to

              admin: flase,                 // Toggles whether or not the route
                                            // requires the logged in user to be an
                                            // admin

              children: [                   // A list of child routes that will be nested
                                            // under the current route. e.g.
                                            // /#/abc/child-route
                                            //
                                            // The parent route will be responsible for
                                            // providing navigation to it's children
                                            // no friendlyName is needed on children
                                            // as a result. Additionally, the child
                                            // inherits the value of the admin flag
                                            // of the parent

                {
                    route: "xyz",
                    viewModel: "xyzViewModel",  
                    children: [],               // Like other routes child routes can implement their own children
                                                // child.child routes are still bound by the same rules as the parent.child
                    config: {}
                    
                }
              ],

              config: {                     // Routes can define arbitrary config values 
                                            // which will be passed to the viewModel by
                                            // the navigationManager.

                    "welcomeMessage": "Hail Odin" 
              }
            }
            */
            {
                route: "queue",
                friendlyName: "Queue",
                presedence: 1,
                viewModel: "queueViewModel",
                admin: false,
                children: [],
                config: {}
            },
            {
                route: "account",
                friendlyName: "Account",
                presedence: 2,
                viewModel: "accountViewModel",
                admin: false,
                children: [],
                config: {}
            },
            {
                route: "karma",
                friendlyName: "Karma",
                presedence: 3,
                viewModel: "karmaViewModel",
                admin: false,
                children: [],
                config: {}
            },
            {
                route: "search",
                friendlyName: "Search",
                viewModel: "searchViewModel",
                presedence: 0,
                admin: false,
                children: [],
                config: {}
            }

        ]
    }
});
