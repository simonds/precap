
Precap.Section.Group = new Class({
	Extends: Precap.Section.Base

	,Implements: [Options,Events]

	,options: {}

	,initialize: function(data, options, doc){
		this.setOptions(options);
		this.parent(data, options, doc);

		this._contacts = (this._data.contacts ? Array.clone(this._data.contacts) : []);

		this._getContentContainer().adopt(
			this._buildContent()
			,this._buildContentFooter()
		);
		this._setupEvents();
		this.activateSortables();
	}

	,_setupEvents: function() {
		this.addEvent('newItemTrigger:clicked', function(){
			this.addItem(null, true);
		}.bind(this));

		this.addEvent('viewContact', function(contact){
			console.log('view contact', contact);
			alert('View & Edit Contact - coming soon.');
		}.bind(this));

		this.parent();
	}

	,_getDefaultData: function(){
		var data = {
			type: 'Group'
			,name: 'A New Group'
		};
		return data;
	}



	// BUILDS
	,_buildContent: function(){
		this._list = new Element('ul.GroupList');
		this._buildListItems();
		return this._list;
	}

	,_buildListItems: function() {
		if (this._contacts.length) {
			this._contacts.each(function(i, index) {
				i.index = index;
				this._injectItem(this._buildListItem(i));
			}, this);
		}
	}

	,_injectItem: function(item, activateOnInject){
		var list = this.getListElements();
		if (list.length) {
			list[item.index-1].grab(item.element, 'after');
		} else {
			this.getList().grab(item.element);
		}
		if (activateOnInject) {
			item.editable.activate();
			this._sortables.addItems(item.element);
		}

		this.fireEvent('item:added', [item, this]);
	}

	,_buildListItem: function(item) {
		item = item || {};

		item.element = new Element('li', {
			'class': 'Contact'+' '+item.type.capitalize()+' vcard'
		});

		// PERSON
		if (item.type == 'person') {
			item.element.set('id', 'hcard-'+item.firstName+'-'+item.lastName);
			item.element.adopt(
				new Element('div.Avatar', {
					title: 'View this contact'
					,events: {
						click: function(){
							this.fireEvent('viewContact', item);
						}.bind(this)
					}
				}).grab(
					new Element('img', {src: item.imagePath})
				)
				,new Element('span.Name.fn.n', {
					html: item.firstName+' '+item.lastName
					,title: 'View this contact'
					,events: {
						click: function(){
							this.fireEvent('viewContact', item);
						}.bind(this)
					}
				})
				,(item.title ? new Element('span.Title', {html: item.title}) : '')
				,(item.email ? new Element('span.Email').grab(
					new Element('a.email', {
						html: item.email
						,href:'mailto:'+item.email+'?Subject='+(this._precapDoc ? 'Re: '+this._precapDoc.getData().name : '')})
				) : '')
				,(item.phone ? new Element('span.Phone.tel', {html: item.phone}) : '')
			);
		} else 
		// COMPANY
		if (item.type == 'company') {
			item.element.set('id', 'hcard-'+item.company.replace(/\s/g, '-'));
			item.element.adopt(
				new Element('div.Avatar', {html:'&#160;'})
				,new Element('span.Name.fn.org', {html: item.company})
				,(item.firstName || item.lastName 
					? new Element('span.PrimaryContact', {html: (item.firstName || '')+' '+(item.lastName || '')})
					: ''
				)
				,(item.title ? new Element('span.Title', {html: item.title}) : '')
				,(item.email ? new Element('span.Email').grab(
					new Element('a.email', {
						html: item.email
						,href:'mailto:'+item.email+'?Subject='+(this._precapDoc ? 'Re: '+this._precapDoc.getData().name+' - ' : '')})
				) : '')
				,(item.phone ? new Element('span.Phone.tel', {html: item.phone}) : '')
			);
		}

		item.element.store('itemObject', item);

		return item;
	}

	,_buildContentFooter: function(){
		/*
		<div class="NewPersonGutter NewThingGutter">
			<div class="NewItemText" title="Add a new person to this group...">New Person</div>
		</div>
		*/
		this._contentFooter = new Element('div.ContentFooter').adopt(
			new Element('div.Left').grab(
				this._newTrigger = new Precap.Button({
					title: 'Add a new person to this group...'
					,text: 'Add Contact'
					,className: 'NewItemText Instructive'
					,textOnly: true
					,onClick: function(){
						this.fireEvent('newItemTrigger:clicked', this);
					}.bind(this)
				})
			)
		);

		return this._contentFooter;
	}			



	,addItem: function(index, activate) {
		var item = {};
		if (this._items.length == 0) {
			item.index = 0;
		} else {
			item.index = index || this._items.length;
		}

		// determine where to put it
		if (item.index != this._items.length) {
			this._items.splice(item.index, 0, item);
		} else {
			this._items.push(item);
		}

		this._injectItem(this._buildListItem(item), activate);
	}

	,deleteItem: function(item, focusOnPrev) {
		item.element.destroy();
		this._items.erase(item);
		console.log('DELETE ITEM', item);

		if (this._items.length == 0) {
			this.addItem(null, true);
		} else if (focusOnPrev && item.index !== 0) {
			this._items[item.index-1].editable.activate(null, true);
		}
		//this.reindexItems();
	}

	,getItems: function() {
		return this._items;
	}

	,getList: function() {
		return this._list;
	}

	,getListElements: function() {
		return this.getList().getElements('li');
	}

	,save: function(content) {
		console.log('do group save prep here');
		this.parent();
	}

	,reindexItems: function() {
		this._items.empty();
		this.getListElements().each(function(li, index) {
			var itemObj = li.retrieve('itemObject');
			itemObj.index = index;
			this._items.push(itemObj);
		}, this);
	}

	,activateSortables: function() {
		this._sortables = new Sortables(this.getList(), {
			clone: true
			,opacity: 0
			,dragOptions: {
				snap: 0
				// ,onSnap: function(){
				// 	this._dragging = true;
				// }.bind(this)
			}
			,onStart: function(element, clone) {
				// element.getElement('.EditableText').retrieve('EditableText').deactivate();
				// clone.setStyle('z-index', 5000).getElement('.EditableText').addClass('Clone');
			}
			,onComplete: function() {
				if (this._dragging) {
					this._dragging = false;
					//this.reindexItems();
					// this.refreshSortables();
				}

				// this.save(this.getItems());
			}.bind(this)
		});
	}

	,firstRun: function(){
		// this.addItem();
		this._title.activate().selectAll();
		// do other stuff here depending on the section.
	}
});