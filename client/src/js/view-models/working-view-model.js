define(["ko", "navigationManager", "contentManager", "chain"], function(ko, NavigationManagerModule, ContentManagerModule, chain) {

	function WorkingViewModel() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
            navigationManager: NavigationManagerModule.get(),
            contentManager: ContentManagerModule.get(),

			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of WorkingViewModel has already been disposed");
				}
			},
            startLoadContent: function(newRoute){
                var newContent = null;
                chain.get()
                    .cc(self._.loadContent)
                    .end({"viewModel": newRoute.viewModel},self._.setContent)
            },
            loadContent: function(context, error, next){
                context.chain.cc(self._.contentManager.scheduleLoad);
                next(context);
            },
            setContent: function(context){
                self.content(context.module);
                self.content().shown();
                self._.contentManager.saveVM(
                        self._.navigationManager.currentRoute().viewModel,
                        self.content());
            }
		};

        self.content = ko.observable();

        self.routeSubscription = self._.navigationManager.currentRoute.subscribe(self._.startLoadContent);

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
                if(!(self.content() === undefined || 
                    self.content() === null)){
                        self.content().shown();
                    }
                else{
                    self._.startLoadContent(self._.navigationManager.currentRoute());
                }
				self._.shown = true;
			}
		};

		self.hidden = function() {
			self._.checkIfDisposed();
			if(self._.shown) {
                if(!(self.content() === undefined || 
                    self.content() === null)){
                        self.content().hidden();
                    }
    
				self._.shown = false;
			}
		};

		self.dispose = function() {
			if(!self._.disposed) {
                if(!(self.content() === undefined ||
                        self.content() === null)){
                            self.content().dispose();
                            self.content = null;
                        }

                self._.navigationManager.dispose();
                self._.navigationManager = null;

                self._.contentManager.dispose();
                self._.contentManager = null;

				self._.disposed = true;
			}
		};
	}

	return{
		get: function() {
			return new WorkingViewModel();
		},
		type: function() {
			return WorkingViewModel;
		}
	};

});
