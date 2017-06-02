App.ContactChooserController = Ember.ArrayController.extend({
    contacts: function() {
        return this.store.findAll('contact').then(function(data){
            return data;
        }, function(reason) {
            console.log("Couldn't get the answer! Reason: ", reason);
        });
    }
});

App.ContactChooserView = Ember.View.extend({
    classNames: ['ContactChooser']
    ,tabindex: '-1'
    ,style: 'top: 30px;'
    ,templateName: '_contactchooser'
    ,didInsertElement: function() {
        this.activateTypeahead();
    }
    ,activateTypeahead: function() {
        var controller = this.get('controller')
            ,_this = this;
        controller.contacts().then(function(contacts) {
            var contactsArray = contacts.toArray();
            var contactsJson = [];
            for (var i = 0; i < contactsArray.length; i++){
                contactsJson.pushObject(contactsArray[i]._data);
            }
/*
            var contactsSource = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('firstName', 'lastName', 'email'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                // `states` is an array of state names defined in "The Basics"
                local: $.map(contactsJson, function(contact) { return { value: contact }; })
            });
            contactsSource.initialize();
*/
            _this.$().find('.typeahead').typeahead(null, {
                name: 'contact',
                displayKey: 'value',
                source: function(query, process) {
                    //var contacts = [],
                    //    map = {};
                    //$.each(contactsJson, function (i, contact) {
                    //    map[contact.firstName] = contact;
                    //    contacts.push(contact.firstName);
                    //});

                    //return process(contacts);

                    //var results = contactsJson.map(function(contact) {
                    //    return contact.firstName;
                    //});
                    return process(contactsJson);
                },
                valueKey: 'firstName',
                highlight: true,
                minLength: 2,
                templates: {
                    empty: [
                       '<div class="empty-message">',
                        'unable to find any contacts that match',
                        '</div>'
                    ].join('\n'),
                    //suggestion: Handlebars.compile('<p><strong>{{value}}</strong> – {{year}}</p>')
                    //suggestion: Handlebars.compile('<div class="Avatar">&#160;</div><span class="Name fn n"><span data-bind="firstName">{{firstName}}</span> <span data-bind="lastName">{{lastName}}</span> </span> <span class="Email"><a class="email" data-bind="email">{{email}}</a></span> <span class="Phone tel" data-bind="phone">{{phone}}</span>')
                }
            });

        });

    }
});

