var Precap = Precap || {};

Precap.Button = new Class({

	Implements: [Options,Events, Spin]

	,options: {
		text: ''	
		,title: ''
		,className: ''
		,id: ''
		,classNameActive: 'Active'
		,classNamePressed: 'Pressed'
		,classNameHover: 'On'
		,size: ''					// [string]  'Icon, Medium, Large, XLarge'
		,enabled: true
		,active: false
		,icon: ''
		,textOnly: false
		,events: null
		// ,onClick: function(e, thisObj){}
	}

	,initialize: function(options){
		this.setOptions(options);
		this.build();
		this.setupEvents();
		if (this.options.enabled) {
			this.enable();
		}
		if (this.options.active) {
			this.activate();
		}
	}

	,build: function(){
		var classes = ['PrecapButton'];
			if (this.options.className) {
				classes.push(this.options.className);	
			}
			if (this.options.size) {
				classes.push('Size-'+this.options.size.toLowerCase().capitalize());
			}
			if (this.options.textOnly) {
				classes.push('TextOnly');
			}

		this.html = new Element('div', {
			title: this.options.title
			,id: this.options.id
			,'class': classes.join(' ')
		});
		if (this.options.icon) {
			this._icon = new Element('i.Icon', {html: '&nbsp;'})
			if (typeOf(this.options.icon) == 'string') {
				this._icon.addClass(this.options.icon);
			}
			this.html.grab(this._icon)
		}
		this.html.grab(
			this._text = new Element('span', {
				html: this.options.text || '&#160;'
			})
		);

		return this;
	}

	,addHtmlEvent: function(event, func) {
		this.html.addEvent(event, func);
		return this;
	}

	,removeHtmlEvent: function(event, func) {
		this.html.removeEvent(event, func);
		return this;
	}

	,setupEvents: function() {
		this.html.removeEvents();

		this.html.addEvents({
			click: function(e){
				e.stop();
				this.fireEvent('click', [e, this]);
			}.bind(this)
			,mouseenter: function(e){
				this.html.addClass('Over');
				this.fireEvent('mouseenter', [e, this]);
			}.bind(this)
			,mouseleave: function(e){
				this.html.removeClass('Over');
				if (this.mousedown) {
					this.html.removeClass(this.options.classNamePressed);
				}
				this.fireEvent('mouseleave', [e, this]);
			}.bind(this)
			,mousedown: function(e){
				this.mousedown = true;
				this.html.addClass(this.options.classNamePressed);
				this.fireEvent('mousedown', [e, this]);
			}.bind(this)
			,mouseup: function(e){
				this.mousedown = false;
				this.html.removeClass(this.options.classNamePressed);
				this.fireEvent('mouseup', [e, this]);
			}.bind(this)
			,focus: function(e){
				this.html.addClass(this.options.classNameHover);
				this.fireEvent('focus', [e, this]);
			}.bind(this)
			,blur: function(e){
				this.html.removeClass(this.options.classNameHover);
				this.fireEvent('blur', [e, this]);
			}.bind(this)
			,selectstart: function(){
				return false;
			}
			,touchstart: function(e) {
				this.mousedown = true;
				this.html.addClass(this.options.classNamePressed);
				this.fireEvent('touchstart', [e, this]);
				this.fireEvent('mousedown', [e, this]);
			}.bind(this)
			,touchend: function(e) {
				e.stop();
				this.mousedown = false;
				this.html.removeClass(this.options.classNamePressed);
				this.fireEvent('mouseup', [e, this]);
				this.fireEvent('touchend', [e, this]);
				this.fireEvent('click', [e, this]);
			}.bind(this)
		});

		return this;
	}

	,enable: function(){
		this.html.removeEvents();
		this.setupEvents();
		this.html.removeClass('Disabled');
		this.html.addClass('Enabled');
		this._enabled = true;
		this._disabled = false;
		return this;
	}

	,disable: function(){
		this.html.removeEvents();
		this.html.removeClass('Enabled');
		this.html.addClass('Disabled');
		this._enabled = false;
		this._disabled = true;
		return this;
	}

	,activate: function(additionalActiveClass){
		this.html.addClass('Active');
		if (additionalActiveClass) {
			this._additionalActiveClass = additionalActiveClass;
			this.html.addClass(this._additionalActiveClass);
		}
		this._active = true;
		return this;
	}

	,deactivate: function(){
		this.html.removeClass('Active');
		this.html.removeClass(this.options.classNamePressed);
		this.html.removeClass(this.options.classNameHover);
		if (this._additionalActiveClass) {
			this.html.removeClass(this._additionalActiveClass);
			delete this._additionalActiveClass;
		}
		this._active = false;
		return this;
	}

	,toggleEnabled: function() {
		if (this.isEnabled()) {
			this.disable();
		} else {
			this.enable();
		}
	}

	,toggleActive: function() {
		if (this.isActive()) {
			this.deactivate();
		} else {
			this.activate();
		}
	}

	,isActive: function(){
		return this._active;
	}

	,isEnabled: function(){
		return this._enabled;
	}

	,isDisabled: function(){
		return this._disabled;
	}

	,addClass: function(className){
		this.html.addClass(className);
		return this;
	}

	,removeClass: function(className){
		this.html.removeClass(className);
		return this;
	}

	,toggleClass: function(className) {
		this.html.toggleClass(className);
		return this;
	}

	,hasClass: function(className) {
		return this.html.hasClass(className);
	}

	,setText: function(newText){
		this._text.setProperty('text', newText);
		if (!this.html.contains(this._text)) {
			this._text.inject(this.html);
		}
		return this;
	}

	,getText: function() {
		return this._text.get('text');
	}

	,swapClass: function(classToRemove, classToAdd) {
		this.html.swapClass(classToRemove, classToAdd);
		return this;
	}

	,setProperties: function(properties) {
		if (properties) {
			this.html.setProperties(properties);
		} else {
			console.error("No properties passed to .setProperties()");
		}
		return this;
	}

	,destroy: function(){
		this.html.destroy();
		return this;
	}

	,show: function(type) {
		this.toElement().show(type);
		return this;
	}

	,hide: function() {
		this.toElement().hide();
		return this;
	}

	,toElement: function() {
		return this.html;
	}
});