var Precap = Precap || {}; 

// Global toggle system for debug console messaging...
Precap.Debug = true;

if (typeof console === 'undefined' || Precap.Debug == false) {
	window.console = {};
	console.log = console.info = console.warn = console.group = console.groupEnd = console.error = function(){};
}
if (!Precap.Debug) {
	window.onerror = function(message, url, line)  {
		return true;
	};
}

// Generic function for setting the contents of a container. Accepts 'string', 'element', 'array', 'elements', and 'object' types.
Precap.setContent = function(content, container, contentProperties) {
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
					Precap.setContent(el, container, contentProperties);
				});
				break;
			case 'object':
				if (content.content) {
					Precap.setContent(content.content, container, (content.properties || contentProperties));
				} else {
					console.error('Cannot set content. ".content" property is not valid:', content);
				}
				break;
			default: console.error('Cannot set content. Content type ('+typeOf(content)+') is not valid:', content);
		}
	} else {
		console.error('No content passed to Precap.setContent. Arguments:',arguments);
	}
};

/* ///////////////////////////////////////////////////////////////
   Extending Native Objects
*/////////////////////////////////////////////////////////////////

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
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

Array.prototype.getObjectByProperty = function(property, value){
	var i, l = this.length, o = {};
	for(i=0; i<l;i+=1) {
		if (typeof this[i] == 'object') {
			if (this[i][property] == value) {
				o = this[i];
				break;
			}
		}
	};
	return o;
};


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
				document.addEvent('click', check);
				document.addEvent('touchend', check);

				events = [];
			}
			events.push({element: this, fn: fn});
		},
		onRemove: function(fn){
			events = events.filter(function(item){
				return item.element != this || item.fn != fn;
			}, this);
			if (!events.length) {
				document.removeEvent('click', check);
				document.removeEvent('touchend', check);
				events = null;
			}
		}
	};
})(document.id);

// To make sure requests never get cached
// Request.implement({options: {noCache: false}});



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
			return match;
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
function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

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

