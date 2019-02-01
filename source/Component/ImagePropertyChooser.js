Planck.Component.ImagePropertyChooser = function(element, options)
{

    var options = $.extend({
        imageServiceURL: '?/entity-editor/api/set-image-property',
        imageCropServiceURL: '?/entity-editor/api/set-image-property-crop'
    }, options)

    this.imageChooser;
    this.imageServiceURL = options.imageServiceURL;
    this.imageCropServiceURL = options.imageCropServiceURL;



    this.element = $(element);
};



Planck.Component.ImagePropertyChooser.prototype.initialize = function()
{
    this.imageChooser = new Planck.Component.ImageChooser(
        this.element.find('.plk-image-chooser')
    );
    this.imageChooser.initialize();
};


Planck.Component.ImagePropertyChooser.prototype.onImageSelect = function(callback)
{
    this.imageChooser.events.imageSelect = callback
};




Planck.Component.ImagePropertyChooser.prototype.hasCropChanged = function()
{
    return this.imageChooser.hasCropChanged()
};

Planck.Component.ImagePropertyChooser.prototype.getCropData = function()
{
    return this.imageChooser.getCropData();
};

Planck.Component.ImagePropertyChooser.prototype.updateCrop = function(entity)
{
    var url = this.imageCropServiceURL;
    var data = {
        crop: this.imageChooser.getCropData(),
        entity: entity.getValues(),
        fingerPrint: this.getFingerPrint()
    };


    Planck.ajax({
        url: url,
        method: 'post',
        data: data,
        success: function(response) {

        }.bind(this)
    });




};

Planck.Component.ImagePropertyChooser.prototype.hasImage =  function()
{
    return this.imageChooser.hasImage()
};

Planck.Component.ImagePropertyChooser.prototype.getFingerPrint = function()
{
   return this.element.find('input[name=_fingerPrint]').val();
};


Planck.Component.ImagePropertyChooser.prototype.sendImage = function(options)
{
    var imageURL = this.imageChooser.getImageURL();


    if(imageURL) {
        this.imageChooser.saveImageByUrl(
            options.url,
            options.data,
            options.callback
        )
    }
    else {
        if(this.imageChooser.getData()) {
            this.imageChooser.saveRawImage(
                options.url,
                options.data,
                options.callback
            );
        }

    }
};


Planck.Component.ImagePropertyChooser.prototype.updateImage = function(entity)
{

    var imageURL = this.imageChooser.getImageURL();


    if(imageURL) {
        this.imageChooser.saveImageByUrl(
            this.imageServiceURL,
            {
                entity: entity.getValues(),
                imageURL: imageURL,
                fingerPrint: this.getFingerPrint()
            }, function(entity) {

            }.bind(this)
        )
    }
    else {
        if(this.imageChooser.getData()) {
            this.imageChooser.saveRawImage(
                this.imageServiceURL,
                {
                    entity: entity.getValues(),
                    fingerPrint: this.getFingerPrint()
                }
            );
        }

    }
};



