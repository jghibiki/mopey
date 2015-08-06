define(["ko", "jquery", "navigationManager", "chain", "authenticationManager"], function(ko, $, NavigationManagerModule, chain, AuthenticationManagerModule) {

	function NavigationViewModel() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
            navigationManager: NavigationManagerModule.get(),
            authenticationManager: AuthenticationManagerModule.get(),
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of NavigationViewModel has already been disposed");
				}
			},
		};

        self.navOptions = ko.observableArray([]);
        self.searchQuery = ko.observable();
        self.loggedIn = ko.observable(false);

        self.loggedInSubscription = self._.authenticationManager.loggedIn.subscribe(function(loggedIn){
            self.loggedIn(loggedIn);
            self.updateNavigation();
        });

        self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
            self.updateNavigation();
        });

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
                self.updateNavigation();
				self._.shown = true;
			}
		};

		self.hidden = function() {
			self._.checkIfDisposed();
			if(self._.shown) {
				self._.shown = false;
			}
		};

		self.dispose = function() {
			if(!self._.disposed) {

                self._.navigationManager.dispose();
                self._.navidationManager = null;

                self._.authenticationManager.dispose();
                self._.authenticationManager = null;

				self._.disposed = true;
			}
		};

        self.triggerSearch = function(){
            if(self.searchQuery() !== null ||
                self.searchQuery() !== ""){
                chain.get()
                    .cc(function(context, error, next){
                        self._.navigationManager.setRoute("_");
                        next()
                    })
                    .pause(100) //adds a slight pause so that the updates happen the correct order
                    .cc(function(context, error, next){
                        self._.navigationManager.cacheUrlVariable("q", self.searchQuery());
                        self.searchQuery("")
                        self._.navigationManager.setRoute("search");
                        next()
                    })
                    .end();
            }
        };

        self.updateNavigation = function(){
            var routes = self._.navigationManager.getRoutes();
            var navigableRoutes = []
            for(var x=0; x<routes.length; x++){
                if(routes[x].presedence !== 0 && self._.navigationManager.validRoute(routes[x].route)){
                    navigableRoutes.push(routes[x]);
                }
            }
            self.navOptions(navigableRoutes);
        };

	}

	return{
		get: function() {
			return new NavigationViewModel();
		},
		type: function() {
			return NavigationViewModel;
		}
	};

});
