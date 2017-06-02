// Debounced autosave for Ember.js
// Original code by Mitch Lloyd http://gaslight.co/blog/?author=mitchlloyd
// updated from http://gaslight.co/blog/an-autosave-pattern-for-ember-and-ember-data
// repo at https://github.com/gaslight/ember-autosaving
// Changed to work with latest Ember Data as of 2013-12-16 by Genkilabs
// Includes hooks for pacifier from http://ricostacruz.com/nprogress
// NOTE: This requires a 2 part install in which the controller and any models it loads have the corresponding mixin

// This is how long we will wait on a form before saving. I like to put this in App.AUTOSAVE_DELAY
var AUTOSAVE_DELAY = 1500

// Model Component
App.AutosavableModel = Ember.Mixin.create({
	_buffers: function(){
		return Ember.Map.create()
	}.property(),
});

// Controller Component
App.AutosavableController = Ember.Mixin.create({
	bufferedFields: [],
	instaSaveFields: [],

	// Convenience property to access all the fields together
	_allFields: function() {
		return this.get('bufferedFields').concat(this.get('instaSaveFields'));
	}.property(),


	// # If we update a field that has been specified as one of the
	// # bufferedFields or instaSaveFields write these to a buffer
	// # instead of the actual attribute and save.
	setUnknownProperty: function(key, value) {
		if (this.get('bufferedFields').contains(key)) {
			this.get('_buffers').set(key, value);
			return this._debouncedSave();
		} else if (this.get('instaSaveFields').contains(key)) {
			this._super(key, value);
			return this._save();
		} else {
			return this._super(key, value);
		}
	},

	// Pull properties from the buffer if they have been set there.
	// This is like the getter for our buffer or the model
	unknownProperty: function(key) {
		if (this.get('_allFields').contains(key) && this.get('_buffers').get(key)) {
			return this.get('_buffers').get(key);
		} else {
			return this._super(key);
		}
	},

	_save: function() {
		var _this = this;
		var object = this.get('content')
		if (!this.get('content.isSaving')) {
			console.log( "App.AutosavableController::_save: Saving Changes...");

			//Start pacifier
			NProgress.set(0).start()

			//any buffered changes we have made get rolled into this save
			this.get('_buffers').forEach(function(key, value) {
				return _this.get('content').set(key, value);
			});

			//now clear out our buffer.
			this.set('_buffers', Ember.Map.create());

			// Callback method and Observers to stop pacifier
			var progressDone = function(object){
				NProgress.done()
			}
			object.on("didCreate", progressDone)
			object.on("didUpdate", progressDone)

			return object.save();
		} else {
			return this._debouncedSave();
		}
	},

	_debouncedSave: function(immediate){
		console.log("App.AutosavableController::_debouncedSave: Save requestsed and scheduled: ", AUTOSAVE_DELAY)
		Ember.run.debounce(this, this._save, AUTOSAVE_DELAY, immediate)
	},

	// When the model is about to change out from under the controller we must
	// immediately save any pending changes and clear out the _buffers.
	_saveNowAndClear: function() {
		console.log("App.AutosavableController::_saveNowAndClear: clearing...")
		if (!this.get('content') || this.get('content.isDeleted')) {
			return;
		}
		// FOR NOW, call immediate save because there is some bug in the immediate argument of Ember.run.debounce
		this._save();
		// TODO, use this once it works right...
		// this._debouncedSave(true);
		return this.set('_buffers', Ember.Map.create());
	}.observesBefore('content'),

	// ACTIONS kick off decorated methods from our views
	actions: {
		save: function(){
			// FOR NOW, call immediate save because there is some bug in the immediate argument of Ember.run.debounce
			this._save();
			// TODO, use this once it works right...
			// this._debouncedSave(true);
		},
	},
});