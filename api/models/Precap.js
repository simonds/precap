/**
 * Precap
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name: {
            type: 'string',
            maxLength: 100,
            required: true
        },
        description: {
            type: 'string',
            maxLength: 255,
            required: false
        },
        userId: {
            type: 'string',
            required: true
        },
        publicUrl: {
            type: 'string',
            maxLength: 100,
            required: false
        },
        url: {
            type: 'string',
            maxLength: 100,
            required: false
        },
        _version: {
            type: 'integer',
            min: 1,
            required: false
        },
        sections: {
            type: 'json',
            required: false
        },
        saved: {
            type: 'boolean',
            defaultsTo: true,
            required: false
        }

    },

    beforeCreate: function(values, next) {
        if (values.sections) values.sections = JSON.parse(values.sections);
        next();
    },

    beforeUpdate: function(values, next) {
        if (values.sections) {
            //console.log(values.sections);
            try {
                values.sections = JSON.parse(values.sections);
            } catch (e) {
                //console.log("not JSON, so we'll skip parsing it.");
            }
        }
        values.saved = true;
        next();
    }

};
