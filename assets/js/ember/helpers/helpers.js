
/***************************

██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

***************************/

Ember.TextSupport.reopen({
    attributeBindings: ['required']
});

Ember.View.reopen({
    init: function() {
        this._super();
        var self = this;

        // bind attributes beginning with 'data-'
        Ember.keys(this).forEach(function(key) {
            if (key.substr(0, 5) === 'data-') {
                self.get('attributeBindings').pushObject(key);
            }
        });
    }
});

Ember.Handlebars.registerHelper('ifEq', function(val1, val2, options) {
   return (this.get(val1) == val2) ? options.fn(this) : options.inverse(this);
});

Ember.Handlebars.registerHelper('ifType', function (value, options) {
    return (this.type == value) ? options.fn(this) : options.inverse(this);
});

Ember.Handlebars.registerBoundHelper('formattedDate', function(value) {
  return moment(value).format('LL');
});

Ember.Handlebars.registerBoundHelper('fullFormattedDate', function(value) {
    return moment(value).format('LLLL');
});

Ember.Handlebars.registerBoundHelper('formattedTime', function(value) {
  return moment(value).format('LT');
});


moment.lang('en', {
    longDateFormat : {
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM Do, YYYY",
        LLL: "MMMM Do YYYY LT",
        LLLL: "dddd, MMMM Do YYYY",
    }
});

var _currentBsheetId = null;
var _bSheetsLoaded = -1;

var _animateIntoBSheet = function(bsheet, done) {
    if (_bSheetsLoaded < 1) {
        var target = bsheet.children('.BSheetContainer')[0];
        $('body').scrollTo(target, {
            animateOptions: {
                duration: 600
                ,easing: 'easeOutExpo'
            }
            ,direction: 'Left'
        }, done);
    }
    _currentBsheetId = bsheet.context.id;
};

var _animateOutBSheet = function(bsheet, done) {
    if (_bSheetsLoaded >= 1) {
        done();
        bsheet.fadeTo(500, 0); // leaving this even though it doesn't get "seen"... it's holding a place for the new bSheet view for the duration of the effect.
    } else {
        var target = bsheet.find('.BSheet')[0];
        $(target).animate({left: 200}, {
            duration: 340
            ,easing: 'easeInBack'
            ,complete: function(){
                $('body').scrollTo(0, {
                    direction: 'Left'
                    ,animateOptions: {
                        duration: 600
                        ,easing: 'easeOutExpo'
                    }
                }, done);
            }
        });
    }
    _bSheetsLoaded = _bSheetsLoaded-1;
    // _currentBsheetId = bsheet.context.id;
};

var _loadingSpinner;
function displayLoadingSpinner() {
    _loadingSpinner = _loadingSpinner || new Spinner({
        lines: 2
        ,length: 0
        ,width: 30
        ,radius: 9
        ,corners: 1
        ,rotate: 0
        ,direction: 1
        ,color: '#fff'
        ,speed: 1.5
        ,trail: 50
        ,shadow: false
        ,hwaccel: false
        ,className: 'spinner'
        ,top: 'auto'
        ,left: 'auto'

    });

    _loadingSpinner.spin($('body div.container'));
};

function hideLoadingSpinner(){
    if (_loadingSpinner) _loadingSpinner.stop();
};

function playSound(which){
    this._howler.urls([this._soundMap[which]]);
    this._howler.play();
};

function toggleBodyMask(direction) {
    var bodyMask = $('#BodyMask');
    if (direction.toLowerCase() === 'in') {
        bodyMask.show();
        bodyMask.fadeTo({
            opacity: 0.6
            ,duration: 140
        });
    } else {
        bodyMask.fadeOut({
            duration: 140
        });
        bodyMask.hide();

    }
}

/*
    // Sounds
this._howler = new Howl({
    urls:[]
});
this._soundMap = {
    swipe: '/sounds/glossy_click_26.mp3'
};
*/

function getFileExt(filename) {
    var re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}