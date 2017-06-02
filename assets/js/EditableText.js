var EditableText = new Class({

	Implements: [Options,Events]

	,options: {
		tag: 'p'
		,maxLength: 500
		,className: ''
		,title: ''
		,properties: {}
		,allowLineBreaks: true
		,allowTabbing: false
		,placeholderText: ''
		,placeholderOnEmpty: true
		,saveEmptyValue: false
		,escToBlur: true
		,returnHTML: false
		,activateOnInit: false
		,activeClass: 'Active'
		,activateOn: 'mousedown'    // [string] mousedown, mouseup, click
		,deactivateOn: null         // [string] enter, tab, etc
		,inactiveClass: ''
		,autoClean: true
		,autoCleanInterval: 2500
		,emptyCrumbsList: ['<br>','<p>','&nbsp;','&#160;', '""']
		,keys: {} // keyboard shortcuts... key = the key, value = function
		// ,onFocus: function(thisObj) {}
		// ,onBlur: function(thisObj) {}
		// ,onActivate: function(thisObj) {}
		// ,onDeactivate: function(thisObj, hasChanged) {}
		// ,onClean: function(thisObj, value) {}

		// special keys:
		// ,onEsc: function(thisObj) {}
		// ,onTab: function(thisObj) {}
		// ,onEnter: function(thisObj) {}
		// ,onBackspace: function(thisObj) {}
	}

	,initialize: function(text, options){
		this.setOptions(options);
		this._text = text;
		this.crumbsList = this.options.emptyCrumbsList;
		this._build();
		this._setupKeyboardEvents();

		if (!isEmptyObject(this.options.data)) {
			this.setData(this.options.data);
		}
		this.enable();
		if (this.options.autoClean) this._setupAutoClean();
		if (this.options.returnHTML) {
			if (!this._text && this.options.placeholderText) {
				return this._placeholderText;
			} else {
				return this.html;
			}
		}
		this.html.store('EditableText', this);
	}

	,_build: function() {
		var htmlProperties = {
			// html: this._text
			'class': 'EditableText'+ ' '+this.options.className
			,contentEditable: (this.options.activateOnInit)
			,title: this.options.title
			,events: {
				click: function(e) {
					e.stop();
				}
				,blur: function() {
					this.deactivate(true);
				}.bind(this)
				,focus: function() {
					if (this.isEnabled() && !this.isActive()) {
						this.activate(true);
					}
				}.bind(this)
			}
		};

		// handle the activateOn event name
		htmlProperties.events[this.options.activateOn] = function(e){
			if (this.isEnabled() && !this.isActive()) {
				this.activate();
			}
		}.bind(this);

		if (!isEmptyObject(this.options.properties)) {
			htmlProperties = Object.merge(htmlProperties, this.options.properties);
		}

		this.html = new Element(this.options.tag, htmlProperties);

		this._placeholderText = new Element(this.options.tag, {
			html: this.options.placeholderText
			,'class': 'EditableText Placeholder Instructive'+ ' '+this.options.className
			,events: {
				click: function(e) {e.stop();}
				,mousedown: function() {
					this.swapPlaceholderText();
				}.bind(this)
			}
		});

		this.setValue(this._text);
	}

	,_setupAutoClean: function() {
		var check = function(){
			// hold the 'old' value
			var val = this._value; 
			// get (and set) the current ._value
			this._value = this.getValue(); 
			// if anything is new since the last interval, save it.
			if (val !== this._value) { 
				// if we have contenteditable 'crumbs', clean them up.
				if (this.hasCrumbs()) { 
					this.empty();
				}
				// announce that we're clean.
				this.fireEvent('clean', [this, this._value]);
			}
		}.bind(this);

		this.addEvent('activate', function(){
			this._saveInterval = setInterval(check, this.options.autoCleanInterval);
		}.bind(this));

		this.addEvent('deactivate', function(){
			clearInterval(this._saveInterval);
			delete this._saveInterval;
		}.bind(this));
	}



	// KEYBOARD EVENTS
	,_setupKeyboardEvents: function() {
		this._keyboardKeys = this.options.keys;

		// ESC key
		if (this.options.escToBlur) {
			this._keyboardKeys.esc = function(e){
				e.preventDefault();
				this.deactivate();
				this.fireEvent('esc', this);
			}.bind(this);
		}

		// TAB key
		if (this.$events.tab && this.$events.tab.length) {
			this._keyboardKeys.tab = function(e){
				e.preventDefault();
				this.fireEvent('tab', this);
			}.bind(this);
		} else 
		if (this.options.allowTabbing) {
			this._keyboardKeys.tab = function(e){
				e.preventDefault();
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode( document.createTextNode('\t') );
					sel.removeAllRanges();
					range.collapse(false);
					sel.addRange(range);
				}
				this.fireEvent('tab', this);
			}.bind(this);
		}

		// ENTER key
		if (this.options.allowLineBreaks == false) {
			// if we have an 'enter' event we need to handle...
			if (this._keyboardKeys.enter) {
				var enterFunc = this._keyboardKeys.enter;
				this._keyboardKeys.enter = function(e){
					e.preventDefault();
					enterFunc();
					this.fireEvent('enter', this);
					return null;
				}.bind(this);
			} else {
				this._keyboardKeys.enter = function(e){
					e.preventDefault();
					this.fireEvent('enter', this);
					return null;
				}.bind(this);
			}
		}

		// BACKSPACE key 
		this._keyboardKeys.backspace = function(e) {
			this.fireEvent('backspace', this);
			if (this.hasCrumbs()) {
				this.empty();
				this.fireEvent('empty', this);
			} else if (this.isEmpty()) {
				this.fireEvent('empty', this);
			};
		}.bind(this);

		// Deactivate Key(s)
		if (this.options.deactivateOn) {
			if (typeOf(this.options.deactivateOn) == 'array') {
				this.options.deactivateOn.each(function(k){
					// if we have one, store it, then fire it along with the deactivate...
					if (this._keyboardKeys[k]) {
						var func = this._keyboardKeys[k];
						this._keyboardKeys[k] = function(e){
							func(e);
							this.deactivate();
						}.bind(this);
					} else {
						this._keyboardKeys[k] = function(){
							this.deactivate();
						}.bind(this)
					}
				}, this);
			} else if (typeOf(this.options.deactivateOn) == 'string') {
				this._keyboardKeys[this.options.deactivateOn] = this._keyboardKeys[this.options.deactivateOn] = function(){
					this.deactivate();
				}.bind(this);
			}
		}

		Mousetrap.stopCallback = function(e, element, combo) {
			// if the element has the class "mousetrap" then no need to stop
			if ((' ' + element.className + ' ').indexOf(' EditableText ') > -1) {
				return false;
			}

			// overriding the Mousetrap default...
			return element.tagName == 'SELECT';
		};
	}

	,_bindInputEvents: function(){
		if (this.$events.keyup) {
			this.html.addEvent('keyup', function(){
				this.fireEvent('keyup', [this.getValue(), this]);
			}.bind(this));
		}
		this.html.addEvents({
			keyup: function(){
				this.fireEvent('keyup', [this.getValue(), this]);
			}.bind(this)
			,keydown: function(){
				this.fireEvent('keydown', [this.getValue(), this]);
			}.bind(this)
		});
		Mousetrap.bind(this._keyboardKeys);
	}

	,_unbindKeys: function(){
		var toUnbind = [];
		Object.each(this._keyboardKeys, function(v,k){
			toUnbind.push(k);
		}, this);
		Mousetrap.unbind(toUnbind);
	}



	// PUBLIC METHODS
	,getValue: function() {
		return this.html.get('html');
	}

	,setValue: function(content) {
		this._value = content;
		this.html.set('html', content);
	}

	,activate: function(fromDomFocus, cursorAtEnd) {
		this._isActive = true;
		if (this._placeholderActive) {
			this.swapPlaceholderText();
		}
		this.html
			.set('contentEditable', true)
			.addClass(this.options.activeClass)
			.removeClass(this.options.inactiveClass);
		if (!fromDomFocus) {
			this.html.focus();
		}

		if (cursorAtEnd) {
			var range = document.createRange();
			var sel = window.getSelection();
			range.setStart(this.html, 1);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			if (!fromDomFocus) {
				this.html.focus();
			}
		}

		this._bindInputEvents();

		this._textAtActivation = this.getValue();

		this.fireEvent('activate', this);
		return this;
	}
	
	,deactivate: function(fromDomBlur) {
		// If this method has *not* been triggered by the actual DOM blur event...
		if (!fromDomBlur) {
			// then fire that event...
			this.html.blur();
			return;
		} else {
			// ...which (see above) has instructions to bring you back here...
			this.html
				.set('contentEditable', false)
				.removeClass(this.options.activeClass)
				.addClass(this.options.inactiveClass);

			this._unbindKeys();

			if (this.isEmpty() && this.options.placeholderOnEmpty) {
				this.swapPlaceholderText();
			}

			var textHasChanged = !(this._textAtActivation == this.getValue());

			this.fireEvent('blur', this);
			this.fireEvent('deactivate', [this, textHasChanged]);
		}
		this._isActive = false;
		return this;
	}

	,enable: function() {
		this._isEnabled = true;
		return this;
	}

	,disable: function() {
		this.deactivate();
		this._isEnabled = false;
		return this;
	}

	,empty: function() {
		this.setValue('');
		return this;
	}

	,selectAll: function(){
		var range = document.createRange();
		range.selectNodeContents(this.html);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		return this;
	}

	,swapPlaceholderText: function(){
		if (this._placeholderActive) {
			this.html.replaces(this._placeholderText);
			(function(){this.activate();}.bind(this)).delay(80);
			this._placeholderActive = false;
		} else {
			this._placeholderText.replaces(this.html);
			this._placeholderActive = true;
		}
	}

	,isEmpty: function() {
		return !this.getValue();
	}

	,isEnabled: function() {
		return this._isEnabled;
	}

	,isActive: function() {
		return this._isActive;
	}

	,hasCrumbs: function() {
		return this.crumbsList.contains(this.getValue());
	}

	,toElement: function() {
		if (this.options.placeholderText && !this._text) {
			this._placeholderActive = true;
			return this._placeholderText;
		} else {
			return this.html;
		}
	}
});