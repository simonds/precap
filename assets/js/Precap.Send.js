var Precap = Precap || {};

Precap.Send = new Class({

    Implements: [Precap.BSheet, Options,Events]

    ,options: {
        className: 'SendView TwoColumn'
        ,title: 'Send this precap...'
    }

    ,initialize: function(precapDoc, options){
        this.setOptions(options);
        this._data = precapDoc.getData();
        this.precapDoc = precapDoc;

        // The ultimate 'deliverable' we are producing with this object.
        this._deliverableData = {
            sections: []
            ,recipients: []
            ,subject: ''
            ,message: ''
        };

        if (this._data) {
            this._buildFraming();
            this._build();
            this._setupEvents();
        }
    }

    ,_setupEvents: function(){
        this.addEvent('toggleSection', function(section){
            if (!section.li.hasClass('Unselected')) {
                section.li.addClass('Unselected');
                section.selected = false;
            } else {
                section.li.removeClass('Unselected');
                section.selected = true;
            }
        });

        this.addEvent('send:clicked', function(button){
            this._sendButton.showSpinner();

            // prep recipients
            this._deliverableData.recipients.empty();
            this._data.sections.each(function(sec){
                if (sec.type == 'Group') {
                    sec.contacts.each(function(c){
                        if (c.selected) {
                            this._deliverableData.recipients.push(c);   
                        }
                    }, this);
                }
            }, this);

            if (this._deliverableData.recipients.length == 0) {
                alert('You must choose at least 1 recipient for your precap.');
                return;
            }

            // prep sections
            this._deliverableData.sections.empty();
            this._data.sections.each(function(sec){
                if (sec.selected) {
                    this._deliverableData.sections.push(sec);
                }
            }, this);

            if (this._deliverableData.sections.length == 0) {
                alert('You must include at least 1 section.');
                return;
            }

            // subject
            this._deliverableData.subject = this._subjectInput.getValue();

            // note 
            this._deliverableData.note = this._noteInput.getValue();

            // DO DELIVERY
            console.log('SEND DATA:', this._deliverableData);
            var tempMsg = 'SEND '+this._deliverableData.sections.length+' sections to ';
                tempMsg += this._deliverableData.recipients.length+' recipients.';
                tempMsg += '\n\n SUBJECT: '+this._deliverableData.subject;
                tempMsg += '\n\n NOTE: '+this._deliverableData.note;
            console.log(tempMsg);

            // simulate timing.
            (function(){
                this._sendButton.hideSpinner();
                this.fireEvent('send', this._deliverableData);
            }.bind(this)).delay(700);
        }.bind(this));
    }

    ,_build: function(){
        this.getContentContainer().adopt(
            new Element('div.Column.SectionsToInclude').adopt(
                new Element('h3', {html: 'Sections to include:'}).grab(
                    this._selectAllSectionsButton = new Precap.Button({
                        text: 'all'
                        ,size: 'Small'
                        ,onClick: function(e, button){
                            if (button.isActive()) {
                                button.deactivate();
                                this._deselectAllSections();
                            } else {
                                button.activate();
                                this._selectAllSections();
                            }
                        }.bind(this)
                    }).activate()
                )
                ,this._sectionsList = new Element('ul.SectionsToIncludeList')
            )
            ,new Element('div.Column.SendTo').adopt(
                new Element('h3', {html: 'Deliver to:'})
                ,new Element('div.Group').adopt(
                    new Element('h5.GroupHead', {html: 'People on this precap:'}).adopt(
                        this._selectAllContactsButton = new Precap.Button({
                            text: 'all'
                            ,size: 'Small'
                            ,onClick: function(e, button){
                                if (button.isActive()) {
                                    button.deactivate();
                                    this._deselectAllContacts();
                                } else {
                                    button.activate();
                                    this._selectAllContacts();
                                }
                            }.bind(this)
                        }).activate()
                    )
                    ,this._sendToList = new Element('ul.SendToList.Col1')
                )
                // HOLDING OFF ON CUSTOM RECIPIENTS FOR NOW. 12/16/13 -BD
                ,new Element('div.Group').adopt(
                    new Element('h5.GroupHead', {html:'Other Recipients:'})
                    ,this._customRecipientInput = new Precap.Input({
                        type: 'input'
                        ,placeholderText: 'name@domain.com'
                        ,buttons: [
                            new Precap.Button({
                                text: 'Add'
                                ,size: 'Medium'
                                ,className: 'Add'
                                ,onClick: function(e, button){
                                    var val = this._customRecipientInput.getValue();
                                    if (val) {
                                        this.addCustomRecipient(val);
                                    }
                                }.bind(this)
                            })
                        ]
                        ,keys: {
                            enter: function(){
                                var val = this._customRecipientInput.getValue();
                                if (val) {
                                    this.addCustomRecipient(val);
                                }
                                this._customRecipientInput.reset();
                            }.bind(this)
                        }
                    })
                    ,this._customSendToList = new Element('ul.SendToList.Col1')
                )
                ,new Element('div.Group').adopt(
                    new Element('h5.GroupHead', {html:'Subject:'})
                    ,this._subjectInput = new Precap.Input({
                        placeholderText: 'Type your message subject here'
                        ,value: 'Precap of '+this._data.name
                    })
                )
                ,new Element('div.Group').adopt(
                    new Element('h5.GroupHead', {html:'Additional Note:'})
                    ,this._noteInput = new Precap.Input({
                        placeholderText: 'Type a note to your recipients here'
                        ,type: 'textarea'
                        // ,value: ''
                    })
                )
            )
        );

        this._buildActionButtons();
        this.buildSectionsList();
        this.buildSendToList();
    }

    ,_buildActionButtons: function(){
        this.getHeader().grab(
            this._actionButtons = new Element('div.ActionButtons').adopt(
                this._sendButton = new Precap.Button({
                    text: 'Send'
                    ,className: 'Send'
                    ,active: true
                    ,size: 'Xlarge'
                    ,onClick: function(){
                        this.fireEvent('send:clicked');
                    }.bind(this)
                })
                ,this._previewButton = new Precap.Button({
                    text: 'Preview'
                    ,className: 'Preview'
                    ,size: 'Xlarge'
                    ,onClick: function(){
                        this.fireEvent('preview:clicked');
                    }.bind(this)
                })
            )
        );

        this._sendButton._getSpinnerOptions = function(){
            return {
                version: ''
                ,size: ''
                ,spinner: {
                    lines: 2
                    ,length: 0
                    ,width: 16
                    ,radius: 5
                    ,trail: 50
                    ,color: '#008CF8'
                    ,speed: 1.5
                    ,shadow: false
                }
                ,maskOpacity: 1
                ,maskColor: '#fff'
            };
        };
    }

    ,buildSectionsList: function(){
        this._sectionsList.empty();

        if (this._data.sections) {
            this._data.sections.each(function(sec){
                sec.selected = true;
                // TODO:
                var detail = (function(){
                    // figure out, per section... for now...
                    return 'Details go here.';
                })();

                sec.li = new Element('li.SectionLine', {
                    events: {
                        click: function(){
                            this.fireEvent('toggleSection', sec);
                        }.bind(this)
                    }
                }).adopt(
                    new Element('div.SelectionIndicator', {
                        html: 'v'
                        // ,events: {
                        //  click: function(){
                        //      this.fireEvent('toggleSection', sec);
                        //  }.bind(this)
                        // }
                    })
                    ,new Element('div.Icon', {html: 'x'})
                    ,new Element('div.SectionDetails').adopt(
                        new Element('div.Title', {html: sec.name})
                        ,new Element('div.Detail', {html: detail})
                    )
                );
                sec.li.addClass(sec.type);
                // TODO: need to figure out section selection caching here. 
                this._sectionsList.grab(sec.li);
            }, this);
        }
    }

    ,buildSendToList: function(){
        this._sendToList.empty();
        this._sendToCheckboxes = [];
        // build the full list...
        this._data.sections.each(function(sec){
            if (sec.type == 'Group') {
                if (sec.contacts && sec.contacts.length) {
                    sec.contacts.each(function(c){
                        this._sendToList.grab(
                            new Element('li', {
                                events: {
                                    click: function(){
                                        c.checkbox.toggle();
                                    }
                                }
                            }).adopt(
                                c.checkbox = new Precap.Checkbox({
                                    checked: true
                                    ,onToggle: function(checked){
                                        c.selected = checked;
                                        this._adjustAllButton();
                                    }.bind(this)
                                })
                                ,new Element('span', {html: c.firstName + ' ' + c.lastName})
                            )
                        );
                        this._sendToCheckboxes.push(c.checkbox);
                        c.selected = true;
                    }, this);
                }
            }
        }, this);
    }

    ,_adjustAllButton: function(){
        var allChecked = this._sendToCheckboxes.length;
        this._sendToCheckboxes.each(function(checkbox, index, array){
            if (checkbox.isChecked()) {
                allChecked--;
            }
        });
        if (allChecked == 0) {
            this._selectAllContactsButton.activate();
        } else {
            this._selectAllContactsButton.deactivate();
        }
    }

    ,addCustomRecipient: function(recipEmail){
        // for the custom list
        this._customSendToList.grab(
            new Element('li').adopt(
                new Precap.Button({
                    size: 'Icon'
                    ,icon: 'CloseX_S'
                    ,text: 'X'
                    ,onClick: function(){
                        console.log('REMOVE RECIP');
                    }
                })
                ,new Element('span', {html: recipEmail})
            )
        );
    }

    ,_selectAllContacts: function(){
        this._data.sections.each(function(section){
            if (section.type == 'Group') {
                section.contacts.each(function(contact){
                    contact.checkbox.check();
                    contact.selected = true;
                });
            }
        });
    }

    ,_deselectAllContacts: function(){
        this._data.sections.each(function(section){
            if (section.type == 'Group') {
                section.contacts.each(function(contact){
                    contact.checkbox.uncheck();
                    contact.selected = false;
                });
            }
        });
    }

    ,_selectAllSections: function(){
        this._data.sections.each(function(section){
            section.li.removeClass('Unselected');
            section.selected = true;
        });
    }

    ,_deselectAllSections: function(){
        this._data.sections.each(function(section){
            section.li.addClass('Unselected');
            section.selected = false;
        });
    }

    ,toElement: function(){
        return this._html;
    }
});
