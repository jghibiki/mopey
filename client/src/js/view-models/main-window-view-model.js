define(["ko", "contentViewModel","headerViewModel",  "footerViewModel"], function(ko,  contentViewModleModule,headerViewModelModule, footerViewModelModule){
   function  MainWindowViewModel(){
        var self = this;

        self.headerViewModel = headerViewModelModule.get();
        self.contentViewModel = contentViewModleModule.get();
        self.footerViewModel = footerViewModelModule.get();

        self._={
            shown : false,
            disposed: false,
        };

        self.shown = function(){
            self.headerViewModel.shown();
            self.contentViewModel.shown();
            self.footerViewModel.shown();
        }

        self.hidden = function(){
            self.headerViewModel.hidden();
            self.contentViewModel.hidden();
            self.footerViewModel.hidden();
        }

        self.dispose = function(){
            if(!self._.disposed){
                
                self.headerViewModel.dispose();
                self.headerViewModel = null;
                
                self.contentViewModel.dispose();
                self.contentViewModel = null;

                self.footerViewModel.dispose();
                self.footerViewModel = null;

                self._.disposed = true;
            }
        }


    }

    return {
        get: function(){
            return new MainWindowViewModel();
        },
        type: function(){
            return MainWindowViewModel;
        }
    };
});
