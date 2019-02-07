Planck.Component.FileUploader = function(file)
{
    this.file = file;
};


Planck.Component.FileUploader.prototype.send = function(url, callback)
{


    var formData = new FormData();
    formData.append('file', this.file);

    Planck.ajax({
        type: 'POST',
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.debug(data);
            if(callback) {
                callback(data);
            }
        },
        error: function (data) {
            alert('There was an error uploading your file!');
        }
    });

};

