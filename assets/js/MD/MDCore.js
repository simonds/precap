/*

This file has the following sections: 
	- The MD Global Object - Establishing/Extending
	- Extending Global Objects
	- Global Utility Functions




*/
/* ///////////////////////////////////////////////////////////////
   The MD Global Object - Establishing/Extending
*/////////////////////////////////////////////////////////////////
var MD = MD || {}; 

// Global toggle system for debug console messaging...
MD.Debug = true;

// Prevent evil browsers that don't support 'console' from bombing...
if (typeof console === 'undefined' || MD.Debug == false) {
	window.console = {};
	console.log = console.info = console.warn = console.group = console.groupEnd = console.error = function(){};
}
if (!MD.Debug) {
	window.onerror = function(message, url, line)  {
	    return true;
	};
}

// Generic function for setting the contents of a container. Accepts 'string', 'element', 'array', 'elements', and 'object' types.
MD.setContent = function(content, container, contentProperties) {
	if (content || content === '') {
		switch (typeOf(content)){
			case 'string':
				if (contentProperties) {
					container.grab(new Element('span', Object.merge(contentProperties,{html: content})));
				} else {
					container.grab(new Element('span', {html: content}));
				}
				break;
			case 'element': 
				if (contentProperties) {
					container.grab(content.setProperties(contentProperties));
				} else {
					container.grab(content);
				}
				break;
			case 'array':
			case 'elements':
				content.each(function(el) {
					MD.setContent(el, container, contentProperties);
				});
				break;
			case 'object':
				if (content.content) {
					MD.setContent(content.content, container, (content.properties || contentProperties));
				} else {
					console.error('Cannot set content. ".content" property is not valid:', content);
				}
				break;
			default: console.error('Cannot set content. Content type ('+typeOf(content)+') is not valid:', content);
		}
	} else {
		console.error('No content passed to MD.setContent. Arguments:',arguments);
	}
};

// Timer functions for testing/debugging/optimization
MD.startTimer = function(){
	var timerID = String.uniqueID();
	var timerStartTime = new Date();
	var thisTimer = {
		id: timerID
		,startTime: timerStartTime
	};

	MD.timers = (MD.timers || []);
	MD.timers.push(thisTimer);
	return thisTimer;
};
MD.stopTimer = function(timer){
	var timerReturn = {};
	if (!timer || !MD.timers) {
		timerReturn = null;
	} else {
		var eraseIndex = null;
		MD.timers.each(function(t, index) {
			if (t.id == timer.id) {
				timerReturn = t;
				var timerEndTime = new Date();
				// t.stopTime = timerReturn.stopTime = timerEndTime;
				t.elapsedTime = timerReturn.elapsedTime = t.startTime.diff(timerEndTime, 'ms');
				eraseIndex = index;
			} else {
				// timerReturn.stopTime = null;
				timerReturn.elaspedTime = -1;
			}
		});
		if (eraseIndex != null) MD.timers.splice(eraseIndex,1);
	}
	return timerReturn.elaspedTime;
};

MD.getComputedStyles = function(element) {
	return (document.defaultView && document.defaultView.getComputedStyle)
		? document.defaultView.getComputedStyle(element, null)
		: element.currentStyle;
};

