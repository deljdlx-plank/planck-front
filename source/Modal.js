Planck.Modal = function()
{

    this.selector = '#modal';
    this.events = {};

};

Planck.Modal.initialized =false;

Planck.Modal.prototype.initialize = function()
{

    if(Planck.Modal.initialized) {
        return;
    }

    var html=
        '<div class="modal" tabindex="-1" role="dialog" id="'+this.selector+'">'+
            '<div class="modal-dialog modal-lg" role="document">'+ //modal-dialog modal-dialog-centered
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title"></h5>'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>'+
                    '<div class="modal-body"></div>'+
                    '<div class="modal-footer"></div>'+
                '</div>'+
            '</div>'+
        '</div>';

    $('body').append(html);
    this.element = $(this.selector);
    Planck.Modal.initialized = true;
};


Planck.Modal.prototype.confirm = function(title, content, callback)
{

    this.reset();


    this.setTitle(title);
    this.setContent(content);

    this.confirmButton(callback);
    this.cancelButton();
    this.show();
};


Planck.Modal.prototype.getContentContainer = function()
{
   return this.element.find('.modal-body');
};


Planck.Modal.prototype.setContent = function(content)
{
    this.element.find('.modal-body').html(content);
    return this;
};


Planck.Modal.prototype.setTitle = function(title)
{
    this.element.find('.modal-title').html(title);
    return this;
};


Planck.Modal.prototype.reset = function()
{
    this.element.find('.modal-title').html('');
    this.element.find('.modal-footer').html('');
};

Planck.Modal.prototype.cancelButton = function(caption) {

    if(!caption) {
        caption = 'Annuler';
    }

    this.element.find('.modal-footer button[data-dismiss]').remove();
    this.element.find('.modal-footer').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">'+caption+'</button>');
};

Planck.Modal.prototype.clearButtons = function() {
    this.element.find('.modal-footer').html('');
};





Planck.Modal.prototype.confirmButton = function(callback, caption) {
    if(!caption) {
        caption = 'Confirmer';
    }
    this.element.find('.modal-footer').append('<button type="button" class="btn btn-primary confirm">'+caption+'</button>');

    this.events.confirm = callback;

    this.element.find('.modal-footer button.confirm').click(function(event) {
        if(Khi.isFunction(this.events.confirm)) {
            this.events.confirm(event);
        }

    }.bind(this));
};



Planck.Modal.prototype.hide = function()
{
    this.element.modal('hide');
};

Planck.Modal.prototype.show = function(title, content)
{
    if(title) {
        this.element.find('.modal-title').html(title);
    }

    if(content) {
        this.element.find('.modal-body').html(content);
    }

    this.element.modal()
};



