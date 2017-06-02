/**
 * hasAccess
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */


module.exports = function hasAccessToUser (req, res, next) {

  var userId = req.session.user.id;
  var modelId = req.route.params['id'];

  if (!modelId) modelId = userId;

  //console.log('req.body', req.route);

  User.findOneById(modelId).done(function (err, user) {

  	//console.log('user.id = ', user.id);
  	//console.log('session.userId = ', userId);

    if (err) return next(err);

    if ( !user ) return res.forbidden();

    if (!_.isEqual(user.id, userId)) return res.forbidden();

    next();
  });
};