MD.foldable = function(trigger, foldableElement, options) {
	if (!(trigger && foldableElement)) {
		console.error('Cannot setup foldable. Check your parameters.');
		return;
	} else {
		// default options:
		var _options = {
			openClass: 'Open'
			,closedClass: 'Closed'
			,reveal: {
				duration: 140	
			}
			,onShow: function() {}
			,onHide: function() {}
		};
		// if we have options passed, merge them in
		if (options) {
			_options = Object.merge(_options, options);
		}
		// move the events into the reveal object
		if (_options.onShow) {
			_options.reveal.onShow = _options.onShow;
			delete _options.onShow;
		}
		if (_options.onHide) {
			_options.reveal.onHide = _options.onHide;
			delete _options.onHide;
		}
		if (_options.onComplete) {
			_options.reveal.onComplete = _options.onComplete;
			delete _options.onComplete;
		}
		// setup Fx.Reveal instance
		var fx = new Fx.Reveal(foldableElement, _options.reveal);
		// set up elements
		foldableElement.addClass(_options.openClass);
		trigger.addEvent('click', function(){
			if (foldableElement.hasClass(_options.openClass)) {
				foldableElement.removeClass(_options.openClass);
				foldableElement.addClass(_options.closedClass);
				trigger.removeClass(_options.openClass);
				trigger.addClass(_options.closedClass);
				fx.dissolve();
			} else {
				foldableElement.addClass(_options.openClass);
				foldableElement.removeClass(_options.closedClass);
				trigger.addClass(_options.openClass);
				trigger.removeClass(_options.closedClass);
				fx.reveal();
			}
		});
	}
};

// isScrollable
(function(MD, $) {
	//based on jquery plugin
	// http://erraticdev.blogspot.com/2011/02/jquery-scroll-into-view-plugin-with.html

	var converter = {
		vertical: { x: false, y: true },
		horizontal: { x: true, y: false },
		both: { x: true, y: true },
		x: { x: true, y: false },
		y: { x: false, y: true }
	};

	var scrollValue = {
		auto: true,
		scroll: true,
		visible: false,
		hidden: false
	};

	var rootrx = /^(?:html)$/i;

	MD.isScrollable = function(element, direction, context) {
		if ( ! element) {
			return false;
		}

		context = context || window;
		direction = converter[typeOf(direction) === 'string' && direction.toLowerCase()] || converter.both;
		var styles = MD.getComputedStyles(element);

		var overflow = {
			x: scrollValue[styles.overflowX.toLowerCase()] || false,
			y: scrollValue[styles.overflowY.toLowerCase()] || false,
			isRoot: rootrx.test(element.nodeName)
		};

		// check if completely unscrollable (exclude HTML element because it's special)
		if ( !overflow.x && !overflow.y && !overflow.isRoot)
		{
			return false;
		}

		var size = {
			height: {
				scroll: element.scrollHeight,
				client: element.clientHeight
			},
			width: {
				scroll: element.scrollWidth,
				client: element.clientWidth
			},
			// check overflow.x/y because iPad (and possibly other tablets) don't display scrollbars
			scrollableX: function () {
				return (overflow.x || overflow.isRoot) && this.width.scroll > this.width.client;
			},
			scrollableY: function () {
				return (overflow.y || overflow.isRoot) && this.height.scroll > this.height.client;
			}
		};
		return direction.y && size.scrollableY() || direction.x && size.scrollableX();
	};

}(MD, document.id));

(function(MD) {
	var properties = {
		position: 'absolute'
		,visibility: 'hidden'
		,display: 'block'
	};

	MD.getDimensions = function(element) {
		var previous = {};

		for (var key in properties) {
			previous[key] = element.style[key];
			element.style[key] = properties[key];
		}

		var result = {
			width: element.offsetWidth
			,height: element.offsetHeight
		};

		for (key in properties) {
			element.style[key] = previous[key];
		}

		return result;
	};
}(MD));

