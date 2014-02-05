var Precap = Precap || {};

Precap.Checkbox = new Class({
	Implements: [Options,Events]

	,options: {
		className: ''
		,checked: false
		,checkedClassname: 'Checked'
		// ,onCheck: function(thisObj){}
		// ,onUncheck: function(thisObj){}
		// ,onToggle: function(checked, thisObj){}
	}

	,initialize: function(options){
		this.setOptions(options);
		this._html = new Element('div', {
			'class': 'PrecapCheckbox '+this.options.className
			,html: '&#x2714;'
		});
		this._setupEvents();
		if (this.options.checked) {
			this.check();
		}
	}

	,_setupEvents: function() {
		this._html.addEvent('click', function(e){
			e.stop();
			this.toggle();
		}.bind(this));
	}

	,toggle: function() {
		if (this.isChecked()) {
			this.uncheck(true);
		} else {
			this.check(true);
		}
		this.fireEvent('toggle', [this.isChecked(), this]);
		return this;
	}

	,check: function(doNotToggle) {
		this._checked = true;
		this._html.addClass(this.options.checkedClassname);
		this.fireEvent('check', this);
		if (!doNotToggle) {
			this.fireEvent('toggle', [this.isChecked(), this]);
		}
		return this;
	}

	,uncheck: function(doNotToggle) {
		this._checked = false;
		this._html.removeClass(this.options.checkedClassname);
		this.fireEvent('uncheck', this);
		if (!doNotToggle) {
			this.fireEvent('toggle', [this.isChecked(), this]);
		}
		return this;
	}

	,isChecked: function() {
		return this._checked;
	}

	,getChecked: function() {
		return this._checked;
	}

	,toElement: function() {
		return this._html;
	}
});