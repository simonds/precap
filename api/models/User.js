/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
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

  	password: {
      type: 'string',
      minLength: 6,
      required: true,
    },

  	email: {
  		type: 'email',
  		required: true
  	},

  	phone: {
  		type: 'STRING',
      	defaultsTo: '111-222-3333'
  	},
      
     toJSON: function(){
       var obj = this.toObject();
       delete obj.password;
       return obj;
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
