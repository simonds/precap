module.exports.routes = {
    'get /': {
        controller: 'AuthController',
        action: 'login'
    }

    ,'get /precap': {
        controller: 'PrecapController'
        ,action: 'index'
    }

    ,'get /user': {
        controller: 'UserController'
        ,action: 'index'
    }

    ,'get /mailtest': {
        controller: 'UserController',
        action: 'mailTest'
    }

    ,'get /view': {
        controller: 'PrecapController',
        action: 'findFirst'
    }

    ,'get /view/:id': {
        controller: 'PrecapController',
        action: 'view'
    }

    ,'get /ember': {
        controller: 'PrecapController',
        action: 'findFirstEmber'
    }

    ,'get /ember/:id': {
        controller: 'PrecapController',
        action: 'viewEmber',
        cors: true
    }

    ,'get /ember/:id/:action': {
        controller: 'PrecapController',
        action: 'viewEmber',
        cors: true
    }

    ,'get /signup': {
        controller: 'UserController',
        action: 'signup'
    }

    ,'post /signup': {
        controller: 'UserController',
        action: 'create'
    }

    ,'get /user/checkemail': {
        controller: 'UserController',
        action: 'checkEmail'
    }

    ,'get /verify/:verificationCode': {
        controller: 'AuthController',
        action: 'verify'
    }

    ,'get /login': {
        controller: 'AuthController',
        action: 'login'
    }

    ,'post /login': {
        controller: 'AuthController',
        action: 'process'
    }

    ,'get /logout': {
        controller: 'AuthController',
        action: 'logout'
    }

    ,'get /forgot': {
        controller: 'UserController',
        action: 'forgot'
    }

    ,'post /forgot': {
        controller: 'AuthController',
        action: 'sendPasswordReset'
    }

    ,'get /reset/:verificationCode' : {
        controller: 'AuthController',
        action: 'showPasswordReset'
    }

    ,'post /reset' : {
        controller: 'AuthController',
        action: 'resetPassword'
    }

    ,'get /profile': {
        controller: 'UserController',
        action: 'profile'
    }

    ,'post /profile': {
        controller: 'UserController',
        action: 'update'
    }

    ,'get /home': {
        view: 'home'
    }

    ,'get /sandbox': {
         view: 'sandbox'
     }
};
