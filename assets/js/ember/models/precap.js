App.Precap = DS.Model.extend({
    name: DS.attr('string')
    ,description: DS.attr('string')
    ,userId: DS.attr('string')
    ,publicUrl: DS.attr('string')
    ,url: DS.attr('string')
    ,sections: DS.attr('raw')
    ,date: DS.attr('date')
    ,createdAt: DS.attr('string')
    ,updatedAt: DS.attr('string')
    ,saved: DS.attr('boolean')
    ,didLoad: function () {
        //console.log('Precap model loaded', this);
    }
});