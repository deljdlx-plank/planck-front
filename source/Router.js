Planck.Router = function(application)
{
    this.router = new Khi.Routing.Router(application);
    this.application = application;
    this.initialize();
};


Planck.Router.prototype.run = function(once)
{
    this.router.run(once);
};



Planck.Router.prototype.initialize = function() {



};

