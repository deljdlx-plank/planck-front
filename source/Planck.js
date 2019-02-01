var Planck = {};

Planck.Component = {};



Planck.ajax = $.ajax;

/*
Planck.ajax = function(options)
{
    if(isset(options.success)) {
        var successCallback = options.success
        var overridedCallback = function(response, status, xhr) {

            var extraType = xhr.getResponseHeader("Extra-type")

            if(extraType == 'planck-datalayer') {
                var dataLayer = new Planck.DataLayer();
            }


            successCallback(response, status, xhr)
        }
        options.success = overridedCallback;
    };
    return $.ajax(options);
};
*/





Planck.Extension = {};
Planck.Module = {};
Planck.Model = {};



Planck.log = function(data)
{
   console.log(data);
};


Planck.inherit = function(targetClass, sourceClass)
{

    targetClass.prototype.parent = sourceClass.prototype;

    for(var attribute in sourceClass.prototype) {
        if(!isset(targetClass.prototype[attribute])) {
            targetClass.prototype[attribute] = sourceClass.prototype[attribute];
        }

    }
};



Planck.getConstructor = function(className, separator)
{
    if(!separator) {
        separator = '.';
    }

    var scopes = className.split(separator);

    var classExists = true;
    var rootScope = window;

    for(var index = 0; index<scopes.length; index++) {
        var scope = scopes[index];
        if(isset(rootScope[scope])) {
            rootScope = rootScope[scope];
        }
        else {
            classExists = false;
            break;

        }
    }

    if(classExists) {
        return rootScope
    }
    return false;
};

Planck.loadComponent = function(module, component, callback)
{

    var url = '?/tool/api/getComponent';

    Planck.ajax({
        url: url,
        data: {
            module: module,
            component: component
        },
        success: function(componentDescriptor)
        {
            callback(componentDescriptor)
        }
    })
};

Planck.isFunction = function(functionToCheck)
{
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};


i18n = function (string, key, package, localization)
{
    if(!package) {
        package = 'main';
    }

    if(isset(i18n.items[package])) {
        if(isset(i18n.items[package][key])) {
            return i18n.items[package][key];
        }

        if(isset(i18n.items[package][string])) {
            return i18n.items[package][string];
        }
    }

    return string;
};

i18n.items = {};


function initializeI18N(data)
{
    i18n.items = data;
}

