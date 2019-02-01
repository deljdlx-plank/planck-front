
Planck.Component.ImageUploader = function(options)
{

    this.options = {
        maxWidth : 600,
        maxHeight: 600,
        onSelection: function(image) {
            return image;
        }.bind(this)
    };

    if(options) {

        this.options= $.extend(this.options,options);
    }

    console.log(this.options);



    this.images = {};

    this.data = null;

}


Planck.Component.ImageUploader.prototype._add = function(fileName, file, callback) {


    var reader = new FileReader();
    var self = this;


    reader.readAsDataURL(file);

    reader.onloadend = function(evt) {


        var dataURL = reader.result;
        this.data = dataURL;


        var image = new Image();
        image.src = dataURL;

        image.onload = function () {

            var shouldResize = false;


            var width = image.width;
            var height = image.height;

            if(self.options.maxWidth || self.options.maxHeight) {
                var shouldResize = (width > self.options.maxWidth) || (height > self.options.maxHeight);
            }



            if (!shouldResize) {
                //self.sendFile(fileName, dataURL);
                self.images[fileName] = dataURL;

                var imagePreview = new Image();
                imagePreview.src = dataURL;

                imagePreview.onload = function () {
                    self.options.onSelection(this);
                }

                if(Khi.isFunction(callback)) {
                    callback(dataURL);
                }


                return;
            }
            else {

                self.EXIFRotation(image, function(canvas) {

                    console.log(callback);

                    var dataURL = canvas.toDataURL(file.type);

                    var imagePreview = new Image();
                    imagePreview.src = dataURL;
                    imagePreview.onload = function () {
                        self.options.onSelection(this);
                        //$('#imagePreview').append(imagePreview);
                    }

                    if(Khi.isFunction(callback)) {
                        callback(dataURL);
                    }

                    return;
                });
            }
        }
    }.bind(this);
}


Planck.Component.ImageUploader.prototype.initialize = function(imageName, fileObject) {
    this._add(imageName, fileObject);
};



Planck.Component.ImageUploader.prototype.send = function(url, imageName, file) {

    this.add(imageName, file, function(data) {
        this.sendFile(url, imageName, data)
    }.bind(this))
}

Planck.Component.ImageUploader.prototype.getData = function()
{
    return this.data;
};



Planck.Component.ImageUploader.prototype.EXIFRotation = function(image, callback) {
    var orientation = null;

    var width = image.width;
    var height = image.height;




    var newWidth = width;
    var newHeight = height;


    if(this.options.maxWidth || this.options.maxHeight) {
        var maxWidth = this.options.maxWidth;
        var maxHeight = this.options.maxHeight;


        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }
    }





    EXIF.getData(image, function() {

        //console.debug(EXIF.pretty(this));

        orientation = EXIF.getTag(this, "Orientation");

        var canvas = document.createElement('canvas');


        var context = canvas.getContext('2d');

        if(orientation == 1) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth, newHeight);
        }

        if(orientation == 8) {
            canvas.width = newHeight;
            canvas.height = newWidth;
            context.translate(newWidth/2, newHeight/2)
            context.rotate(-90*Math.PI/180);
            context.drawImage(image, newWidth/4, 0, -newWidth,  -newHeight);
        }

        if(orientation == 6) {
            canvas.width = newHeight;
            canvas.height = newWidth;
            context.translate(newWidth/2, newHeight/2)
            context.rotate(90*Math.PI/180);
            context.drawImage(image, -newWidth/4, 0, newWidth,  newHeight);
        }

        if(orientation == 3) {
            canvas.width = newWidth;
            canvas.height = newHeight;

            context.translate(newWidth/2, newHeight/2)
            context.rotate(-180*Math.PI/180);

            context.drawImage(image, -newWidth/2, -newHeight/2, newWidth,  newHeight);
        }

        if(!orientation) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth,  newHeight);
        }



        callback(canvas);
    });
};


Planck.Component.ImageUploader.prototype.sendFile = function(url, imageName, data) {

    var formData = new FormData();


    formData.append(imageName, data);


    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.debug(data);
        },
        error: function (data) {
            alert('There was an error uploading your file!');
        }
    });
}




