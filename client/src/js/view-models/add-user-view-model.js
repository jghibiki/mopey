define(["ko", "nativeCommunicationManager"], function(ko, NativeCommunicationManagerModule){
    function AddUserViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Add User View Model has already been disposed.");
                }
            }
        };

        self.fname = ko.observable();
        self.lname = ko.observable();
        self.user = ko.observable();
        self.email = ko.observable();
        self.password = ko.observable();
        self.password2 = ko.observable();
        self.terms = ko.observable();

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;
                self._.disposed = true;
            }
        }
    }

    return {
        get: function(){
            return new AddUserViewModel();
        },
        type: function(){
            return AddUserViewModel;
        }
    };
});
