App.Contact = DS.Model.extend({
    firstName: DS.attr('string')
    ,lastName: DS.attr('string')
    ,email: DS.attr('string')
    ,phone: DS.attr('string')
    ,createdAt: DS.attr('string')
    ,updatedAt: DS.attr('string')
    ,saved: DS.attr('boolean')
});