/* ///////////////////////////////////////////////////////////////
   Extending Native Objects
*/////////////////////////////////////////////////////////////////

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
// Array Unique-ify-er
Array.prototype.unique = function() {
	var o = {}, i, l = this.length, r = [];
	for(i=0; i<l;i+=1) o[this[i]] = this[i];
	for(i in o) r.push(o[i]);
	return r;
};
// Array SortBy - for sorting an array of objects, BY a given property of the objects. -- inspired by: http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
Array.prototype.sortBy = function(property, order) {
	var r = [];
	if (order) {
		if (order == ('asc' || 'ascending')) {
			r = this.sort(function (a,b) {
		        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		    });
		} else if (order == ('dsc' || 'descending')) {
			r = this.sort(function (a,b) {
		        return (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
		    });
		}
		return r;
	} else {
		r = this.sort(function (a,b) {
	        return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	    });
		return r;
	}
};
Array.prototype.pluck = function(propertyKey) {
	var i, l = this.length, r = [];
	for(i=0; i<l;i+=1) {
		if (typeof this[i] == 'object') r.push(this[i][propertyKey]);
	};
	return r;
};


// A 'hashchange' event to give MooTools support for this event. 
Element.Events.hashchange = {
    onAdd: function(){
        var hash = self.location.hash;

        var hashchange = function(){
            if (hash == self.location.hash) return;
            else hash = self.location.hash;

            var value = (hash.indexOf('#') == 0 ? hash.substr(1) : hash);
            window.fireEvent('hashchange', value);
            document.fireEvent('hashchange', value);
        };

        if ("onhashchange" in window){
            window.onhashchange = hashchange;
        } else {
            hashchange.periodical(50);
        }
    }
};


window._sdsClickOutAttach = document;
// A 'clickout' event that can be assigned to elements, which is fired when any OTHER element is clicked.
(function($){
	var events;
	var check = function(e){
		var target = $(e.target);
		var parents = target.getParents();
		events.each(function(item){
			var element = item.element;
			if (element != target && !parents.contains(element)) {
				item.fn.call(element, e);
			}
		});
	};
	Element.Events.clickout = {
		onAdd: function(fn){
			if(!events) {
				window._sdsClickOutAttach.addEvent('click', check);
				window._sdsClickOutAttach.addEvent('touchend', check);

				events = [];
			}
			events.push({element: this, fn: fn});
		},
		onRemove: function(fn){
			events = events.filter(function(item){
				return item.element != this || item.fn != fn;
			}, this);
			if (!events.length) {
				window._sdsClickOutAttach.removeEvent('click', check);
				window._sdsClickOutAttach.removeEvent('touchend', check);
				events = null;
			}
		}
	};
})(document.id);

// Modifies the .highlight() MooTools method to include a 'pauseLength' parameter... so that it doesn't happen so bloody fast.
Element.implement({
	highlight: function(start, end, pauseLength, cssProperty){
		cssProperty = (cssProperty ? cssProperty : 'background-color'); 

		if (pauseLength == '') {
			pauseLength = 0;
		}
		if (!end){
			end = this.retrieve('highlight:original', this.getStyle(cssProperty));
			end = (end == 'transparent' ? '#fff' : end);
		}
		var tween = this.get('tween');
		tween.start(cssProperty, start || '#ffff88').chain(
			function(){
				(function(){this.tween(cssProperty, end);}.bind(this)).delay(pauseLength);
			}.bind(this)
			,function(){
				this.setStyle(cssProperty, this.retrieve('highlight:original'));
			}.bind(this)
		);
		return this;
	}
	// MooTools bug fix for IE.
	,getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];
		var defaultView = this.getDocument().defaultView;
		var computed = defaultView && defaultView.getComputedStyle(this, null);
		return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
	}
});

// To make sure requests never get cached
Request.implement({options: {noCache: true}});

/* A nice parser for being able to handle TIME values from SQL...
    To use the following:
    var someTime = Date.parseSqlTime('14:00:00');     <--- passing in a [time] string from SQL
    // someTime is now '2:30PM'  */
Date.parseSqlTime = function(sqlTime){
	return new Date(Date.parse(sqlTime)).format('%l:%M%p');
};
Date.parseSqlDateTime = function(dateAndTime, format) { // dateAndTime must be formatted like this 2012-04-01T12:00:00
	format = format || '%b %e, %Y';
	if (dateAndTime.contains('T')) {
		var date = new Date(Date.parse(dateAndTime.split('T')[0])).format(format);
		var time = 	dateAndTime.split('T')[1].contains('.')
					? dateAndTime.split('T')[1].split('.')[0]
					: dateAndTime.split('T')[1];

		time = new Date(Date.parse(time)).format('%l:%M%p');
		return {date: date, time: time};
	} else {
		return 'Date input not formated correctly.';
	}
};

