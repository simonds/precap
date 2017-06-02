/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access) 
    '*': 'authenticated',

    'user': {
        index: ['authenticated', 'hasAccessToUser'],
        find: ['authenticated', 'hasAccessToUser'],
        create: true,
        update: ['authenticated', 'hasAccessToUser'],
        destroy: ['authenticated', 'hasAccessToUser']
    },

    'precap': {
        view: ['authenticated'],
        index: ['authenticated', 'hasAccessToPrecap'],
        find: ['authenticated', 'hasAccessToPrecap'],
        create: ['authenticated'],
        update: ['authenticated', 'hasAccessToPrecap'],
        destroy: ['authenticated', 'hasAccessToPrecap']
    },

    'contact': {
        view: true,
        index: ['authenticated', 'hasAccessToContact'],
        find: ['authenticated', 'hasAccessToContact'],
        create: ['authenticated'],
        update: ['authenticated', 'hasAccessToContact'],
        destroy: ['authenticated', 'hasAccessToContact']
    },

    'auth': {
        '*': true
    },


  /*
    // Here's an example of adding some policies to a controller
    RabbitController: {

        // Apply the `false` policy as the default for all of RabbitController's actions
        // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
        '*': false,

        // For the action `nurture`, apply the 'isRabbitMother' policy 
        // (this overrides `false` above)
        nurture : 'isRabbitMother',

        // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
        // before letting any users feed our rabbits
        feed : ['isNiceToAnimals', 'hasRabbitFood']
    }
    */
};
