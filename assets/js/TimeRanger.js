var TimeRanger = new Class({

	Implements: [Options,Events]

	,options: {
		trigger: null
		,className: ''
		,startTime: null 		// [string]	24hr format required: '14:30'
		,endTime: null			// [string]	24hr format required: '15:00'
		,defaultRange: 60		// [num] IN MINUTES
		,pointTo: null			// [element] || [element id string] 
		,clickOutToClose: true
		,closeOnDone: true
		,keyResetDelay: 1500	// [num] In milliseconds. How long before you can 'restart typing'
		,pointToOffset: null
		// ,onDone: function(timeRangeObject){}
	}

	,initialize: function(options){
		this.setOptions(options);
		this._documentBody = $$('body')[0];
		this._values = {};

		// set defaults
		if (this.options.startTime) {
			this._setValues('start', this.options.startTime);
		} else {
			this._setValues('start', (moment().format('H').toInt()+1).toString()+':00');
		}
		if (this.options.endTime) {
			this._setValues('end', this.options.endTime);
		} else {
			this._setValues('end', this._values.start.hr24+(this.options.defaultRange/60)+':00');
		}

		this._build();
		this.activate();
	}

	,_getHrAmPm: function(hrNum){
		return (hrNum.toInt() >= 12 ? 'PM' : 'AM');
	}

	,_get12HourHour: function(hr){
		hr = hr.toInt();
		var r;
		if (hr > 23) {
			r = 'invalid';
		} else 
		if (hr == 12) {
			r = hr;
		} else 
		if (hr > 12) {
			r = hr-12;
		} else 
		if (hr == 0) {
			r = 12;
		} else {
			r = hr;
		}
		return r;
	}

	,_adjustForAmPm: function(hr, min, ampm){
		// this adjusts a given time RELATIVE TO a given ampm value.
		var time = '';
		var hr = hr.toInt();
		ampm = ampm.toUpperCase();
		if (ampm == 'AM') {
			if (hr == 12) {
				time = '00:'+min;
			} else if (hr < 12) {
				time = hr+':'+min;
			} else if (hr > 12) {
				time = (hr-12)+':'+min;
			}
		} else if (ampm == 'PM') {
			if (hr == 12) {
				time = hr+':'+min;
			} else if (hr < 12) {
				time = (hr+12)+':'+min;
			} else if (hr > 12) {
				time = hr+':'+min;
			}
		}
		return time;
	}

	,_setValues: function(which, time){
		// 'which' --> 'start' || 'end'
		// 'time' --> '16:20'

		var min = time.split(':')[1];
		var hr24 = time.split(':')[0].toInt();
		var ampm = this._getHrAmPm(hr24);
		var hr12 = (function(){
			if (hr24 == 0) {
				return 12;
			} else if (hr24 > 12) {
				return hr24-12;	
			} else if (true) {
				return hr24;
			}
		})();

		if (hr24 < 10 && (hr24.toString().charAt(0) != '0')) {
			hr24 = '0'+hr24;
		}

		this._values[which] = {
			time12: hr12+':'+min+' '+ampm
			,time24: hr24+':'+min
			,hr12: hr12
			,hr24: hr24
			,min: min
			,ampm: ampm
		};
	}

	,_getValues: function(){
		return this._values;
	}

	,_switchAmPmValues: function(which, ampm){
		// first let's get what we've got...
		var values = this._getValues()[which];
		ampm = ampm.toUpperCase();
		if (values.ampm != ampm) {
			if (ampm == 'AM') {
				values.hr24 = values.hr24-12;
				if (values.hr24 < 10) {
					values.hr24 = '0'+values.hr24;
				}
			} else if (ampm == 'PM') {
				values.hr24 = values.hr24+12;
			}
			if (values.hr24 == 0) {
				values.hr24 == 00;
			}
			values.ampm = this._getHrAmPm(values.hr24);
			values.time12 = values.hr12+':'+values.min+' '+values.ampm
			values.time24 = values.hr24+':'+values.min;
		}
	}

	,getTimeRange: function(twelveHour){
		return [this.getStartTime(twelveHour), this.getEndTime(twelveHour)];
	}

	,getStartTime: function(twelveHour){
		return this._values.start[(twelveHour ? 'time12' : 'time24')];
	}

	,getEndTime: function(twelveHour){
		return this._values.end[(twelveHour ? 'time12' : 'time24')];
	}

	,setStartTime: function(time){
		// 'time' format: '16:20'
		this._setValues('start', time || this._values.start.time24);
		this._updateTimebox('start');
		this._updateTimeButtons();
		return this;
	}

	,setEndTime: function(time){
		// 'time' format: '16:20'
		this._setValues('end', time || this._values.end.time24);
		this._updateTimebox('end');
		this._updateTimeButtons();
		return this;
	}

	,setTimes: function(startTime, endTime){
		// startTime, endTime formats: '16:20'
		this.setStartTime(startTime);
		this.setEndTime(endTime);
		return this;
	}

	,setActiveHr: function(n){
		this._activeHr = n.toInt();
		this.fireEvent('activeHr:set', this._activeHr);
		return this;
	}

	,setActiveMin: function(n){
		this._activeMin = (n.toString().length == 1 ? '0'+n : n);
		this.fireEvent('activeMin:set', this._activeMin);
		return this;
	}

	,getActiveHr: function(twelveHour){
		return (twelveHour ? this._get12HourHour(this._activeHr) : this._activeHr);
	}

	,getActiveMin: function(){
		return this._activeMin;
	}

	,getActiveAmPm: function(){
		return this._values[this.getActiveTimebox().which].ampm;
	}

	,getActiveTimebox: function(){
		return this._activeTimebox;
	}

	,activate: function(){
		this._setupEvents();

		this.activateTimebox('start');

		this.setTimes();

		this._isActive = true;

		return this;
	}

	,deactivate: function(){
		this._stopKeyInterval();
		Object.each(this._keyFunctionMap, function(value, key){
			Mousetrap.unbind(key);
		}, this);
		this._isActive = false;
		return this;
	}

	,activateTimebox: function(which){
		var timebox = this[which+'Timebox'];

		// CSS classes
		this.endTimebox.element.removeClass('Active');
		this.startTimebox.element.removeClass('Active');
		timebox.element.addClass('Active');

		this._activeTimebox = timebox;
		this._activeHr = this._values[which].hr24;
		this._activeMin = this._values[which].min;
		this._keyReset();
		this._updateTimeButtons();
		return this;
	}

	,deactivateTimebox: function(which){
		var timebox = this[which+'Timebox'];
		timebox.element.removeClass('Active');
		timebox.am.deactivate();
		timebox.pm.deactivate();
		return this;
	}

	,_updateTimebox: function(which){
		// set the timebox value
		var timebox = this[which+'Timebox'];

		timebox.setHour(this._values[which].hr12);
		timebox.setMin(this._values[which].min);
		timebox.setAmPm(this._values[which].ampm);
		this.fireEvent(which+'TimeChanged', this['get'+which.capitalize()+'Time']());
		return this;
	}

	,_updateTimeButtons: function(){
		// turn off hour buttons first
		Object.each(this._hoursButtons, function(i){i.deactivate();});

		// activate the hour with the 12-hr version of the active timebox's hour
		this._hoursButtons[this.getActiveHr(true)].activate();

		// turn off minutes buttons
		Object.each(this._minutesButtons, function(i){i.deactivate();});

		var min = this.getActiveMin().toInt();
		if (this._minutesArray.contains(min)) {
			this._minutesButtons[min].activate();
		}
	}

	,updatePosition: function(positionObject){
		// positionObject e.g., {x:123, y:234}

		// figure out a way to reuse this... 
		// this._morphToPosition.start({
		// 	opacity: [0,1]
		// 	,left: [this._centerPoint.left+15 , this._centerPoint.left-28]
		// 	,top: this._centerPoint.top
		// });
	}

	,_setupEvents: function(){
		// startTimebox
		this.addEvent('startTimebox:clicked', function(){
			this.activateStartTimebox();
		}.bind(this));

		// endTimebox
		this.addEvent('endTimebox:clicked', function(){
			this.activateEndTimebox();
		}.bind(this));

		// hour:changed
		this.addEvent('hour:changed', function(num){
			var activeTimebox = this.getActiveTimebox();
			var adjustedTime = this._adjustForAmPm(num, this.getActiveMin(), this.getActiveAmPm());
			this._setValues(activeTimebox.which, adjustedTime);
			this._updateTimebox(this.getActiveTimebox().which);
			this._updateTimeButtons();
		}.bind(this));

		// min:changed
		this.addEvent('min:changed', function(num){
			var activeTimebox = this.getActiveTimebox();
			var adjustedTime = this._adjustForAmPm(this.getActiveHr(), num, this.getActiveAmPm());
			this._setValues(activeTimebox.which, adjustedTime);
			this._updateTimebox(this.getActiveTimebox().which);
			this._updateTimeButtons();
		}.bind(this));

		// activeHr:set
		this.addEvent('activeHr:set', function(h){
			this.fireEvent('hour:changed', h);
		}.bind(this));

		// activeMin:set
		this.addEvent('activeMin:set', function(m){
			this.fireEvent('min:changed', m);
		}.bind(this));

		// am:clicked
		this.addEvent('am:clicked', function(which){
			this._switchAmPmValues(which, 'AM');
			// this._setValues(which, this.getActiveHr()+':'+this.getActiveMin());
			this._updateTimebox(which);
		}.bind(this));

		// pm:clicked
		this.addEvent('pm:clicked', function(which){
			this._switchAmPmValues(which, 'PM');
			// this._setValues(which, this.getActiveHr()+':'+this.getActiveMin());
			this._updateTimebox(which);
		}.bind(this));

		// done
		this.addEvent('done:clicked', function(){
			var returnedTime = {
				range: this.getTimeRange()
				,startTime: this.getStartTime()
				,startTime12: this.getStartTime(true)
				,endTime: this.getEndTime()
				,endTime12: this.getEndTime(true)
			}
			this.fireEvent('done', [returnedTime, this]);
			if (this.options.closeOnDone) {
				this.hide();
			}
		}.bind(this));
	}

	,_build: function(){
		this._id = String.uniqueID();
		this._html = new Element('div', {
			'class':'TimeRanger'+(this.options.className ? ' '+this.options.className : '')
			,id: this._id
			,styles:{
				position:'absolute'
				,opacity:0
				,display: 'none'
			}
			,tween: {duration: 140}
		}).grab(
			new Element('div.Inner').adopt(
				this._left = new Element('div.LeftColumn').adopt(
					this._timesContainer = new Element('div.TimesContainer').adopt(
						this._startTimeContainer = new Element('div.Start.Time').adopt(
							new Element('label', {html:'Start'})
							,this._buildTimebox('start')
						)
						,this._endTimeContainer = new Element('div.End.Time').adopt(
							new Element('label', {html:'End'})
							,this._buildTimebox('end')
						)
					)
					,this._doneButton = new Precap.Button({
						text: 'Done'
						,className: 'Done'
						,active: true
						,size: 'Xlarge'
						,onClick: function(e){
							e.stop();
							this.fireEvent('done:clicked');
						}.bind(this)
					})
				)
				,this._right = new Element('div.RightColumn').adopt(
					this._numbersContainer = new Element('div.NumbersContainer').adopt(
						this._hoursList = new Element('ul.Hours')
						,this._minutesList = new Element('ul.Minutes')
					)
				)
			)
		);

		// Build the hours buttons
		this._hoursButtons = {};
		this._hoursArray = [7,8,9,10,11,12,1,2,3,4,5,6];
		this._hoursArray.each(function(n){
			var button = new Precap.Button({
				text: n.toString()
				,textOnly: true
				,onClick: function(e){
					this.setActiveHr(n);
				}.bind(this)
			});

			this._hoursList.grab(new Element('li.Hour-'+n).grab(button));

			this._hoursButtons[n] = button;
		}, this);

		// Build the minutes buttons
		this._minutesButtons = {};
		this._minutesArray = [0,5,10,15,20,25,30,35,40,45,50,55];
		this._minutesArray.each(function(n){
			var numStr = n.toString();
			if (n == 0 || n == 5) {
				numStr = '0'+n.toString();
			}
			var button = new Precap.Button({
				text: numStr.toString()
				,textOnly: true
				,onClick: function(e){
					this.setActiveMin(n);
				}.bind(this)
			});

			this._minutesList.grab(new Element('li.Min-'+numStr).grab(button));

			this._minutesButtons[n] = button;
		}, this);
	}

	,_buildTimebox: function(which){
		var timebox = {};
		timebox.element = new Element('div.Timebox').adopt(
			timebox.hour = new Element('span.Hour')
			,timebox.dots = new Element('span.Dots', {html: ':'})
			,timebox.min = new Element('span.Min')
			,new Element('div.AMPMWrapper').grab(
				timebox.amPmContainer = new Element('div.AMPMContainer').adopt(
					timebox.am = new Precap.Button({
						text: 'AM'
						,className: 'AM'
						,title: 'Choose AM'
						,textOnly: true
						,onClick: function(){
							this.fireEvent('am:clicked', which);
						}.bind(this)
					})
					,timebox.pm = new Precap.Button({
						text: 'PM'
						,className: 'PM'
						,title: 'Choose PM'
						,textOnly: true
						,onClick: function(){
							this.fireEvent('pm:clicked', which);
						}.bind(this)
					})
				)
			)
		);
		timebox.element.addEvent('click', function(){
			this.activateTimebox(which);
		}.bind(this));
		timebox.setHour = function(num){
			timebox.hour.set('html', num);
		}.bind(this);
		timebox.setMin = function(num){
			timebox.min.set('html', num);
		}.bind(this);
		timebox.setAmPm = function(ampm){
			switch(ampm.toUpperCase()) {
				case 'AM': 
					timebox.pm.deactivate();
					timebox.am.activate();
					break;				
				case 'PM': 
					timebox.am.deactivate();
					timebox.pm.activate();
					break;				
			};
		};
		timebox.which = which;
		this[which+'Timebox'] = timebox;
		return this[which+'Timebox'].element;
	}

	,_keyReset: function(){
		if (this._nKeys) this._nKeys.empty();
		this._stopKeyInterval();
	}

	,_stopKeyInterval: function(){
		if (this._keyInterval) clearInterval(this._keyInterval);
	}

	,_startKeyInterval: function(){
		if (this._keyInterval) {
			clearInterval(this._keyInterval);
		}
		this._keyInterval = setInterval(this._keyReset.bind(this), this.options.keyResetDelay);
	}

	,_setTimeWithKeys: function(key){
		var box = this.getActiveTimebox();

		if (this._nKeys.length == 4) {
			this._nKeys.shift();
		}
		this._nKeys.push(key);
		// console.log('this._nKeys', this._nKeys);
		if (this._nKeys.length > 1) {
			var firstTwo = (this._nKeys[0].toString()+this._nKeys[1].toString()).toInt();
		}
		switch(this._nKeys.length) {
			case 1:
				this.setActiveHr(this._nKeys[0]);
				this.setActiveMin('00');
				break;
			case 2:
				if (this._nKeys[1].toInt() > 5) {
					this.setActiveHr(this._nKeys[0]);
					return;
				}
				if (firstTwo > 12) {
					this.setActiveHr(this._nKeys[0]);
					this.setActiveMin(this._nKeys[1].toString()+'0');
				} else if (firstTwo == 12 || firstTwo == 11 || firstTwo == 10) {
					this.setActiveHr(firstTwo);
					this.setActiveMin('00');
				} else {
					this.setActiveHr(this._nKeys[0].toString()+this._nKeys[1].toString());
				}
				break;
			case 3:
				if (firstTwo > 12) {
					this.setActiveHr(this._nKeys[0].toString());
					this.setActiveMin(this._nKeys[1].toString()+this._nKeys[2].toString());
				} else {
					this.setActiveHr(this._nKeys[0].toString()+this._nKeys[1].toString());
					this.setActiveMin(this._nKeys[2].toString()+'0');
				}
				break;
			case 4:
				if (firstTwo > 12) {
					this.setActiveHr(this._nKeys[0].toString());
					this.setActiveMin(this._nKeys[1].toString()+this._nKeys[2].toString());
				} else {				
					this.setActiveHr(this._nKeys[0].toString()+this._nKeys[1].toString());
					this.setActiveMin(this._nKeys[2].toString()+this._nKeys[3].toString());
				}
				break;
		}
		this._startKeyInterval();
	}

	,_activateKeys: function(){
		this._nKeys = this._nKeys || [];

		this._keyFunctionMap = {
			enter: function(e){
				e.preventDefault();
				this.fireEvent('done:clicked');
			}.bind(this)
			,'shift+tab': function(e){
				e.preventDefault();
				if (this.getActiveTimebox().which == 'start') {
					this.activateTimebox('end');
				} else {
					this.activateTimebox('start');
				}
			}
			,tab: function(e){
				e.preventDefault();
				if (this.getActiveTimebox().which == 'start') {
					this.activateTimebox('end');
				} else {
					this.activateTimebox('start');
				}
			}.bind(this)
			,a: function(e){
				e.preventDefault();
				this.fireEvent('am:clicked', this.getActiveTimebox().which);
			}.bind(this)
			,p: function(e){
				e.preventDefault();
				this.fireEvent('pm:clicked', this.getActiveTimebox().which);
			}.bind(this)
			,esc: function(e){
				e.preventDefault();
				this.hide();
			}.bind(this)
		};
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].each(function(n){
			this._keyFunctionMap[n] = function(e, key){
				e.preventDefault();
				this._setTimeWithKeys(key);
			}.bind(this);
		}, this);
		Mousetrap.bind(this._keyFunctionMap);
	}

	,show: function(pointToElement, onShowFunc){
		this._activateKeys();

		if (!this._documentBody.getElement('.TimeRanger')) {
			this._documentBody.grab(this._html);
			this._firstTime = 1;
		} else {
			delete this._firstTime;
		}
		this._html.show();
		// clickout 
		if (this.options.clickOutToClose) {
			if (!this._clickoutFunction) {
				this._clickoutFunction = function() {
					try {
						this.hide();
					}
					catch(error){
						console.error(error);
					}
				}.bind(this);
			}

			this._html.addEvent('clickout', this._clickoutFunction);
		}

		this.activateTimebox('start');

		this._windowCoordinates = window.getCoordinates();
		this._htmlDimensions = this._html.getDimensions();

		if (!pointToElement) {
			// Do this later. :) 
		} else {
			this._pointTo = pointToElement || document.id(this.options.pointTo);
			this._offset = this.options.pointToOffset || {x:0, y:0};

			if (!this._pointTo) {
				console.log('No pointTo element provided');
				return;
			}

			// Set up morph FX instance...
			this._morphToPosition = this._morphToPosition || new Fx.Morph(this._html, {
				duration: 250
				,transition: Fx.Transitions.Quart.easeOut
				,onComplete: function(){
					// this.activateTimebox('start');
					if (onShowFunc) {
						onShowFunc.call(this, this);
					}
				}.bind(this)
			});

			// Get coordinates of the element we are pointing to...
			this._pointToPosition = this._pointTo.getCoordinates();

			// If we DO NOT have position and edge values...
			if (this.options.position == null || this.options.edge == null) {
				// Predict the direction the popover should go based on proximity to the edge of the viewport.
				this._popDirection = '';
				this._popPosition = '';
				this._popEdge = '';
				var closeToRight = (this._windowCoordinates.right - this._pointToPosition.right) <= this._htmlDimensions.x+50;
				var closeToLeft = (this._windowCoordinates.left - this._pointToPosition.left) <= this._htmlDimensions.x+50;
				// if it's a div that takes up the full width...
				if (closeToRight && closeToLeft) {
					this._popDirection = 'Right';
					this._popPosition = 'centerLeft';
					this._popEdge = 'centerLeft';
				} else if (closeToRight) {
					this._popDirection = 'Left';
					this._popPosition = 'centerLeft';
					this._popEdge = 'centerRight';
				} else if (closeToLeft) {
					this._popDirection = 'Right';
					this._popPosition = 'centerRight';
					this._popEdge = 'centerLeft';
				}

				this._html.removeClass('Left').removeClass('Right').addClass(this._popDirection);

				// now, put it where it belongs...
				this._centerPoint = this._html.position({
					relativeTo: this._pointTo
					,position: this._popPosition
					,edge: this._popEdge
					,offset: this._offset
					,returnPos: true
				});

				if (this._firstTime) {
					this._html.setStyles({
						visibility: 'visible'
						,left: this._centerPoint.left
						,top: this._centerPoint.top
					});
				}
				if (this._popDirection == 'Right') {
					this._morphToPosition.start({
						opacity: 1 //[0,1]
						,left: this._centerPoint.left+28
						// ,left: [this._centerPoint.left-35, this._centerPoint.left+28]
						,top: this._centerPoint.top
					});
				} else if (this._popDirection == 'Left') {
					this._morphToPosition.start({
						opacity: [0,1]
						,left: [this._centerPoint.left+15 , this._centerPoint.left-28]
						,top: this._centerPoint.top
					});
				}
			} 
			// This is irrelevant for now:
			// else {
			// 	this._centerPoint = this._html.position({
			// 		relativeTo: this._pointTo
			// 		,position: this.options.position
			// 		,edge: this.options.edge
			// 		,offset: this._offset
			// 		,returnPos: true
			// 	});

			// 	// topLeft || upperLeft
			// 	var edge = this.options.edge.toLowerCase();
			// 	if ((edge.test('top') || edge.test('upper')) && edge.test('left')) {
			// 		this._html.addClass('Bottom');
			// 	} else 
			// 	// bottomLeft || lowerLeft
			// 	if ((edge.test('bottom') || edge.test('lower')) && edge.test('left')) {
			// 		this._html.addClass('Top');
			// 	} else 
			// 	// topRight || upperRight
			// 	if ((edge.test('top') || edge.test('upper')) && edge.test('right')) {
			// 		this._html.addClass('Bottom');
			// 	} else 
			// 	// bottomRight || lowerRight
			// 	if ((edge.test('bottom') || edge.test('lower')) && edge.test('right')) {
			// 		this._html.addClass('Top');
			// 	} 
			// 	// if the 'edge' is centered
			// 	if (edge.test('center')) {
			// 		if (this.options.position.toLowerCase() == 'center') {
			// 		}
			// 		if (edge.test('top') || edge.test('upper')) {
			// 			this._html.addClass('Bottom');
			// 		} else if (edge.test('bottom')) {
			// 			this._html.addClass('Top');
			// 		} else if (edge.test('left')) {
			// 			this._html.addClass('Right');
			// 		} else if (edge.test('right')) {
			// 			this._html.addClass('Left');
			// 		}
			// 	}

			// 	this._html.setStyles({
			// 		display: 'block'
			// 		,left: this._centerPoint.left
			// 		,top: this._centerPoint.top+((this.options.edge.test('top') || this.options.edge.test('upper')) ? -15 : 15)
			// 	});
			// 	if (edge == 'center' && this.options.position.toLowerCase() == 'center') {
			// 		this._html.fade('in');
			// 	} else {
			// 		if (this.options.positionFx == false) {
			// 			this._morphToPosition.set({
			// 				opacity: 1
			// 				,visibility: 'visible'
			// 				,left: this._centerPoint.left
			// 				,top: this._centerPoint.top
			// 			});
			// 		} else {
			// 			this._morphToPosition.start({
			// 				opacity: [0,1]
			// 				,visibility: 'visible'
			// 				,left: this._centerPoint.left
			// 				,top: [this._centerPoint.top+((this.options.edge.test('top') || this.options.edge.test('upper')) ? -15 : 15), this._centerPoint.top]
			// 			});
			// 		}
			// 	}
			// }
		}

		this.fireEvent('show', this);
	}

	,hide: function(){
		this.deactivate();
		this._html.tween('opacity', 0);
		this._html.removeEvent('clickout', this._clickoutFunction);
		(function(){
			this._html.setStyles({
				 display: 'none'
				,opacity: '0'
			});
			// this._html.destroy();
			// delete window.activeTimeRanger;
		}.bind(this)).delay(400);
		this.fireEvent('hide', this);
	}

	,toElement: function(){
		return this._html;
	}
});

Element.implement({
	timeranger: function(options){
		var el = this;

		var timeRanger = new TimeRanger(options);
		el.addEvent('click', function(e){
			e.stop();
			timeRanger.show(this);
		});

		el.store('TimeRanger', timeRanger);
		return this;
	}
});
