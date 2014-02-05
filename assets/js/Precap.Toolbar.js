var Precap = Precap || {};

Precap.Toolbar = new Class({

	Implements: [Options,Events]

	,options: {
		
	}

	,initialize: function(options){
		this.setOptions(options);
		this._buttons = [];
		this._build();
		this._setupEvents();
	}

	,_build: function(){
		this._sendButton = new Precap.Button({
			title: 'Send this precap...'
			,text: 'send'
			,className: 'SendButton'
			,icon: true
			,onClick: function(e, button) {
				this.fireEvent('send:clicked', button);
			}.bind(this)
		});

		this._newPrecapButton = new Precap.Button({
			title: 'Make a new precap...'
			,text: 'new precap'
			,className: 'NewPrecapButton'
			,icon: true
			,onClick: function(e, button) {
				this.fireEvent('newPrecap:clicked', button);
			}.bind(this)
		});

		this._myPrecapsButton = new Precap.Button({
			title: 'View list of precaps...'
			,text: 'my precaps'
			,className: 'MyPrecapsButton'
			,icon: true
			,onClick: function(e, button) {
				this.fireEvent('myPrecaps:clicked', button);
			}.bind(this)
		});

		this._directoryButton = new Precap.Button({
			title: 'View all contacts...'
			,text: 'directory'
			,className: 'DirectoryButton'
			,icon: true
			,onClick: function(e, button) {
				this.fireEvent('directory:clicked', button);
			}.bind(this)
		});

		this._settingsButton = new Precap.Button({
			title: 'View application settings...'
			,text: 'settings'
			,textOnly: true
			,className: 'SettingsButton'
			,onClick: function(e, button) {
				this.fireEvent('settings:clicked', button);
			}.bind(this)
		});

		// Make the _buttons Array...
		this._buttons.push(
			this._sendButton
			,this._newPrecapButton.setProperties({title:'Coming soon!'}).disable()
			,this._myPrecapsButton
			,this._directoryButton.setProperties({title:'Coming soon!'}).disable()
			,this._settingsButton.setProperties({title:'Coming soon!'}).disable()
		);

		this._html = new Element('div.Toolbar', {id:'Toolbar'}).grab(
			this._actionButtons = new Element('ul.ActionButtons')
		);
		this._buttons.each(function(button){
			this._actionButtons.grab(
				new Element('li.Trigger').grab(
					button.toElement()
				)
			);
		}, this);
	}

	,_setupEvents: function() {
		this.addEvent('send:clicked', function(button){
			this.fireEvent('send', [button, this]);
		}.bind(this));
		this.addEvent('newPrecap:clicked', function(button){
			this.fireEvent('newPrecap', [button, this]);
		}.bind(this));
		this.addEvent('myPrecaps:clicked', function(button){
			this.fireEvent('myPrecaps', [button, this]);
		}.bind(this));
		this.addEvent('directory:clicked', function(button){
			this.fireEvent('directory', [button, this]);
		}.bind(this));
		this.addEvent('settings:clicked', function(button){
			this.fireEvent('settings', [button, this]);
		}.bind(this));
	}

	,getButtons: function(){
		return this._buttons;
	}

	,getButton: function(which){
		return this[which+'Button'];
	}

	,toElement: function() {
		return this._html;
	}
});