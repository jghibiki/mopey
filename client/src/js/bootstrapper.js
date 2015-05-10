define(["ko", "mainWindowViewModel", "navigationService", "domReady!"], function(ko, MainWindowVMModule, NavigationServiceModule){
    "use strict";

    var UI_READY = false;
    var MainWindowVM = MainWindowVMModule.get();
    var NavigationService = NavigationServiceModule.get();

    function InitializeServices(){
       NavigationService.init(); 
    }

    function StartServices(){
        NavigationService.start();
    }

    function InitializeUIComponents(){
        require(["ko-content", "domReady!"], function(koContentPlugin, koTouchTapPlugin){
            UI_READY = true;
        });
    }

    function CheckForExistingCredentials(){
//        if(localStorage.hasOwnProperty("access_token")){
//            if(localStorage.hasOwnProperty("expiration_date")){
//                if((new Date(localStorage["expiration_date"])).valueOf() > (new Date()).getTime()){
//                    ApplicationState.accessToken(localStorage["acccess_token"]);
//                    ApplicationState.loggedIn(true);
//                }
//                else{
//                    localStorage.clear();
//                }
//            }
//        }
    }

    InitializeServices();
    InitializeUIComponents();
    CheckForExistingCredentials();

    var timer = null;
    timer = setInterval(function(){
        if(UI_READY ){
            clearTimeout(timer);
            timer = null;

            ko.applyBindings(MainWindowVM);
            MainWindowVM.shown();

            StartServices();
        }
    }, 100);
});
