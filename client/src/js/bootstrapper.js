define(["ko", "mainWindowViewModel", "applicationState", "navigationManager", "domReady!"], function(ko, MainWindowVMModule, ApplicationStateModule, NavigationManagerModule){
   "use strict";

   var UI_READY = false;
   var MainWindowVM = MainWindowVMModule.get();
   var ApplicationState = ApplicationStateModule.get();
   var NavigationManager = NavigationManagerModule.get();

   function InitializeUIComponents(){
        require(["ko-content", "domReady!"], function(koContentPlugin){
            UI_READY = true;
        });
    }
   
   function CheckForExistingCredentials(){
        if(localStorage.hasOwnProperty("access_token")){
            if(localStorage.hasOwnProperty("expiration_date")){
                if((new Date(localStorage["expiration_date"])).valueOf() > (new Date()).getTime()){
                    ApplicationState.accessToken(localStorage["acccess_token"]);
                    ApplicationState.loggedIn(true);
                }
                else{
                    localStorage.clear();
                }
            }
        }
   }

   

    InitializeUIComponents();
    CheckForExistingCredentials();

    var timer = null;
    timer = setInterval(function(){
        if(UI_READY ){
            clearTimeout(timer);
            timer = null;

            if(window.location.hash){
                ApplicationState.currentRoute(window.location.hash);
            }
            else{
                ApplicationState.currentRoute("");
            }
           
            NavigationManager.initialize();
            NavigationManager.start();

            
            ko.applyBindings(MainWindowVM);
            MainWindowVM.shown();



        }
    }, 100);
    
   
});
