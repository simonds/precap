module.exports.precapConf = {
    debug: true
    ,production: false

    ,testEmail: [{
        "email": "marksimonds@gmail.com"
        ,"name": "Mark Simonds"
        ,"type": "to"
    }]

    ,models: {
        User: {
            defaultLimit: 10
        }
        ,Precap: {
            defaultLimit: 10
        }
        ,Contact: {
            defaultLimit: 20
        }
    }

    ,mandrilApiKey: 'iF-QGOcwVHc5k139pwJYsw'
    ,googleAnalyticsKey: ''
    ,stripe: {
        testApiKey: {
            secret: '7dSuWshk0DBL5GWwhfqOuNqQIDdpQB2W'
            ,public: 'pk_ROJZHfbwcJyMwUIrutTvWAH1PNWjs'
        }
        ,productionApiKey: {
            secret: 'HfdAjTwzkaVyiems3nqXHk1jcfhSvv7l'
            ,public: 'pk_PyYFcbTvfS5Lmosq7coXI8N1djG1S'
        }
        ,monthlySubscriptionID: "precap-monthly-notrial"
        ,yearlySubscriptionID: "precap-yearly-notrial"
        ,monthlyWithFreeTrialSubscriptionID: "precap-monthly-30daytrial"
        ,yearlyWithFreeTrialSubscriptionID: "precap-yearly-30daytrial"
    },


};
