var Precap = Precap || {};

Precap.BSheet = new Class({

	Implements: [Options, Events]

	,options: {
		className: ''
		,title: ''
		,actionButtons: null // [array] of button objects
		,closeButton: true
	}

	,initialize: function(options){
		this.setOptions();
		// this._buildFraming();
	}

	,_buildFraming: function(){
		this._html = new Element('article', {
			'class': 'BSheet '+this.options.className
		}).grab(
			this._header = new Element('header').grab(
				new Element('h1', {html: this.options.title})
				// ,new Element('div.ActionButtons').adopt(
				// 	new Precap.Button({
				// 		text: 'Send'
				// 		,className: 'Send'
				// 		,active: true
				// 		,size: 'Xlarge'
				// 		,onClick: function(){
				// 			this.fireEvent('send:clicked');
				// 		}.bind(this)
				// 	})
				// 	,new Precap.Button({
				// 		text: 'Preview'
				// 		,className: 'Preview'
				// 		,size: 'Xlarge'
				// 		,onClick: function(){
				// 			console.log('PREVIEW IT');
				// 		}.bind(this)
				// 	})
				// )
			)
		);

		if (this.options.actionButtons) {
			this.options.actionButtons.each(function(b){
				this._actionButtons.grab(b.toElement());
			}, this);
			this._header.grab(
				this._actionButtons = new Element('div.ActionButtons')
			);
		}

		if (this.options.closeButton) {
			this._html.grab(
				this._closeButton = new Precap.Button({
					text: ''
					,size: 'Icon'
					,className: 'CloseX_L'
					,onClick: function(){
						this.fireEvent('close', this);
					}.bind(this)
				})
			);
		}

		this._html.grab(
			this._contentContainer = new Element('div.ContentContainer')
		);
	}

	// ,_buildContent: function(){
	// 	// override this method for each sub-class
	// 	this._content = 'replace me';
	// 	// should return a single element that will be the first child element of this._contentContainer
	// }

	,getContentContainer: function(){
		return this._contentContainer;
	}

	,getActionButtons: function(){
		return this._actionButtons;
	}

	,getHeader: function(){
		return this._header;
	}

	,toElement: function(){
		return this._html;
	}
});



