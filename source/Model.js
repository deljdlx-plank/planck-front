Planck.Model = function()
{

};



Planck.Model.prototype.getEntityByDescriptor = function(descriptor)
{


    var entityClassName = this.getClassNameFromPHPClassName(descriptor.metadata.descriptor.entityType);

    if(entityClassName) {
        var entity = new entityClassName();
    }
    else {
        var entity = new Planck.Model.Entity();
    }

    entity.setValues(descriptor.values);
    entity.loadFields(descriptor.metadata.descriptor.fields);

    return entity;
};



Planck.Model.prototype.getClassNameFromPHPClassName = function(phpClassName)
{

    var scopes = phpClassName.split('\\');



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
        return rootScope;
    }
    else {
        return false;
    }
};