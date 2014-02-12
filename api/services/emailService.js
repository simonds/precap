var mandrill = require('mandrill-api/mandrill');

module.exports = {

    send: function(message, result) {
        var _message = {
            "html": message.html,
            "text": message.text,
            "subject": message.subject,
            "from_email": "no-reply@precap.net",
            "from_name": "Precap",
            "to": [{
                    "email": message.to.email,
                    "name": message.to.name,
                    "type": "to"
                }],
            "headers": {
                "Reply-To": "no-reply@precap.net"
            },
            "important": false,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": true,
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null
        };
        var precapConf = sails.config.precapConf;
        if (precapConf.debug) {
            _message.to = precapConf.testEmail;
        };
        var mandrill_client = new mandrill.Mandrill(precapConf.mandrilApiKey);
        mandrill_client.messages.send({"message": _message, "async": false}, function(_result) {
            result = _result;
        }, function(e) {
            result = e;
        });

        return result;
    },

    sendTemplate: function(message, result) {
        var _message = {
            "subject": message.subject,
            "from_email": "no-reply@precap.net",
            "from_name": "Precap",
            "to": [{
                    "email": message.to.email,
                    "name": message.to.name,
                    "type": "to"
                }],
            "headers": {
                "Reply-To": "no-reply@precap.net"
            },
            "important": false,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": true,
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null
        };
        var precapConf = sails.config.precapConf;
        if (precapConf.debug) {
            _message.to = precapConf.testEmail;
        };
        var mandrill_client = new mandrill.Mandrill(precapConf.mandrilApiKey);
        mandrill_client.messages.sendTemplate({"template_name": message.template_name, "template_content": message.template_content, "message": _message, "async": false}, function(_result) {
            result = _result;
        }, function(e) {
            result = e;
        });

        return result;
    },

    sendTest: function() {
        var message = {
            "html": "<p>Example HTML content</p>",
            "text": "Example text content",
            "subject": "example subject",
            "to": {
                    "email": "marksimonds@gmail.com",
                    "name": "Mark Simonds",
                }
        };
        this.send(message, function(result) {
            console.log(result);
            return result;
        });
    },

    sendTemplateTest: function() {
        var message = {
            "subject": "example subject",
            "to": {
                    "email": "marksimonds@gmail.com",
                    "name": "Mark Simonds",
            },
            "template_name": "welcome-email",
            "template_content": [
                {
                    "name": "header",
                    "content": "<h1>Welcome to Precap</h1>"
                },
                {
                    "name": "main",
                    "content": "<p>Mark, welcome to Precap. We think you will like it.</p><p><a href=\"http://10.10.10.10:5000/\">visit Precap</a></p>"
                }
            ]
        };
        this.sendTemplate(message, function(result) {
            console.log(result);
            return result;
        });
    },

    sendWelcome: function(req, user) {
        var fullURL = req.protocol + "://" + req.get('host');
        var message = {
            "subject": "example subject",
            "to": {
                    "email": user.email,
                    "name": user.fullName,
            },
            "template_name": "welcome-email",
            "template_content": [
                {
                    "name": "header",
                    "content": "<h1>Welcome to Precap</h1>"
                },
                {
                    "name": "main",
                    "content": "<p>" + user.firstName + ", welcome to Precap. We think you will like it.</p><p><a href=\"" + fullURL + "/\">visit Precap</a></p>"
                }
            ]
        };
        this.sendTemplate(message, function(result) {
            console.log(result);
            return result;
        });

    }

};