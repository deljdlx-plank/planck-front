Planck.Model.Segment = function(descriptor)
{

    this.descriptor = descriptor;

    this.entities = [];


    var className = this.getClassNameFromPHPClassName(descriptor.metadata.entityType);


    if(!className) {
        className = Planck.Model.Entity;
    }

    this.loadEntities(
        className,
       descriptor
    );

};

Planck.Model.Segment.prototype.loadEntities = function(entityClassName, descriptor)
{
    $(descriptor.entities).each(function(index, data) {

        var entity = new entityClassName();

        entity.loadFields(descriptor.metadata.fields.items);
        entity.setValues(data);
        this.entities.push(entity);
    }.bind(this));
};


Planck.Model.Segment.prototype.getEntities = function()
{
    return this.entities;
};


Planck.Model.Segment.prototype.getClassNameFromPHPClassName = function(phpClassName)
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