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
        "json" : "require-plugins/json",

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
            "blankViewModel": "singleton!viewModel!views/blank.html:view-models/blank-view-model",
            "authenticationViewModel": "singleton!viewModel!views/authentication.html:view-models/authentication-view-model",
            "regexViewModel": "singleton!viewModel!views/regex.html:view-models/regex-view-model",
            "addUserViewModel": "singleton!viewModel!views/add-user.html:view-models/add-user-view-model",
            "helpViewModel": "singleton!viewModel!views/help.html:view-models/help-view-model",
            "favoritesViewModel": "singleton!viewModel!views/favorites.html:view-models/favorites-view-model",
            "nowPlayingViewModel": "singleton!viewModel!views/now-playing.html:view-models/now-playing-view-model",

            //managers
            "singletonManager": "managers/singleton-manager",
            "navigationManager" : "singleton!managers/navigation-manager",
            "contentManager" : "singleton!managers/content-manager",
            "authenticationManager" : "singleton!managers/authentication-manager",
            "nativeCommunicationManager": "singleton!managers/native-communication-manager",

            //services
            "navigationService" : "singleton!services/navigation-service",
            "contentService" : "singleton!services/content-service",
            "authenticationService": "singleton!services/authentication-service",
            "nativeCommunicationService": "singleton!services/native-communication-service",
            
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

            //data files
            "apiMappings": "api-mappings"
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
                loggedIn: false,
                children: [],
                config: {}
            },
            {
                route: "account",
                friendlyName: "Account",
                presedence: 3,
                viewModel: "accountViewModel",
                admin: false,
                loggedIn: true,
                children: [],
                config: {}
            },
            {
                route: "karma",
                friendlyName: "Karma",
                presedence: 4,
                viewModel: "karmaViewModel",
                admin: false,
                loggedIn:true,
                children: [],
                config: {}
            },
            {
                route: "search",
                friendlyName: "Search",
                viewModel: "searchViewModel",
                presedence: 0,
                admin: false,
                loggedIn: true,
                children: [],
                config: {}
            },
            {
                route: "_",
                friendlyName: "_",
                viewModel: "blankViewModel",
                presedence: 0,
                admin: false,
                loggedIn: false,
                children:[],
                config:{}
            },
            {
                route: "login",
                friendlyName: "Log In",
                viewModel: "authenticationViewModel",
                presedence: 0,
                admin: false,
                loggedIn: false,
                children: [],
                config: {}
            },
            {
                route: "logout",
                friendlyName: "Log Out",
                viewModel: "authenticationViewModel",
                presedence: 0,
                admin: false,
                loggedIn: false,
                children: [],
                config: {}
            },
            {
                route: "regex",
                friendlyName: "Regex Config",
                viewModel: "regexViewModel",
                presedence: 5,
                admin: true,
                loggedIn: true,
                children: [],
                config: {}
            },
            {
                route: "add-user",
                friendlyName: "Add User",
                viewModel: "addUserViewModel",
                presedence: 6,
                admin: true,
                loggedIn: true,
                children: [],
                config: {}
            },
            {
                route: "help",
                friendlyName: "Help",
                viewModel: "helpViewModel",
                presedence: 99,
                admin: false,
                loggedIn: false,
                children: [],
                config: {}
            },
            {
                route: "favorites",
                friendlyName: "Favorites",
                viewModel: "favoritesViewModel",
                presedence: 7,
                admin: false,
                loggedIn: true,
                children: [],
                config: {}
            },
            {
                route: "now-playing",
                friendlyName: "Now Playing",
                viewModel: "nowPlayingViewModel",
                presedence: 1,
                admin: false,
                loggedIn: false,
                children: [],
                config: {}
            }

        ],

        "managers/native-communication-manager": {

            /* Authentication & Authorization */
            "AUTHENTICATE":{
                verb: "POST",
                uri: "/authenticate"
            },
            "VERIFY_AUTHENTICATION":{
                verb: "POST",
                uri: "/authenticate/verify"
            },
            "VERIFY_AUTHENTICATION":{
                verb: "POST",
                uri: "/authenticate/verify/admin"
            },

            /* User Management */
            "GET_USER": {
                verb: "GET",
                uri: "/user/{key}"
            },
            "GET_USERS":{
                verb: "GET",
                uri: "/users/{page}"
            },
            "COUNT_USERS":{
                verb: "GET",
                uri: "/users/count"
            },
            "CREATE_USER": {
                verb: "POST",
                uri: "/user"
            },
            "EDIT_USER":{
                verb:"POST",
                uri: "/user/{key}/edit"
            },

            /* Search */
            "SEARCH": {
                verb: "GET",
                uri: "/search/{q}"
            },

            /* Regexs */
            "GET_REGEXES": { 
                verb: "GET",
                uri: "/regex/{page}"
            },
            "CREATE_REGEX": {
                verb: "POST",
                uri: "/regex"
            },
            "DELETE_REGEX": {
                verb: "DELETE",
                uri: "/regex/{key}"
            },
            "COUNT_REGEXES": {
                verb: "GET",
                uri: "/regex/count"
            },
            /* Mopidy Direct */
            "PLAYBACK_ADD_SONG": {
                verb: "POST",
                uri: "/playback/add"
            },
            "PLAYBACK_PLAY": {
                verb: "GET",
                uri: "/playback/play"
            },
            "PLAYBACK_PAUSE": {
                verb: "GET",
                uri: "/playback/pause"
            },
            "PLAYBACK_STOP": {
                verb: "GET",
                uri: "/playback/stop"
            },
            "PLAYBACK_NEXT": {
                verb: "GET",
                uri: "/playback/next"
            },
            "PLAYBACK_CLEAR": {
                verb: "GET",
                uri: "/playback/clear"
            },
            "PLAYBACK_TRACK_LIST": {
                verb: "GET",
                uri: "/playback/list"
            },
            "PLAYBACK_STATE": {
                verb: "GET",
                uri: "/playback/state"
            },

            /* Volume */
            "VOLUME_UP": {
                verb: "GET",
                uri: "/volume/up"
            },
            "VOLUME_DOWN": {
                verb: "GET",
                uri: "/volume/down"
            },
            "GET_VOLUME": {
                verb: "GET",
                uri: "/volume"
            },
            "SET_VOLUME":{
                verb: "POST",
                uri: "/volume"
            },
            
            /* Requests */
            "GET_REQUESTS":{
                verb: "GET",
                uri: "/queue/{page}"
            },
            "REMOVE_REQUEST": {
                verb: "DELETE",
                uri: "/queue/{key}"
            },
            "CREATE_REQUEST": {
                verb: "POST",
                uri: "/queue"
            },
            "COUNT_REQUESTS": {
                verb: "GET",
                uri: "/queue/count"
            },
            "GET_CURRENT_REQUEST": {
                verb: "GET",
                uri: "/queue/current"
            },
            "SET_CURRENT_REQUEST": {
                verb: "POST",
                uri: "/queue/current"
            },

            /* Karma */
            "RESET_KARMA":{
                verb: "GET",
                uri: "/karma/reset"
            },
            
            /* Spam */
            "RESET_SPAM":{
                verb: "GET",
                uri: "/spam/reset"
            },

            /* Service Api*/
            "SERVICE_SKIP_SONG": {
                verb: "GET",
                uri: "/service/skip"
            },

            "GET_SERVICE_COMMANDS": {
                verb: "GET",
                uri: "/service"
            },
            "DELETE_SERVICE_COMMAND": {
                verb: "GET",
                uri: "/service/{key}"
            },

            /* Favorites */
            "COUNT_FAVORITES": {
                verb: "GET",
                uri: "/favorites/count"
            },
            "GET_FAVORITES": {
                verb: "GET",
                uri: "/favorites/{page}"
            },
            "ADD_FAVORITE": {
                verb: "POST",
                uri: "/favorites"
            },
            "REMOVE_FAVORITE": {
                verb: "DELETE",
                uri: "/favorites/{key}"
            }
        }
    }
});
