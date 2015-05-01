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
    }
});
