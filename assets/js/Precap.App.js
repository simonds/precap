var Precap = Precap || {};

Precap.App = new Class({

    Implements: [Options,Events]

    ,options: {
        // user: null // [object]
        // onReady: function() {}
    }

    ,initialize: function(userId, options){
        this.setOptions(options);
        this._documentBody = $$('body')[0];
        this._documentBody.setProperty('spellcheck', 'false');

        this._buildFraming();
        this.showLoadingSpinner();

        this.setup();
        this._data = {};

        // Get the data and fire it up.
        this.getUserData(userId, function(userJSON, err){
            if (userJSON) this._data.user = userJSON;
            if (err) {
                console.error(err);
                return;
            }
            this.getDocuments(function(documentsJSON, err){
                if (err) {
                    console.error(err);
                } else {
                    this._prepDocumentsData(documentsJSON);

                    this.loadDocument(this._data.documents[0]);

                    this.hideLoadingSpinner();

                    this.fireEvent('ready', this);

                    return precap = this;
                }
            }.bind(this));
        }.bind(this));
    }



    // Setup
    ,setup: function(){
        this._setupToolbar();
        this._setupEvents();
        this._setupFx();
    }

    ,_setupEvents: function() {
        this.addEvent('document:loaded', function(){
            this._document.loadMaps();
        });

        // Toolbar events
        this._toolbar.addEvent('send', function(button){
            if (!button.isActive()) {
                button.activate();
                this.loadSendView();
            } else {
                this.viewBSheet();
            }
        }.bind(this));
        this._toolbar.addEvent('newPrecap', function(){
            console.log('newPrecap')
        });
        this._toolbar.addEvent('myPrecaps', function(button){
            if (!button.isActive()) {
                button.activate();
                this.loadMyPrecapsView();
            } else {
                this.viewBSheet();
            }
        }.bind(this));
        this._toolbar.addEvent('directory', function(){
            console.log('directory')
        });
        this._toolbar.addEvent('settings', function(){
            console.log('settings')
        });

        // BSheet Events
        this.addEvent('bSheetUnloaded', function(){
            this._cleanupBSheet();
        }.bind(this));
    }

    ,_setupFx: function(){
        // Setup The body scrolling fx
        this._bSheetLoadFx = this._bSheetLoadFx || new Fx.Scroll(this._documentBody, {
            duration: 600
            ,wheelStops: false
            ,fps: 40
            ,transition: Fx.Transitions.Expo.easeOut
        });
        this._bSheetUnloadFx = this._bSheetUnloadFx || new Fx.Scroll(this._documentBody, {
            duration: 600
            ,wheelStops: false
            ,fps: 40
            ,transition: Fx.Transitions.Expo.easeOut
            ,onComplete: function(){
                this.fireEvent('bSheetUnloaded');
            }.bind(this)
        });

        // Body Mask
        this._bodyMaskFx = new Fx.Tween(this._bodyMask, {
            duration: 140
            ,property: 'opacity'
            ,onComplete: function() {
                this.fireEvent('bodyMask:complete', [this._bodyMask.isVisible(), this], 50);
            }.bind(this)
        });

        // Sounds
        this._howler = new Howl({
            urls:[]
        });
        this._soundMap = {
            swipe: '/sounds/glossy_click_26.mp3'
        };
    }

    ,_buildFraming: function() {
        this._canvas = new Element('div.Canvas').adopt(
            new Element('div.PrecapLogo', {html: "Precap"})
        );

        this._documentBody.adopt(
            this._canvas
            ,this._bodyMask = new Element('div#BodyMask').fade('hide')
        );
    }

    ,_setupToolbar: function(){
        this._toolbar = new Precap.Toolbar();

        this._canvas.adopt(
            this._toolbar.toElement()
        );
    }



    // DATA
    ,_prepDocumentsData: function(documentsJSON){
        // store the new documentsJSON in our main _data property
        this._data.documents = documentsJSON;
        // decode the JSON section data
        this._data.documents.each(function(doc){
            doc.sections = JSON.decode(doc.sections);
        });
    }

    ,_prepDocumentData: function(docData){
        doc.sections = JSON.decode(doc.sections);
    }

    ,getUserData: function(userId, callback){
        if (userId) {
            this._userDataRequest = new Request.JSON({
                method: 'get'
                ,url: '/user?id='+userId
                ,onSuccess: function(userJSON){
                    if (callback) callback.call(this, userJSON);
                }.bind(this)
                ,onError: function(r){
                    console.error(r);
                }
            }).send();
        } else {
            return this._data.user;
        }

        return this;
    }

    ,getDocuments: function(callback){
        this._userDocumentsRequest = new Request.JSON({
            method: 'get'
            ,url: '/precap'
            ,noCache: false
            ,data: {userId: this._data.user.id}
            ,onSuccess: function(responseJSON){
                callback.call(this, responseJSON);
            }.bind(this)
            ,onError: function(err){
                callback.call(this, null, err);
            }
        }).send();

        return this;
    }



    // Documents
    ,_createDocument: function(docData){
        var doc = new Precap.Document(docData);
        return doc;
    }

    ,loadDocument: function(docData) {
        this._document = this._createDocument(docData);
        this._canvas.grab(this._document.toElement());

        this.fireEvent('document:loaded', this);
        return this;
    }

    ,getDocument: function(returnAsElement) {
        return returnAsElement ? this._document.toElement() : this._document;
    }

    ,swapDocument: function(newDoc){
        var oldDoc = this.getDocument(1);
        var newPrecapDoc = this._createDocument(newDoc);
        var newDocEl = newPrecapDoc.toElement();
        var windowCoords = window.getCoordinates();
        newDocEl.setStyle('margin-top', windowCoords.height+100);

        var addFx = new Fx.Morph(newDocEl, {
            duration: 300
            // ,fps: 40
            ,transition: Fx.Transitions.Back.easeOut
            ,onComplete: function(){
                this._document = newPrecapDoc;
            }.bind(this)
        });

        var killDocFx = new Fx.Morph(oldDoc, {
            duration: 200
            ,fps: 35
            // ,transition: Fx.Transitions.Back
            ,onComplete: function(){
                oldDoc.grab(newDocEl, 'before').destroy();
            }.bind(this)
        });

        killDocFx.start({
            left: -1000
            ,opacity: 0
        }).chain(
            function(){
                addFx.start({'margin-top': 48}).chain(function(){
                    this.closeBSheet(1);
                    this._document.loadMaps();
                }.bind(this));
                // (function(){
                //     this.closeBSheet(1);
                // }.bind(this)).delay(100);
            }.bind(this)
        );
    }


    // BSheets
    ,_prepBSheet: function(){
        var docCoords = this.getDocument().toElement().getCoordinates();
        var toolbarCoords = this._toolbar.toElement().getCoordinates();

        this._canvas.grab(
            this._bSheetContainer = new Element('div.BSheetContainer', {
                styles: {'margin-left': docCoords.width + toolbarCoords.width + 30}
            }).grab(
                this._currentBSheet.toElement()
            )
        );
    }

    ,viewBSheet: function(noFx){
        if (noFx) {
            this._bSheetLoadFx.set(1000, 0);
        } else {
            this._bSheetLoadFx.start(1000, 0);
        }
        this._bSheetActive = true;
    }

    ,closeBSheet: function(weAreBouncey){
        var bsheetCont = this._currentBSheet.toElement();

        var morphStyles = { opacity:0 };
        if (weAreBouncey) morphStyles.left = [0,200];

        var closeMorph = new Fx.Morph(bsheetCont, {
            duration: 340
            ,transition: Fx.Transitions.Back.easeIn
            ,onComplete: function(){
                this._bSheetUnloadFx.start(0, 0);
                this._bSheetActive = false;
            }.bind(this)
        });

        closeMorph.start(morphStyles);
    }

    ,_cleanupBSheet: function(){
        this._currentBSheet.toElement().destroy();
        this._bSheetContainer.destroy();
        delete this._currentBSheet;
        if (this._sendView) delete this._sendView;
        if (this._myPrecapsView) delete this._myPrecapsView;
        if (this._settingsView) delete this._settingsView;
        // this._bSheetContainer.destroy();
        this._toolbar.getButtons().each(function(b){
            b.deactivate();
        });
    }

    ,getBSheet: function(returnElement){
        var i;
        if (returnElement) {
            i = this._currentBSheet.toElement();
        } else {
            i = this._currentBSheet;
        }
        return i;
    }

    ,getSendView: function(){
        this._sendView = this._sendView || new Precap.Send(this.getDocument(), {
            onClose: function(){
                this.closeBSheet(1);
            }.bind(this)
            ,onSend: function(){
                (function(){
                    this.playSound('swipe');
                }.bind(this)).delay(200);
                this.closeBSheet(1);
            }.bind(this)
        });
        return this._sendView;
    }

    ,getMyPrecapsView: function(){
        this._myPrecapsView = this._myPrecapsView || new Precap.DocumentChooser({
            data: this._data.documents
            ,onSelection: function(doc){
                this.swapDocument(doc);
            }.bind(this)
            ,onClose: function(){
                this.closeBSheet(1);
            }.bind(this)
        });
        return this._myPrecapsView;
    }

    ,loadSendView: function() {
        var holdFx;
        if (this._bSheetActive) {
            this._cleanupBSheet();
            holdFx = true;
        }
        this._currentBSheet = this.getSendView();
        this._prepBSheet();
        this.viewBSheet(holdFx);
    }

    ,loadMyPrecapsView: function() {
        var holdFx;
        if (this._bSheetActive) {
            this._cleanupBSheet();
            holdFx = true;
        }
        this._currentBSheet = this.getMyPrecapsView();
        this._prepBSheet();
        this.viewBSheet(holdFx);
    }

    ,loadSettingsView: function() {}



    // Visual FX
    ,showBodyMask: function(options) {
        // set defaults
        var defaults = {
            beforeShow: null
            ,afterShow: null
            ,beforeHide: null
            ,afterHide: null
            ,opacity: 0.6
            ,clickToClose: true
        };
        var options = Object.merge(defaults, options) || defaults;

        var onBodyMaskShow = function() {
            this.removeEvent('bodyMask:complete', onBodyMaskShow);
            if (options.afterShow) {
                options.afterShow.call(this);   
            }
        }.bind(this);
        this.addEvent('bodyMask:complete', onBodyMaskShow);


        this._bodyMask.setStyle('visibility', 'visible');
        if (options.beforeShow) {
            options.beforeShow.call(this);
        }

        this._bodyMaskFx.start(options.opacity);

        if (options.clickToClose) {
            var clickToClose = function() {
                this._bodyMask.removeEvent('click', clickToClose);
                this.hideBodyMask({
                    beforeHide: options.beforeHide
                    ,afterHide: options.afterHide
                });
            }.bind(this)
            this._bodyMask.addEvent('click', clickToClose);
        }

        return this;
    }

    ,hideBodyMask: function(options) {
        // set defaults
        var defaults = {
            beforeHide: null
            ,afterHide: null
        };
        var options = Object.merge(defaults, options) || defaults;

        var onBodyMaskHide = function() {
            this.removeEvent('bodyMask:complete', onBodyMaskHide);
            this._bodyMask.setStyle('visibility', 'hidden');
            if (options.afterHide) {
                options.afterHide.call(this);
            }
        }.bind(this);
        this.addEvent('bodyMask:complete', onBodyMaskHide);

        if (options.beforeHide) {
            options.beforeHide.call(this);
        }

        this._bodyMaskFx.start(0);

        return this;
    }

    ,showLoadingSpinner: function(){
        this._loadingSpinner = this._loadingSpinner || new Spinner(this._documentBody, {
            name: ''
            ,version: ''     // [string] light, dark - shortcut for setting the style of the spinner and mask
            ,size: ''        // [string] xlarge/huge, normal/large, medium, small, tiny
            ,spinner: {
                lines: 2
                ,length: 0
                ,width: 30
                ,radius: 8
                ,trail: 50
                ,color: '#fff'
                ,speed: 1.5
                ,shadow: false
            }
            ,maskOpacity: 0
        });

        this._loadingSpinner.show();
    }

    ,hideLoadingSpinner: function(){
        this._loadingSpinner.hide();
    }

    ,playSound: function(which){
        this._howler.urls([this._soundMap[which]]);
        this._howler.play();
    }
});



