define(["ko", "contentViewModel","footerViewModel"], function(ko, contentViewModleModule, footerViewModelModule){
   function  MainWindowViewModel(){
        var self = this;

        self.contentViewModel = contentViewModleModule.get();
        self.footerViewModel = footerViewModelModule.get();

        self._={
            shown : false,
            disposed: false,
        };

        self.shown = function(){
            self.contentViewModel.shown();
            self.footerViewModel.shown();
        }

        self.hidden = function(){
            self.contentViewModel.hidden();
            self.footerViewModel.hidden();
        }

        self.dispose = function(){
            if(!self._.disposed){
                
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
