Planck.DataLayerEntry = function()
{

    this.data ={};
    this.metadata = {};
};



Planck.DataLayerEntry.prototype.setData= function(data)
{

    this.data = this.getValueFromDescriptor(data);
    this.metadata = data['metadata'];
    return this;
};




Planck.DataLayerEntry.prototype.getData = function()
{
    return this.data;
};



Planck.DataLayerEntry.prototype.getValueFromDescriptor= function(data)
{
    if(isset(data['metadata'])) {
        if(isset(data['metadata']['className'])) {
            var instance = this.getInstanceFromData(data);
            if(instance) {
                return instance;
            }
        }
    }
    return data;
};





Planck.DataLayerEntry.prototype.getInstanceFromData = function(data)
{

    var scopes = data['metadata']['className'].split('\\');


    var classExists = true;
    var rootScope = window;

    for(var index = 0; index<scopes.length; index++) {
        var scope = scopes[index];

        if(isset(rootScope[scope])) {
            rootScope = rootScope[scope];
        }
        else {
            classExists = false
            break;

        }
    }


    if(classExists) {

        var instance = new rootScope;

        if(isset(data['data']['values'])) {

            var dataEntry = data['data'];

            if(isset(instance.setValues)) {
                instance.setValues(dataEntry['values']);
            }
            if(isset(instance.setMetadata) && isset(dataEntry['metadata'])) {
                instance.setMetadata(dataEntry['metadata']);
            }
        }

        if(isset(dataEntry['foreignEntities'])) {



            for(var property in dataEntry['foreignEntities']) {
                if(isset(instance[property])) {

                    var foreignData = dataEntry['foreignEntities'][property];

                    var formatedDataLayer = {
                        data: foreignData,
                        metadata: foreignData.metadata
                    }


                    var foreignInstance = this.getInstanceFromData(
                        formatedDataLayer
                    );

                    instance[property] = foreignInstance;
                }
            }
        }


        return instance;
    }

    return false;
};









Planck.DataLayerEntry.prototype.serialize = function()
{

    var data = null;

    if(isset(this.data.serialize)) {
        data = this.data.serialize();
    }
    else if(isset(this.data.getValues)) {
        data = this.data.getValues();
    }
    else {
        data = this.data;
    }

    return {
        metadata: this.metadata,
        data: data
    };
};





