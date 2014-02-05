var Precap = Precap || {};

Precap.SectionGap = new Class({

	Implements: [Options,Events]

	,options: {}

	,initialize: function(options){
		this.setOptions(options);
		this._build();
		this._setupEvents();
		this._setupFx();
        this.partType = 'sectionGap';
	}

	,_setupEvents: function() {
		this.addEvent('addButton:clicked', function(){
			this.showAddBar();
		}.bind(this));

		this.addEvent('type:clicked', function(type){
			this.fireEvent('select', [type, this]);
		}.bind(this));
	}

	,_setupFx: function(){
		this._addBarFx = new Fx.Morph(this._addBar, {
			duration: 200
			,transition: Fx.Transitions.Expo.easeOut
		});
	}

	,_build: function(){
		this._html = new Element('div.SectionGap').adopt(
			this._buildAddButton()
			,this._buildAddBar()
		);
	}

	,_buildAddButton: function() {
		this._addButton = new Precap.Button({
			title: 'Add a new Section here...'
			,className: 'AddSectionHereButton'
			,size: 'Icon'
			,onClick: function() {
				this.fireEvent('addButton:clicked', this);
			}.bind(this)
		});
		return this._addButton;
	}

	,_buildAddBar: function() {
		this._addBar = new Element('div.AddSectionHereBar').adopt(
			this._buttonList = new Element('ul.SectionTypes')
			,this._closeButton = new Precap.Button({
				text: 'x'
				,size: 'Icon'
				,className: 'CloseButton'
				,onClick: function() {
					this.hideAddBar();
				}.bind(this)
			})
		);

		this._addBar.setStyles({
			opacity: 0
			,top: 10
			,visibility: 'hidden'
		});

		// list of sections (possibly get this from somewhere else in the future)
		var sectionTypes = [
			'Note', 
			'List', 
			'Location', 
			'Timeline', 
			'Group', 
			'PhotoSet', 
			'FileSet'
		];
		sectionTypes.each(function(type) {
			var button = new Precap.Button({
				// size: 'Icon'
				text: type
				,textOnly: true
				,className: type
				,title: 'Add a '+type+' section here...'
				,onClick: function() {
					this.fireEvent('type:clicked', [type, this]);
					this.hideAddBar();
				}.bind(this)
			});
			button.toElement().grab(new Element('i.Icon'), 'top');

			var li = new Element('li.ButtonWrapper.'+type).grab(
				button
			);

			this._buttonList.grab(li);
		}, this);

		return this._addBar;
	}

	,showAddBar: function() {
		this._addBar.setStyle('visibility', 'visible');
		// this._html.addClass('BarVisible');
		// this._addBar.reveal();
		this._addBarFx.start({
			opacity: 1
			,top: 0
		}).chain(function(){
			this._html.addClass('BarVisible');
		}.bind(this));

		this._clickOutFunc = function(){
			this.hideAddBar();
		}.bind(this);
		this._addBar.addEvent('clickout', this._clickOutFunc);
	}

	,hideAddBar: function() {
		// this._addBar.dissolve();
		this._addBarFx.start({
			opacity: 0
			,top: 10
		}).chain(function(){
			this._addBar.setStyle('visibility', 'hidden');
			this._html.removeClass('BarVisible');
		}.bind(this));

		this._addBar.removeEvent('clickout', this._clickOutFunc);
		// (function(){
		// 	this._html.removeClass('BarVisible');
		// }.bind(this)).delay(200);
	}

	,hideAddButton: function() {
		this._addButton.hide();
		return this;
	}

	,showAddButton: function() {
		this._addButton.show();
		return this;
	}

	,toElement: function() {
		return this._html;
	}
});