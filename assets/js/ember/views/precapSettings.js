App.PrecapSettingsView = Ember.View.extend({
    animateIn : function (done) {
        _animateIntoBSheet(this.$(), done);
    }
    ,animateOut : function (done) {
        console.log(_bSheetsLoaded);
        _animateOutBSheet(this.$(), done);
    }
    ,didInsertElement: function() {
        $("#settingsForm").validate({
            onfocusout: true,
            focusInvalid: true,
            validClass: "has-success",
            errorClass: "has-error",
            errorElement: "small",
            errorPlacement: function(error, element) {
                // if the input has a prepend or append element, put the validation msg after the parent div
                if(element.parent().hasClass('input-prepend') || element.parent().hasClass('input-append')) {
                    error.insertAfter(element.parent());
                // else just place the validation message immediatly after the input
                } else {
                    error.insertAfter(element);
                }
            },
            highlight: function(element, errorClass, validClass) {
                $(element).parent().addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).parent().removeClass(errorClass).addClass(validClass);
            },
            rules: {
                zip: {
                    pattern: /(^\d{5}$)|(^\d{5}-\d{4}$)/
                },
                passwordConfirm: {
                    equalTo: "#password"
                }
            },

            messages: {
                firstName: {
                  maxlength: 'We\'re pretty sure nobody has ever had a first name over 50 characters long.'
                },
                lastName: {
                  maxlength: 'We\'re pretty sure nobody has ever had a last name over 50 characters long.'
                },
                password: {
                  maxlength: 'You need to use a password that is at least six characters long.'
                },
                passwordConfirm: {
                    equalTo: "Both passwords must match."
                },
                email: {
                    email: "This doesn't appear to be a properly formatted email address.",
                    remote: "This email address is already in use."
                },
                zip: {
                    pattern: "This doesn't appear to be a valid US zip code."
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });
    }
});
