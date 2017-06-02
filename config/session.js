/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.session = {

  // Session secret is automatically generated when your new app is created
  // Replace at your own risk in production-- you will invalidate the cookies of your users,
  // forcing them to log in again. 
  secret: '5ec4105be23c4ba43162fc5bf0c1f54e',


  // Uncomment the following lines to use your Mongo adapter as a session store
  //adapter: 'mongo',
  //url: 'mongodb://precap:g3tprecapped@ds033469.mongolab.com:33469/af_precap-staging-marksimonds/sessions',
  // auto_reconnect: false,
  // ssl: false,
  // stringify: true

};
