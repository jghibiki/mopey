define(["ko", "jquery", "navigationManager"], function(ko, $, NavigationManagerModule) {

	function NavigationViewModel() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
            navigationManager: NavigationManagerModule.get(),
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of NavigationViewModel has already been disposed");
				}
			},
		};

        self.navOptions = ko.observableArray([]);
        self.searchQuery = ko.observable();

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
                var routes = self._.navigationManager.getRoutes();
                var navigableRoutes = []
                for(var x=0; x<routes.length; x++){
                    if(routes[x].presedence !== 0){
                        navigableRoutes.push(routes[x]);
                    }
                }
                self.navOptions(navigableRoutes);

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

				self._.disposed = true;
			}
		};

        self.triggerSearch = function(){
            if(self.searchQuery() !== null ||
                self.searchQuery() !== ""){
                self._.navigationManager.cacheUrlVariable("q", self.searchQuery());
                self._.navigationManager.setRoute("search");
                self.searchQuery("")
            }
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
