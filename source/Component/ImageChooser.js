Planck.Component.ImageChooser = function(element, options)
{

    this.events = {
        imageSelect: function() {

        }.bind(this)
    };

    this.element = $(element);

    console.log(this.element);


    this.previewSelector = '.imagePreview';
    this.imageURLTriggerSelector = '#image-url-trigger';
    this.imageURLInputSelector = '.planck-image-url';


    this.imageFileInputSelector = '#image-uploader-input';
    this.imageFileTriggerSelector = '.planck-choose-image-trigger';

    this.deleteImageTriggerSelector = '.plk-delete-image-trigger';


    this.deletedImageSelector = '*[name=_plk_delete_image]';



    this.uploadOnChoice = true;

    this.uploadService;


    this.temporaryImageURL;


    this.temporaryUploadServiceURL = '?/tool/resource/api/upload-image';


    this.cropper;
    this.cropData;
    this.cropEnable = true;
    this.cropChanged = false;
    this.cropInitialized = false;


};




Planck.Component.ImageChooser.prototype.initialize = function()
{

    this.initializeImageByFileInput();
    this.initializeImageByURLInput();

    //==================================================================


    $(this.deleteImageTriggerSelector).click(function() {
        this.setPreview('');
        $(this.deletedImageSelector).val(1);
        return false;
    }.bind(this));


    if($(this.previewSelector).find('img').length) {
        $(this.deleteImageTriggerSelector).show();
    }


    this.initializeCropper();

    //==================================================
};

Planck.Component.ImageChooser.prototype.initializeImageByFileInput = function()
{


    this.coverImageInput= new Planck.Component.ImageUploader({
        maxWidth: 0,
        maxHeight: 0,

        onSelection: function (image) {
            this.cropInitialized = false;
            var src = $(image).attr('src');
            this.setPreview(src, true);

            this.events.imageSelect();

            if(this.cropEnable) {
                this.initializeCropper();
            }


        }.bind(this)
    });


    $(this.imageFileTriggerSelector).click(function() {
        $(this.imageFileInputSelector).trigger('click');
        return false;
    }.bind(this));


    var myInput = $(this.imageFileInputSelector).get(0);


    myInput.addEventListener('change', function () {
        this.coverImageInput.initialize('cover', myInput.files[0]);
    }.bind(this), false);

};

Planck.Component.ImageChooser.prototype.initializeImageByURLInput = function()
{
    $(this.imageURLTriggerSelector).click(function() {
        var url = $(this.imageURLInputSelector).val();
        this.selectImageByURL(url);
    }.bind(this));

    $(this.imageURLInputSelector).keypress(function(event) {


        if(event.keyCode == 13) {
            var url = event.target.value;
            this.selectImageByURL(url);
            return false;
        }
    }.bind(this));
};




Planck.Component.ImageChooser.prototype.selectImageByURL = function(url)
{


    if(url) {
        if(this.uploadOnChoice) {



            this.uploadImage({
                    imageURL: url
                },
                this.temporaryUploadServiceURL,
                function(response) {
                    this.cropInitialized = false;
                    this.setPreview(response.url);
                    this.events.imageSelect();
                    if(this.cropEnable) {
                        this.initializeCropper();
                    }
                }.bind(this)
            );
        }
        else {

        }

        this.setPreview(url);

    }
};


Planck.Component.ImageChooser.prototype.hasCropChanged = function()
{
   return this.cropChanged;
};

Planck.Component.ImageChooser.prototype.getCropData = function()
{
    if(this.cropper && $(this.previewSelector).find('img').length) {

        var cropData = this.cropper.cropper('getData', true);

        //var cropData = JSON.parse(this.cropDataInput.val());
        //cropData = $.extend(cropData, this.cropper.cropper('getData', true));
        //console.log(cropData);

        cropData.originalWidth  = '';
        cropData.originalHeight = '';

        cropData.containerHeight = $(this.element).find(this.previewSelector).get(0).offsetHeight;
        cropData.containerWidth = $(this.element).find(this.previewSelector).get(0).offsetWidth;

        return cropData;
    }
    return false;

};

