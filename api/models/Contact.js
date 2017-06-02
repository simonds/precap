/**
 * Contact
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true
    }

    ,lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      required: true
    }

    ,fullName: function() {
      return this.firstName + ' ' + this.lastName
    }

    ,email: {
      type: 'email',
      required: true
    }

    ,phone: {
      type: 'string'
    }

    ,userId: {
      type: 'string',
      required: true
    }

    ,toJSON: function(){
       var obj = this.toObject();
       delete obj.userId;
       return obj;
    }

  },

  validation_messages: {
    firstName: {
      required: 'We need to know your contact\'s first name.',
      maxLength: 'We\'re pretty sure nobody has ever had a first name over 50 characters long.'
    }
    ,lastName: {
      required: 'We need to know your contact\'s last name.',
      maxLength: 'We\'re pretty sure nobody has ever had a last name over 50 characters long.'
    }
    ,email: {
      required: 'We need to know your contact\'s email address.',
      type: 'This doesn\'t appear to be a properly formatted email address.'
    }
  }


};
