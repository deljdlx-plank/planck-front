Planck.Controller = function()
{

};


Planck.Controller.prototype.components = {};
Planck.Controller.prototype.dataLayer;


Planck.Controller.prototype.initialize = function()
{
    this.dataLayer = this.getDataLayer();
    this.loadDataLayerFromDom(this.$element);
    this.loadComponents();
};


Planck.Controller.prototype.getDataLayer = function()
{
    if(!this.dataLayer) {
        this.dataLayer = new Planck.DataLayer();
    }
    return this.dataLayer;
};


Planck.Controller.prototype.loadDataLayerFromDom = function(selector)
{
    var entries = $(selector).find('*[type="'+'application/json+planck-data'+'"]');

    entries.each(function(index, item) {
        var json = $(item).text();
        try {
            var data = JSON.parse(json);
        }
        catch(exception) {
            console.log(exception);
        }
        this.loadData(data);

    }.bind(this));

    return this;
};


Planck.Controller.prototype.loadData = function(data)
{

    for(var name in data) {
        this.getDataLayer().set(name, data[name]);


        if(isset(this[name])) {
            this[name] = this.getDataLayer().get(name);
        }
    }
};










Planck.Controller.prototype.loadComponents = function()
{

    $('.plk-component').each(function(index, item) {
        var componentName = item.getAttribute('data-component-name');


        if($(item).data('initialized')) {
            return;
        }

        if(componentName) {
            var instance = Planck.getConstructor(componentName);
            if(instance) {
                var component = new instance();

                component.setElement(item);


                if(!isset(this.components[componentName])) {
                    this.components[componentName] = [];
                }

                this.components[componentName].push(component);
            }
        }
    }.bind(this));

    return this;
};

