/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt'),
    crypto = require('crypto');

module.exports = {

  schema: true,

  attributes: {

    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true,
      defaultsTo: '-----'
    },

    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true,
      defaultsTo: '-----'
    },

    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    },

    userName: {
      type: 'string',
      minLength: 5,
      maxLength: 20,
      required: false
    },

    password: {
      type: 'string',
      minLength: 6,
      required: false
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
      required: true,
      defaultsTo: '-----'
    },

    address2: {
      type: 'string'
    },

    city: {
      type: 'string',
      required: true,
      defaultsTo: '-----'
    },

    state: {
      type: 'string',
      required: true,
      defaultsTo: '-----'
    },

    country: {
      type: 'string',
      defaultsTo: 'US'
    },

    zip: {
      type: 'regex',
      required: true,
      regex: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
      defaultsTo: '00000'
    },

    emailVerified: {
      type: 'boolean',
      defaultsTo: false
    },

    emailVerificationCode: {
      type: 'string'
    },

    loginAuthenticationCode: {
      type: 'string'
    },

    hasLoggedIn: {
      type: 'boolean',
      defaultsTo: false
    },

    isActive: {
      type: 'boolean',
      defaultsTo: true
    },

    isResettingPassword: {
      type: 'boolean',
      defaultsTo: false
    },

    toJSON: function(){
       var obj = this.toObject();
       delete obj.password;
       delete obj.emailVerified;
       delete obj.emailVerificationCode;
       delete obj.hasLoggedIn;
       delete obj.isActive;
       delete obj.isResettingPassword;
       delete obj.loginAuthenticationCode;
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
      //required: 'A password is required.',
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
      crypto.randomBytes(48, function(ex, buf) {
        values.emailVerificationCode = buf.toString('hex');
        next();
      });
    });
  },

  beforeUpdate: function(values, next) {
    if (values.password) {
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return next(err);
        values.password = hash;
        crypto.randomBytes(48, function(ex, buf) {
          values.emailVerificationCode = buf.toString('hex');
          next();
        });
      });      
    }
  }


};
