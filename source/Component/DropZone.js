Planck.Component.DropZone = function(container)
{


    this.services = {
        uploadImage: {
            url:'?/content/image/api/upload'
        }
    };

    this.events = {
       drop : function(event) {

       },
       upload: function(dataLayer)
       {

       }
    };

    this.$element = $(container);


    this.$element.on("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragging');
    });

    this.$element.on("dragleave", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragging');
    });




    this.$element.on("drop", function(event) {



        this.events.drop(event);

        var originalEvent = event.originalEvent;



        for(var i = 0 ; i<originalEvent.dataTransfer.items.length; i++) {
            var type = originalEvent.dataTransfer.items[i].kind;

            console.log('penser à customiser upload en fct du type '+type);
            console.log(originalEvent.dataTransfer.items[i]);
            console.log(originalEvent.dataTransfer.items[i].type);
            originalEvent.dataTransfer.items[i].getAsString(function(data) {
                console.log(data)
                console.log("=======================================")
            });


            if(type === 'file') {
                var file = originalEvent.dataTransfer.items[i].getAsFile();




                this.send(file);
            }
        }

        event.preventDefault();
        event.stopPropagation();
    }.bind(this));
};

Planck.Component.DropZone.prototype.on = function(eventName, callback)
{
   this.events[eventName] = callback;
   return this;
};




Planck.Component.DropZone.prototype.send = function(file)
{
    var url = this.services.uploadImage.url;
    var uploader = new Planck.Component.FileUploader(file);
    uploader.send(url, this.events.upload.bind(this));

};


