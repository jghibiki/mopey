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
            "leftPaneViewModel" : "singleton!viewModel!view/left-pane.html:veiw-models/left-pane-view-model",
            "rightPaneViewModel" : "singleton!viewModel!view/right-pane.html:veiw-models/right-pane-view-model",

            //managers
            "singletonManager": "managers/singletonManager",
            "navigationManager" : "managers/navigation-manager",
            
            //plugins
            "ko-content" : "plugins/ko-content",

            //third party libs
            "ko" : "third-party/knockout-3.2.0",
            "sammy" : "third-party/sammy",

            //application state
            "applicationState" : "singleton!application-state",


       }
    },


    config:{
    }
});
