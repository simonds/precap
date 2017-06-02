App.User = DS.Model.extend({
    firstName: DS.attr('string')
    ,lastName: DS.attr('string')
    ,email: DS.attr('string')
    ,password: DS.attr('string')
    ,address1: DS.attr('string')
    ,address2: DS.attr('string')
    ,city: DS.attr('string')
    ,state: DS.attr('string')
    ,country: DS.attr('string')
    ,zip: DS.attr('string')
    ,createdAt: DS.attr('string')
    ,updatedAt: DS.attr('string')
});
