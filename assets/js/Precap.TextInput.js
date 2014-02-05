var Precap = Precap || {};

Precap.Input = new Class({
	Implements: [Options,Events]

	,options: {
		className: ''
		,placeholderText: ''
		,value: ''
		,type: 'input' 		// input || textarea
		,active: true
		,buttons: null		// 	
		,keys: null
	}

	,initialize: function(options){
		this.setOptions(options);
		this._type = this.options.type;
		this._html = new Element('div.PrecapInput.Text');

		if (this._type == 'input') {
			this._html.addClass('OneLine');
			this._html.grab(
				this._input = new Element('input', {
					placeholder: this.options.placeholderText || ''
					,value: this.options.value || ''
				})
			);
		} else if (this._type == 'textarea') {
			this._html.addClass('MultiLine');
			this._html.grab(
				this._inner = new Element('div.Inner').grab(
					this._input = new Element('textarea', {
						html: this.options.value || ''
					})
				)
			);
		}
		if (this.options.buttons && typeOf(this.options.buttons) == 'array') {
			this._html.addClass('Buttons');
			this.options.buttons.each(function(button){
				button.addClass('Do');
				this[(this._type == 'input' ? '_html' : '_inner')].grab(
					button
				);
			}, this);
		}

		if (this.options.keys) {
			this._setupKeyboardEvents();
		}

		this._setupEvents();
		if (this.options.active) {
			this.activate();
		}
	}

	,getValue: function(){
		return this._input.get('value');
	}

	,activate: function(){
		this._active = true;
		this._bindKeys();
	}

	,deactivate: function(){
		this._active = false;
		this._unbindKeys();
	}

	,isActive: function(){
		return this._active;
	}

	,reset: function(){
		console.log('???');
		if (this._type == 'input') {
			this._input.setProperties({
				placeholder: this.options.placeholderText || ''
				,value: ''
			});
		} else if (this._type == 'textarea') {
			this._input.setProperty('html', this.options.value || '');
		}
	}

	,_setupKeyboardEvents: function(){
		this._keyboardKeys = this.options.keys;
				Mousetrap.stopCallback = function(e, element, combo) {
			// if the element has the class "mousetrap" then no need to stop
			if ((' ' + element.className + ' ').indexOf(' EditableText ') > -1) {
				return false;
			}

			// overriding the Mousetrap default...
			return element.tagName == 'SELECT';
		};
	}

	,_bindKeys: function(){
		Mousetrap.bind(this._keyboardKeys);
	}

	,_unbindKeys: function(){
		var toUnbind = [];
		Object.each(this._keyboardKeys, function(v,k){
			toUnbind.push(k);
		}, this);
		Mousetrap.unbind(toUnbind);
	}

	,_setupEvents: function() {
		// gimme! gimme! gimme!
		// I NEED! I NEED!
	}

	,toElement: function() {
		return this._html;
	}
});