/*
script: String.Inflections.js
name: String Inflections
author:
  - Ryan Florence
requires: 
  - Core:1.2.4/String
  - Core:1.2.4/Number
provides: 
  - String.camelize			"active_record".camelize(2); --> "ActiveRecord"  ...  "post_category".camelize(true); --> "postCategory"
  - String.classify 		"egg_and_hams".classify(); --> "EggAndHam"  ....  "posts".classify(); --> "Post"
  - String.dasherize		"puni_puni".dasherize(); --> "puni-puni"  ...  "puni puni".dasherize(); --> "puni-puni"
  - String.foreign_key		"Message".foreign_key(); // "message_id"  ...  "Message".foreign_key(false); // "messageid"
  - String.humanize			"employee_salary".humanize(); // "Employee salary"  ...  "author_id".humanize(); // "Author"
  - String.ordinalize		"1".ordinalize(); // "1st"  ...  "3".ordinalize(); // "3rd"  ...  "24".ordinalize(); // "24th"
  - String.pluralize		"post".pluralize(); // "posts"  ...  "sheep".pluralize(); // "sheep"  ...  "matrix".pluralize(); // "matrices"
  - String.singularize		"posts".singularize(); // "post"  ...  "octopi".singularize(); // "octopus"  ...  "CamelOctopi".singularize(); // "CamelOctopus"
  - String.tableize			"RawScaledScorer".tableize(); // "raw_scaled_scorers"  ...  "egg_and_ham".tableize(); // "egg_and_hams"  ...  "fancyCategory".tableize(); // "fancy_categories"
  - String.titleize			"man from the boondocks".titleize(); // "Man From the Boondocks"  ...  "x-men: the last stand".titleize(); // "X Men: The Last Stand"
  - String.underscore		"ActiveRecord".underscore(); // "active_record"
  - String.capitalizeFirst	"hello my name is Simon".capitalizeFirst(); // "Hello my name is Simon"
  - String.lowercaseFirst	"Hello my name is Simon".lowercaseFirst(); // "hello my name is Simon"
  - Number.ordinalize		1.ordinalize(); // "1st"  ...  3.ordinalize(); // "3rd"  ...  24.ordinalize(); // "24th"
  - String.decamelize		"SomethingCamelCase".decamelize() // "Something Camel Case" */
