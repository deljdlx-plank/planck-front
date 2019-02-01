Planck.DataLayer = function()
{

    this.entries = {}
};


Planck.DataLayer.prototype.set = function(name, value)
{
    var entry = new Planck.DataLayerEntry();
    entry.setData(value);
    this.entries[name] = entry;

    return this;
};

Planck.DataLayer.prototype.getEntries = function()
{
   return this.entries;
};


Planck.DataLayer.prototype.getEntry = function(name)
{
    if(isset(this.entries[name])) {
        return this.entries[name].getData();
    }
    else {
        throw new Error('No data entry with name '+name);
    }
};

Planck.DataLayer.prototype.get = function(name, ifNonExist)
{
    if(isset(this.entries[name])) {
        return this.entries[name].getData();
    }

    if(ifNonExist !== null) {
        return ifNonExist;
    }

    return null;

};



Planck.DataLayer.prototype.getOld = function(name, ifNonExist)
{
    if(isset(this.values[name])) {
        return this.values[name];
    }

    if(ifNonExist !== null) {
        return ifNonExist;
    }

    return null;

};






Planck.DataLayer.prototype.serialize = function()
{
    var data = {}
    for(var name in this.entries) {
        var entry = this.entries[name];
        data[name] = entry.serialize();
    }

    return data;
};


