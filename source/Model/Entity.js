
Planck.Model.Entity = function()
{




};

Planck.Model.Entity.prototype.entityType = null;

Planck.Model.Entity.prototype.fields = {};
Planck.Model.Entity.prototype.values = {};
Planck.Model.Entity.prototype.synchronized = false;
Planck.Model.Entity.prototype.formElement = null;
Planck.Model.Entity.prototype.inputSelector = '.form-data';
Planck.Model.Entity.prototype.repository = new Planck.Model.Repository();
Planck.Model.Entity.prototype.metadata = null;


Planck.Model.Entity.prototype.primaryKeyFieldName = null;
Planck.Model.Entity.prototype.labelFieldName = null;

Planck.Model.Entity.prototype.events = {
    store:[]
};


/**
 *
 * @param {Planck.Model.Repository} repository
 */
Planck.Model.Entity.prototype.setRepository = function(repository)
{
   this.repository = repository;
   return this;
};

/**
 *
 * @returns {Planck.Model.Repository|*}
 */
Planck.Model.Entity.prototype.getRepository = function()
{
    this.repository.setEntity(this);
   return this.repository;
};


Planck.Model.Entity.prototype.getType = function()
{
   return this.entityType;
};


Planck.Model.Entity.prototype.loadFields = function(descriptor)
{
    this.fields = descriptor;

    for(var fieldName in this.fields) {

        var fiedDescriptor = this.fields[fieldName];

        if(fiedDescriptor.role == 'primaryKey') {
            this.primaryKeyFieldName = fieldName;
        }

        if(fiedDescriptor.role == 'label') {
            this.labelFieldName = fieldName;
        }

    }
    return this;
};


Planck.Model.Entity.prototype.getLabel = function()
{
    return this.getValue(
        this.labelFieldName
    );
};

Planck.Model.Entity.prototype.getId = function()
{
    if(this.primaryKeyFieldName) {

        return this.getValue(
            this.primaryKeyFieldName
        );
    }
    else {
        return this.getValue('id');
    }

};


Planck.Model.Entity.prototype.onStore = function(callback)
{
    this.events.store.push(callback);
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
    this.repository.store(this, function(descriptor) {
        this.setValues(
            descriptor.entity.getValues()
        );

        for(var i=0; i<this.events.store.length; i++) {
            this.events.store[i](this);
        }

        if(callback) {
            callback(descriptor);
        }

    }.bind(this));
};


Planck.Model.Entity.prototype.toJSON = function()
{
    return JSON.stringify(this.getValues());
};



Planck.Model.Entity.prototype.getValues = function(removeNull)
{
    if(removeNull) {
        var values = {}
        for(var name in this.values) {
            var value = this.values[name];
            if(value !== null) {
                values[name] = value;
            }
            return values;
        }
    }
    else {
        return this.values;
    }

};

Planck.Model.Entity.prototype.setValue = function(key, value)
{
    this.values[key] = value;
    return this;
};

Planck.Model.Entity.prototype.setValues = function(values)
{
   this.values = values;

   if(this.formElement) {
        for(var key in this.values) {
            var value = this.values[key];
            this.formElement.find('*[name='+key+']').val(value);
        }
   }

   return this;
};

Planck.Model.Entity.prototype.getValue = function(key)
{
    if(isset(this.values[key])) {
        return this.values[key];
    }
    return null;
};



