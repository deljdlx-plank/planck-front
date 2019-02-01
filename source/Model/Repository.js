
Planck.Model.Repository = function()
{

};


Planck.Model.Repository.prototype.services = {
   save: {
       url: '?/tool/route/call&route=/entity-editor/entity[save]',
       method: 'post'
   },
    delete: {
        url: '?/tool/route/call&route=/entity-editor/entity[delete]',
        method: 'delete'
    }
};


Planck.Model.Repository.prototype.delete = function(entity, callback)
{



    Planck.ajax({
        url: this.services.delete.url,
        method:  this.services.delete.method,
        data: {
            entity: entity.getValues()
        },
        success: function(response) {


            var dataLayerEntry = new Planck.DataLayerEntry();
            entity = dataLayerEntry.getValueFromDescriptor(response)


            //console.log(valueObject)
            //entity.setValues(response.entity.values);
            if(callback) {
                callback({
                    entity: entity,
                    repository: this,
                    reponse: response
                });
            }
        }.bind(this)

    });


};




/**
 *
 * @param {Planck.Model.Entity} entity
 * @param callback
 */
Planck.Model.Repository.prototype.store = function(entity, callback)
{


    Planck.ajax({
        url: this.services.save.url,
        method:  this.services.save.method,
        data: {
            entity: entity.getValues()
        },
        success: function(response) {


            entity.setValues(response.data.values);

            if(callback) {
                callback({
                    entity: entity,
                    repository: this,
                    reponse: response
                });
            }
        }.bind(this)

    });
};

