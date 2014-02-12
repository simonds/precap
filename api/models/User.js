/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,

  attributes: {

    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true
    },

    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true
    },

    fullName: function() {
      return this.firstName + ' ' + this.lastName
    },

    password: {
      type: 'string',
      minLength: 6,
      required: true
    },

    email: {
      type: 'email',
      required: true
    },

    phone: {
      type: 'string'
    },
      
    address1: {
      type: 'string',
      required: true
    },

    address2: {
      type: 'string'
    },

    city: {
      type: 'string',
      required: true
    },

    state: {
      type: 'string',
      required: true
    },

    country: {
      type: 'string',
      defaultsTo: 'US'
    },

    zip: {
      type: 'regex',
      required: true,
      regex: '/(^\d{5}$)|(^\d{5}-\d{4}$)/'
    },

     toJSON: function(){
       var obj = this.toObject();
       delete obj.password;
       return obj;
     }
  },

  validation_messages: {
    firstName: {
      required: 'We need to know your first name.',
      maxLength: 'We\'re pretty sure nobody has ever had a first name over 50 characters long.'
    },
    lastName: {
      required: 'We need to know your last name.',
      maxLength: 'We\'re pretty sure nobody has ever had a last name over 50 characters long.'
    },
    email: {
      required: 'We need to know your email address.',
      type: 'This doesn\'t appear to be a properly formatted email address.'
    },
    password: {
      required: 'A password is required.',
      minLength: 'You need to use a password that is at least six characters long.'
    },
    address1: {
      required: 'We need to know your address.'
    },
    city: {
      required: 'We need to know your city.'
    },
    state: {
      required: 'We need to know your state.'
    },
    zip: {
      required: 'We need to know your zip code.',
      regex: 'This doesn\'t appear to be a valid US zip code.'
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return next(err);
      values.password = hash;
      next();
    });
  }

};
