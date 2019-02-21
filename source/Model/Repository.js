
Planck.Model.Repository = function()
{

};


Planck.Model.Repository.prototype.services = {
   save: {
       url: '?/@extension/planck-extension-entity_editor/entity/api[save]',
       method: 'post'
   },
    delete: {
        url: '?/@extension/planck-extension-entity_editor/entity/api[delete]',
        method: 'delete'
    },
    getAllEntities: {
        url: '?/@extension/planck-extension-entity_editor/entity/api[get-all]',
        method: 'get'
    }
};

Planck.Model.Repository.prototype.entity = null;


Planck.Model.Repository.prototype.delete = function(entity, callback)
{
    Planck.ajax({
        url: this.services.delete.url,
        method:  this.services.delete.method,
        data: this.getEntityDescriptor(entity),
        success: function(response) {


            var dataLayerEntry = new Planck.DataLayerEntry();
            entity = dataLayerEntry.getValueFromDescriptor(response)


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

Planck.Model.Repository.prototype.getAllEntities = function(options)
{

    var defaultOptions = {
       load: function(entityList) {},
        parameters: {},
    };

    var options = $.extend(defaultOptions, options);


    Planck.ajax({
        url: this.services.getAllEntities.url,
        method:  this.services.getAllEntities.method,
        data: {
            parameters: options.parameters,
            entity: this.getEntityDescriptor(this.entity)
        },
        success: function(entitiesDescriptors) {

            var entityList =entitiesDescriptors;

            if(entitiesDescriptors.length) {


                var model = new Planck.Model();

                var entityList = [];


                for(var index = 0 ; index<entitiesDescriptors.length; index++) {
                    var entity = model.getEntityByDescriptor(entitiesDescriptors[index]);
                    entityList.push(entity);
                }
            }


            options.load(entityList);


        }.bind(this)
    });
};

/**
 *
 * @param {Planck.Model.Entity} entity
 */
Planck.Model.Repository.prototype.setEntity = function(entity)
{
    this.entity = entity;
    return this;
};


Planck.Model.Repository.prototype.getEntityDescriptor = function(entity)
{
    return {
        metadata: {
            entityType: entity.getType(),
            fingerprint: entity.getValue('_fingerprint')
        },
        values: entity.getValues()
    };
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
           entity: this.getEntityDescriptor(entity)
        },
        success: function(response) {

            console.log(response);

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

