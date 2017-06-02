App.PrecapContactGroupController = Ember.ObjectController.extend({
    needs: ['precap']

    ,activateTypeahead: function() {
        $().typeahead(null, {
            name: 'contact',
            displayKey: 'value',
            source: this.model,
            templates: {
                empty: [
                   '<div class="empty-message">',
                    'unable to find any contacts that match',
                    '</div>'
                ].join('\n'),
                //suggestion: Handlebars.compile('<p><strong>{{value}}</strong> – {{year}}</p>')
                suggestion: Handlebars.compile('<div class="Avatar">&#160;</div><span class="Name fn n"><span data-bind="firstName">{{firstName}}</span> <span data-bind="lastName">{{lastName}}</span> </span> <span class="Email"><a class="email" data-bind="email">{{email}}</a></span> <span class="Phone tel" data-bind="phone">{{phone}}</span>')
            }
        });
    }.property('typeahead')
    ,actions: {
        // addContact: function(items) {
        //     if (items) {
        //         items.addObject(window._defaults.listItem);
        //     } else {
        //         console.log('Need to get items array.');
        //         //this.items.addObject(window._defaults.listItem);
        //     }
        // }
        openContactChooser: function(view){
            console.log('show contact chooser.');
            var _this = this;
            this.store.findAll('contact').then(function(data){
                //_this.set('model', data);
                var contactsView = Ember.View.create({
                    templateName: '_contactchooser'
                    ,context: data
                });
                view.pushObject(contactsView).then(function(){
                    _this.activateTypeahead();
                });
                //var controller = _this.get('controllers.precap');
                //controller.set('contactchooserToRender', 'contactchooser');
                //_this.set('typeahead', '.ContactChooser .typeahead');
            });
        }
        ,closeContactChooser: function(){
            this.get('controllers.precap').set('contactchooserToRender', null);
        }
        ,toggleListItemChecked: function(item) {
            Ember.set(item, 'completed', item.completed ? false: true);
            this.controllerFor('precap').send('makeDirty');
        }
    }

 //   socket.get('/user', function (response) {
      // response contains a list of all users
  //  })

});
