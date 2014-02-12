module.exports.routes = {

  'get /mailtest': {
      controller: 'UserController',
      action: 'mailTest'
  },

  'get /': {
    controller: 'PrecapController',
    action: 'view'
  },

  'get /signup': {
    controller: 'UserController',
    action: 'signup'
  },

  'post /signup': {
    controller: 'UserController',
    action: 'create'
  },

  'get /user/checkemail': {
    controller: 'UserController',
    action: 'checkEmail'
  },

  'get /login': {
    controller: 'AuthController',
    action: 'login'
  },

  'post /login': {
    controller: 'AuthController',
    action: 'process'
  },

  'get /logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  'get /*(^.*)': {
    controller: 'UserController',
    action: 'profile'
  },

};