(function(){

var plurals = [
	[/(quiz)$/i,               '$1zes'  ],
	[/^(ox)$/i,                '$1en'   ],
	[/([m|l])ouse$/i,          '$1ice'  ],
	[/(matr|vert|ind)ix|ex$/i, '$1ices' ],
	[/(x|ch|ss|sh)$/i,         '$1es'   ],
	[/([^aeiouy]|qu)y$/i,      '$1ies'  ],
	[/(hive)$/i,               '$1s'    ],
	[/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
	[/sis$/i,                  'ses'    ],
	[/([ti])um$/i,             '$1a'    ],
	[/(buffal|tomat)o$/i,      '$1oes'  ],
	[/(bu)s$/i,                '$1ses'  ],
	[/(alias|status)$/i,       '$1es'   ],
	[/(octop|vir)us$/i,        '$1i'    ],
	[/(ax|test)is$/i,          '$1es'   ],
	[/s$/i,                    's'      ],
	[/$/,                      's'      ]
]
,singulars = [
	[/(database)s$/i,                                                  '$1'     ],
	[/(quiz)zes$/i,                                                    '$1'     ],
	[/(matr)ices$/i,                                                   '$1ix'   ],
	[/(vert|ind)ices$/i,                                               '$1ex'   ],
	[/^(ox)en/i,                                                       '$1'     ],
	[/(alias|status)es$/i,                                             '$1'     ],
	[/(octop|vir)i$/i,                                                 '$1us'   ],
	[/(cris|ax|test)es$/i,                                             '$1is'   ],
	[/(shoe)s$/i,                                                      '$1'     ],
	[/(o)es$/i,                                                        '$1'     ],
	[/(bus)es$/i,                                                      '$1'     ],
	[/([m|l])ice$/i,                                                   '$1ouse' ],
	[/(x|ch|ss|sh)es$/i,                                               '$1'     ],
	[/(m)ovies$/i,                                                     '$1ovie' ],
	[/(s)eries$/i,                                                     '$1eries'],
	[/([^aeiouy]|qu)ies$/i,                                            '$1y'    ],
	[/([lr])ves$/i,                                                    '$1f'    ],
	[/(tive)s$/i,                                                      '$1'     ],
	[/(hive)s$/i,                                                      '$1'     ],
	[/([^f])ves$/i,                                                    '$1fe'   ],
	[/(^analy)ses$/i,                                                  '$1sis'  ],
	[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis'],
	[/([ti])a$/i,                                                      '$1um'   ],
	[/(n)ews$/i,                                                       '$1ews'  ],
	[/s$/i,                                                            ''       ]
]
,irregulars = [
	['cow',    'kine'    ],
	['move',   'moves'   ],
	['sex',    'sexes'   ],
	['child',  'children'],
	['man',    'men'     ],
	['person', 'people'  ]
]
,uncountables = [
	'sheep',
	'fish',
	'series',
	'species',
	'money',
	'rice',
	'information',
	'equipment',
	'jeans'
];

MD.Acronyms	= {
	// tests
	'Cogat': 'CogAt'
	,'Dape': 'DAPE'
	,'Derp': 'DEPR'
	,'Dra': 'DRA'
	,'Drp': 'DRP'
	,'Eoc': 'EOC'
	,'Hf': 'HF'
	,'Hsp': 'HSP'
	,'Hspb': 'HSPB'
	,'Hspe': 'HSPE'
	,'Mc': 'MC'
	,'M.c': 'M.C'
	,'Msp': 'MSP'
	,'Sa': 'SA'
	,'Mspb': 'MSPB'
	,'Wasl': 'WASL'
	,'Waslb': 'WASLB'
	,'Welpa': 'WELPA'
	,'Mba': 'MBA'
	,'Dcs': 'DCS'
	,'Cls': 'CLS'
	,'Wrc': 'WRC'
	,'Nwf': 'NWF'
	,'Lnf': 'LNF'
	,'Lsf': 'LSF'
	,'Grk': 'GrK'
	,'Dorf': 'DORF'
	,'Dibels': 'DIBELS'
	,'Eld': 'ELD'
	,'Bb': 'BB'
	,'Ms': 'MS'
	,'Xc': 'XC'
	,'Coe': 'COE'
	,'Sat': 'SAT'
	,'Act': 'ACT'
	,'Sat': 'SAT'
	,'Act': 'ACT'
	,'Psat': 'PSAT'
	,'Wlpt': 'WLPT'
	// words
	,'And' : 'and'
	,'Gpa': 'GPA'
	// roman numerals
	,'Ii': 'II'
	,'Iii': 'III'
	,'Iv': 'IV'
	,'Vi': 'VI'
	,'Vii': 'VII'
	,'Viii': 'VIII'
	,'Ix': 'IX'
	// roman numerals with dashes
	,'I-i': 'I-I'
	,'I-ii': 'I-II'
	,'I-iii': 'I-III'
	,'Ii-i': 'II-I'
	,'Ii-ii': 'II-II'
	,'Ii-iii': 'II-III'
	,'Iii-i': 'III-I'
	,'Iii-ii': 'III-II'
	,'Iii-iii': 'III-III'
	,'Iv-i': 'IV-I'
	,'Iv-ii': 'IV-II'
	,'Iv-iii': 'IV-III'
};

Number.implement({
	// just for consistancy
	cleanFloat: function() {
		return (this + "").cleanFloat().toFloat();
	}
});

String.implement({

	camelize: function(lower) {
		var str = this.replace(/_\D/g,
		function(match) {
			return match.charAt(1).toUpperCase();
		});
		return (lower) ? str: str.capitalize();
	},

	classify: function(lower) {
		// modified by Ben and Nick
		return this.replace(/\s/g, '_').camelize(lower);
	},

	dasherize: function() {
		return this.replace('_', '-').replace(/ +/, '-');
	},

	foreign_key: function(dontUnderScoreId) {
		return this.underscore() + (dontUnderScoreId ? 'id': '_id');
	},


	humanize: function() {
		return this.replace(/_id$/, '').replace(/_/gi, ' ').capitalizeFirst();
	},

	ordinalize: function() {
		var parsed = parseInt(this, 10);
		if (11 <= parsed % 100 && parsed % 100 <= 13) {
			return this + "th";
		} else {
			switch (parsed % 10) {
			case 1:
				return this + "st";
			case 2:
				return this + "nd";
			case 3:
				return this + "rd";
			default:
				return this + "th";
			}
		}
	},

	pluralize: function(count) {
		if (count && parseInt(count) == 1) return this;
		for (var i = 0; i < uncountables.length; i++) {
			var uncountable = uncountables[i];
			if (this.toLowerCase() == uncountable) {
				return uncountable;
			}
		}
		for (var i = 0; i < irregulars.length; i++) {
			var singular = irregulars[i][0];
			var plural = irregulars[i][1];
			if ((this.toLowerCase() == singular) || (this == plural)) {
				return plural;
			}
		}
		for (var i = 0; i < plurals.length; i++) {
			var regex = plurals[i][0];
			var replace_string = plurals[i][1];
			if (regex.test(this)) {
				return this.replace(regex, replace_string);
			}
		}
	},

	singularize: function() {
		for (var i = 0; i < uncountables.length; i++) {
			var uncountable = uncountables[i];
			if (this.toLowerCase() == uncountable) {
				return uncountable;
			}
		}
		for (var i = 0; i < irregulars.length; i++) {
			var singular = irregulars[i][0];
			var plural = irregulars[i][1];
			if ((this.toLowerCase() == singular) || (this == plural)) {
				return singular;
			}
		}
		for (var i = 0; i < singulars.length; i++) {
			var regex = singulars[i][0];
			var replace_string = singulars[i][1];
			if (regex.test(this)) {
				return this.replace(regex, replace_string);
			}
		}
	},

	tableize: function() {
		return this.underscore().pluralize();
	},

	titleize: function() {
		return this.toLowerCase().replace(/[^(\s|\-)]+/g,		// tokenize
		function(match) {
			match = match.capitalizeFirst();
			return MD.Acronyms[match] || match;
		});
	},

	underscore: function() {
		var temp = this.replace('-', '_').replace(/\B[A-Z](?=[a-z])/g,
		function(match) {
			return ('_' + match.charAt(0));
		});
		temp = temp.reverse().replace(/[A-Z](?=[a-z])/g,
		function(match) {
			return (match.charAt(0) + '_');
		}).reverse();
		return temp;
	},

	capitalizeFirst: function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	},

	lowercaseFirst: function() {
		return this.charAt(0).toLowerCase() + this.slice(1);
	}

	// added by Ben :)
	,decamelize: function() {
		return this.underscore().humanize().titleize();
	}

	,reverse: function() {
		return this.split('').reverse().join('');
	}

	,cleanFloat: function() {
		// turns 1.23400 into 1.234  ; turns 12300 in 12300 ; turns 1. into 1
		return this.indexOf('.') !== -1  ?
			this.replace(/0*$/g, '').replace(/\.$/g, '')
			: this;
	}
});

Number.implement({
	ordinalize: function(){
		return this + ''.ordinalize();
	}
});

})();
/* END - String.Inflections.js */




/* ///////////////////////////////////////////////////////////////
   Global Utility Functions
*/////////////////////////////////////////////////////////////////

/* A utility function for determining the width of the scrollbars within the viewing environment */
function getBrowserScrollBarWidth() {
	var innerElement = new Element('p', {styles: {width:'100%', height:200}});
	var outerElement = new Element('div', {
		styles: {
			position:'absolute'
			,top:0
			,left:0
			,visibility: 'hidden'
			,width:200
			,height:150
			,overflow:'hidden'
		}
	});
	// strange WebKit hack because we use "fancy" custom WebKit scrollbars...
	if (Browser.safari || Browser.chrome) {
		outerElement.setStyle('opacity', 0);
		outerElement.setStyle('visibility', 'visible');
	}

	var docBody = $$('body')[0];
	docBody.grab(outerElement.grab(innerElement));

	var w1 = outerElement.clientWidth;
	outerElement.setStyle('overflow', 'scroll');
	var w2 = outerElement.clientWidth;
	outerElement.destroy();

	return (w1 - w2);
}


if (Browser.ie8) {
	Class.refactor(Fx.Reveal, {
		reveal: function() {
			if (!this.showing && !this.hiding){
				if (this.element.getStyle('display') == 'none'){

					this.element.show();

					this.fireEvent('show', this.element);
				} else {
					this.callChain();
					this.fireEvent('complete', this.element);
					this.fireEvent('show', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.reveal.bind(this));
			} else if (this.options.link == 'cancel' && !this.showing){
				this.cancel();
				this.reveal();
			}
			return this;
		}
		,dissolve: function() {
			if (!this.hiding && !this.showing){
				if (this.element.getStyle('display') != 'none'){

					this.element.hide();
					
					this.fireEvent('hide', this.element);
				} else {
					this.callChain.delay(10, this);
					this.fireEvent('complete', this.element);
					this.fireEvent('hide', this.element);
				}
			} else if (this.options.link == 'chain'){
				this.chain(this.dissolve.bind(this));
			} else if (this.options.link == 'cancel' && !this.hiding){
				this.cancel();
				this.dissolve();
			}
			return this;
		}
	});

	Class.refactor(Fx.Tween, {
		start: function(property, from, to) {
			if (!this.check(property, from, to)) return this;
			var args = Array.flatten(arguments);
			this.property = this.options.property || args.shift();
			var parsed = this.prepare(this.element, this.property, args);

			this.duration = 0;

			return this.parent(parsed.to, parsed.to);
		}
	});

	Class.refactor(Fx.Morph, {
		start: function(properties) {
			if (!this.check(properties)) return this;
			if (typeof properties == 'string') properties = this.search(properties);
			var from = {}, to = {};
			for (var p in properties){
				var parsed = this.prepare(this.element, p, properties[p]);
				from[p] = parsed.from;
				to[p] = parsed.to;
			}

			this.options.duration = 0;

			return this.parent(to, to);
		}
	});

	Class.refactor(Fx.Scroll, {
		start: function(x, y){
			if (!this.check(x, y)) return this;
			var scroll = this.element.getScroll();

			this.duration = 0;

			return this.parent([x, y], [x, y]);
		}
	});

	Class.refactor(Mask, {
		initialize: function(target, options){
			this.target = document.id(target) || document.id(document.body);
			this.target.store('mask', this);
			// damn ie causing problems by not having the target be a mootools element.... not sure why
			this.target = $(this.target);
			this.setOptions(options);
			this.render();
			this.inject();
		}
	});

	Class.refactor(Sortables, {
		addItems: function(){
			Array.flatten(arguments).each(function(element){
				this.elements.push($(element));
				var start = element.retrieve('sortables:start', function(event){
					this.start.call(this, event, element);
				}.bind(this));
				(this.options.handle ? element.getElement(this.options.handle) || element : element).addEvent('mousedown', start);
			}, this);
			return this;
		}
		,removeItems: function(){
			return $$(Array.flatten(arguments).map(function(element){
				this.elements.erase($(element));
				var start = element.retrieve('sortables:start');
				(this.options.handle ? element.getElement(this.options.handle) || element : element).removeEvent('mousedown', start);

				return element;
			}, this));
		}
	});
}

