
Planck.Model.Entity = function()
{

};



Planck.Model.Entity.prototype.values = {};
Planck.Model.Entity.prototype.synchronized = false;
Planck.Model.Entity.prototype.formElement = null;
Planck.Model.Entity.prototype.inputSelector = '.form-data';
Planck.Model.Entity.prototype.repository = new Planck.Model.Repository();
Planck.Model.Entity.prototype.metadata = null;

/**
 *
 * @param {Planck.Model.Repository} repository
 */
Planck.Model.Entity.prototype.setRepository = function(repository)
{
   this.repository = repository;
   return this;
};


Planck.Model.Entity.prototype.getProperty = function(propertyName)
{
   if(isset(this.values.properties)) {
       if(isset(this.values.properties[propertyName])) {
           return this.values.properties[propertyName];
       }
   }
   return false;
};

Planck.Model.Entity.prototype.setMetadata = function(data)
{
    this.metadata = data;
    return this;
};

Planck.Model.Entity.prototype.getMedata = function()
{
    return this.metadata;
};

Planck.Model.Entity.prototype.serialize = function()
{
    return {
        values: this.getValues(),
        metadata: this.getMedata()
    };
};




Planck.Model.Entity.prototype.bindWithForm = function(formSelector)
{
    this.formElement = $(formSelector);
};

Planck.Model.Entity.prototype.getValuesFromForm = function()
{
    var inputs = this.formElement.find(this.inputSelector);
    var data = {};
    $(inputs).each(function(index, input) {
        var value = $(input).val();
        var name = $(input).attr('name');
        if(!name) {
            return;
        }

        //array value
        if(name.match(/\[\]/)) {

            if(!isset(data[name])) {
                data[name] = [];
            }
            if($(input).attr('type') =='checkbox') {
                if($(input).prop('checked')) {
                    data[name].push(value);
                }
                else {
                    data[name].push(0);
                }
            }
        }
        else {
            if($(input).attr('type') =='radio' || $(input).attr('type') =='checkbox') {
                if($(input).prop('checked')) {
                    data[name]= value;
                }
                else {
                    data[name]= 0;
                }
            }
            else {
                data[name] = value;
            }
        }

    });

    return data;
};

Planck.Model.Entity.prototype.loadValuesFromForm = function()
{


    var values = this.getValuesFromForm();

    for(var attribute in values) {
        this.setValue(attribute, values[attribute]);
    }
    return this;
};



Planck.Model.Entity.prototype.delete = function(callback)
{
    this.repository.delete(this, callback);
};


Planck.Model.Entity.prototype.store = function(callback)
{
    this.repository.store(this, callback);
};


Planck.Model.Entity.prototype.getId = function()
{
    return this.getValue('id');
};


Planck.Model.Entity.prototype.getValues = function()
{
    return this.values;
};

Planck.Model.Entity.prototype.setValue = function(key, value)
{
    this.values[key] = value;
    return this;
};

Planck.Model.Entity.prototype.setValues = function(values)
{
   this.values = values;
   return this;
};

Planck.Model.Entity.prototype.getValue = function(key)
{
    if(isset(this.values[key])) {
        return this.values[key];
    }
    return null;
};