Planck.Component.ImageChooser.prototype.initializeCropper = function()
{

    this.cropDataInput = $('input[name=cropData]');

    if($('input[name=cropData]').length) {

        var cropData = JSON.parse(this.cropDataInput.val());
        for(var attribute in cropData) {
            cropData[attribute] = parseFloat(
                cropData[attribute]
            );
        }
        this.cropData = cropData;

    }


    var options = {
        aspectRatio: 7 / 1,
        autoCrop: true,
        data: this.cropData,
        zoomable: false

         ,crop: function(event) {
            this.cropChanged = true;
            this.cropDataInput.val(
               JSON.stringify(this.getCropData())
            );

         }.bind(this)
    };




    if(options.data) {

        //$(this.previewSelector).find('img').css('width', cropData.containerWidth+'px');
        //$(this.previewSelector).css('height', cropData.containerHeight+'px');


    }


    console.log(options);


    this.cropper = $(this.previewSelector).find('img');


    this.cropper.cropper(options);


    this.cropInitialized = true;

};



Planck.Component.ImageChooser.prototype.setPreview = function(imageURL, cache)
{
    if(imageURL) {

        var seed = '';
        if(!cache) {
            seed = '?noCache='+Math.random()+'_';
            seed += new Date().getMilliseconds()
        }


        var image = '<img src="'+imageURL+seed+'" class="preview"/>';
        $(this.previewSelector).html(image);
        $(this.deleteImageTriggerSelector).show();



    }
    else {
        $(this.previewSelector).html('');
        $(this.deleteImageTriggerSelector).hide();
    }
};


Planck.Component.ImageChooser.prototype.getImageURL = function()
{
    if(this.temporaryImageURL) {
        return this.temporaryImageURL;
    }
   return this.element.find(this.imageURLInputSelector).val();
};


Planck.Component.ImageChooser.prototype.reset = function()
{
    $(this.deleteImageTriggerSelector).hide();
    $(this.previewSelector).html('');
    $(this.imageURLInputSelector).val('');
    $(this.deletedImageSelector).val(0);


};



Planck.Component.ImageChooser.prototype.getData = function()
{
    return this.coverImageInput.getData()
};


Planck.Component.ImageChooser.prototype.saveRawImage = function(url, data, callback)
{


    if(this.cropEnable && this.cropInitialized) {
        data['crop'] = this.getCropData();
    }
    if(this.temporaryImageURL) {
        data['imageURL'] = this.temporaryImageURL;
    }

    console.log(data);

    var imageBuffer = this.coverImageInput.getData();

    data['rawBuffer'] = imageBuffer;

     Planck.ajax({
        url: url,
        method: 'post',
        data: data,
        success: function(data) {
            if(callback) {
                callback(data);
            }
        }.bind(this)
     });
};

Planck.Component.ImageChooser.prototype.saveImageByUrl = function(url, data, callback)
{


    if(this.cropEnable && this.cropInitialized) {
        data['crop'] = this.getCropData();
    }
    if(this.temporaryImageURL) {
        data['imageURL'] = this.temporaryImageURL;
    }

    console.log(data);


    Planck.ajax({
        url: url,
        method: 'post',
        data: data,
        success: function(data) {
            if(callback) {
                callback(data);
            }
        }.bind(this)
    })

};


Planck.Component.ImageChooser.prototype.hasImage =  function(callback)
{
    if(
        this.getImageURL()
        || this.getData()
    ) {
        return true;
    }

    return false;
};



Planck.Component.ImageChooser.prototype.uploadImage = function(data, url, callback)
{


    var imageURL = this.getImageURL();
    if(imageURL) {
        this.saveImageByUrl(
            url,
            data,
            function(response) {
                this.temporaryImageURL = response.url;
                if(callback) {
                    callback(response)
                }
            }.bind(this)
        )
    }
    else {
        if(this.getData()) {
            this.saveRawImage(
                url,
                data
            );
        }

    }
};


