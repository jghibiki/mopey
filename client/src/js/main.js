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

            //managers
            "singletonManager": "managers/singletonManager",
            "navigationManager" : "managers/navigation-manager",

            //services
            "navigationService" : "services/navigation-service",
            
            //plugins
            "ko-content" : "ko-plugins/ko-content",
            "ko-touch-tap" : "ko-plugins/ko-touch-tap",

            //third party libs
            "ko" : "third-party/knockout-3.2.0",
            "sammy" : "third-party/sammy",
            "fetch": "third-party/fetch",
            "is": "this-pary/is.min",

            //utils
            "chain": "utils/chain.js",

       }
    },


    config:{
        "navigationService": [
            /*
            {
              route: "abc",                 // The url part for the route

              friendlyName: "The ABC's",    // A friendly name for the route, 
                                            // used in the navigation pane 
                                            // as the link title. An empty 
                                            // string will result in omission
                                            // from the list navigation pane.

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
                route: "",                      // Base route. Resolves to "/#/"
                friendlyName : "",
                viewModel: "redirectViewModel", // Redirects the root path to the route
                                                // defined in defaultRoute
                admin: false,
                children: [],
                config: {
                    "defaultRoute" : "queue"
                }
            },
            {
                route: "queue",
                friendlyName: "Queue",
                viewModel: "queueViewModel",
                admin: false,
                children: [],
                config: {}
            },
            {
                route: "account",
                friendlyName: "Account",
                viewModel: "accountViewModel",
                admin: false,
                children: [],
                config: {}
            },
            {
                route: "karma",
                fiendlyName: "Karma",
                viewModel: "karmaViewModel",
                admin: false,
                children: [],
                config: {}
            }

        ]
    }
});
