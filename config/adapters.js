var production = {
  'default': 'mongo',
  mongo: {
    module: 'sails-mongo',
    url: "mongodb://precap:g3tprecapped@ds061268.mongolab.com:61268/heroku_app20825683",
    schema: true
  }
};

var staging = {
  'default': 'mongo',
  mongo: {
    module: 'sails-mongo',
    url: "mongodb://heroku_app20825683:g0tprecapped@ds061268.mlab.com:61268/heroku_app20825683",
    schema: true
  }
};

var development = {
  'default': 'mongo',
  mongo: {
    module: 'sails-mongo',
    url: "mongodb://precap:g3tprecapped@ds033469.mongolab.com:33469/af_precap-staging-marksimonds",
    schema: true
  }
/*
  'default': 'disk',
  disk: {
    module: 'sails-disk'
  }
*/
};

var setAdapter = function() {
  var env = process.env.NODE_ENV;

  if (env === 'production') {
    return production;
  } else if (env === 'staging') {
    return staging;
  } else {
    return development;
  }
};

var adapters = setAdapter();

module.exports.adapters = adapters;
