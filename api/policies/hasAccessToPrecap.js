/**
 * hasAccess
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */


module.exports = function hasAccessToPrecap (req, res, next) {

  var userId = req.session.user.id;
  var precapId = req.route.params['id'];

  //console.log('req.body', req.route);

  if (!precapId) {
    Precap.findOneByUserId(userId).done(function (err, precap) {

      //console.log('precap.userId = ', precap.userId);
      //console.log('session.userId = ', userId);

      if (err) return next(err);

      if ( !precap ) return res.forbidden();

      if (!_.isEqual(precap.userId, userId)) return res.forbidden();

      next();
    });
  } else {
    Precap.findOneById(precapId).done(function (err, precap) {

      //console.log('precap.userId = ', precap.userId);
      //console.log('session.userId = ', userId);

      if (err) return next(err);

      if ( !precap ) return res.forbidden();

      if (!_.isEqual(precap.userId, userId)) return res.forbidden();

      next();
    });    
  }

};