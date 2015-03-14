requirejs.config({
    //base url from the index page
    baseUrl: "js",

    //web app entry point
    deps:["bootstrapper", "jquery"],

    paths:{

        //require plugins 
        "viewModel" : "plugins/viewModel",
        "singleton" : "plugins/singleton",
        //"service" : "plugins/service",
        "domReady" : "plugins/domReady",
        "text" : "plugins/text",
        "path" : "plugins/path",
        "underscore" : "libs/underscore",

        
    },


    map: {
       '*': {

            //view-models
            "headerViewModel": "singleton!viewModel!views/header.html:view-models/header-view-model",
            "contentViewModel" : "singleton!viewModel!views/content.html:view-models/content-view-model",
            "footerViewModel" : "singleton!viewModel!views/footer.html:view-models/footer-view-model",
            "mainWindowViewModel" : "singleton!view-models/main-window-view-model",
            "homeViewModel": "singleton!viewModel!views/home.html:view-models/home-view-model",

            //managers
            "singletonManager": "managers/singletonManager",
            "navigationManager" : "managers/navigation-manager",
            
            //plugins
            "ko-content" : "plugins/ko-content",

            //third party libs
            "ko" : "libs/knockout-3.2.0",
            "sammy" : "libs/sammy",

            //application state
            "applicationState" : "singleton!application-state",


       }
    },


    config:{
    }
});
