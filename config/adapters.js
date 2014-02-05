module.exports.adapters = {
  'default': 'mongo',

  // sails v.0.9.0
  mongo: {
    module   : 'sails-mongo',
    //host     : 'localhost',
    //port     : 27017,
    //user     : 'username',
    //password : 'password',
    //database : 'precap',
    //url      : 'mongodb://localhost:27017/precap'
    url      : 'mongodb://precap:g3tprecapped@ds061268.mongolab.com:61268/heroku_app20825683'
  }

/*
    // OR
    module   : 'sails-mongo',
    url      : 'mongodb://USER:PASSWORD@HOST:PORT/DB',

    // Replica Set (optional)
    replSet: {
      servers: [
        {
          host: 'secondary1.localhost',
          port: 27017 // Will override port from default config (optional)
        },
        {
          host: 'secondary2.localhost',
          port: 27017
        }
      ],
      options: {} // See http://mongodb.github.io/node-mongodb-native/api-generated/replset.html (optional)
    }
  }

  // sails v.0.8.x
  mongo: {
    module   : 'sails-mongo',
    url      : 'mongodb://USER:PASSWORD@HOST:PORT/DB'
  }
*/

};