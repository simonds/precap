var stripe = require("stripe");

module.exports.stripeService = {
/*
    _monthlySubscriptionID = precapConf.stripe.monthlySubscriptionID,
    _yearlySubscriptionID = precapConf.stripe.yearlySubscriptionID,
    _monthlyWithFreeTrialSubscriptionID = precapConf.stripe.monthlyWithFreeTrialSubscriptionID,
    _yearlyWithFreeTrialSubscriptionID = precapConf.stripe.yearlyWithFreeTrialSubscriptionID,
*/
    _setup: function() {
        if (precapConf.production) {
            stripe.setApiKey(precapConf.stripe.productionApiKey.secret);
        } else {
            stripe.setApiKey(precapConf.stripe.testApiKey.secret);
        };
    },

    startSubscription: function(user, plan) {
        this._setup();
        stripe.customers.createSubscription(
            "cus_3VkOBzQlqeRlDF",
            {plan: "foo"},
            function(err, subscription) {
                return {
                    err: err, 
                    subscription: subscription };
            }
        );
    },

    updateSubscription: function(user, plan) {

    },

    cancelSubscription: function(user, plan) {

    },

    addCard: function(user, card) {

    },

    updateCard: function(user, card) {

    },

    deleteCard: function(user, card) {

    },

    getCard: function(user) {

    },

    addCustomer: function(user, plan) { // returns err, customer
        stripe.customers.create({
            description: 'Customer for test@example.com',
            card: "tok_3VkOSkcY2MmulT", // obtained with Stripe.js
            plan: ""
            }, function(err, customer) {
                return {
                    err: err, 
                    subscription: subscription };
        });
    },

    updateCustomer: function(user) {

    },

    deleteCustomer: function(user) {

    },

    getInvoices: function(user) {

    },

    getInvoice: function(invoice) {

    },

};