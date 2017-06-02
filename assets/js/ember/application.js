var Ember = Ember || null;
var App = App || null;
var DS = DS || null;
var moment = moment || null;
var Howl = Howl || null;

// ScrollTo Function (that works with easing functions  )
$.fn.scrollTo = function(target, options, callback){
    if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
    var settings = $.extend({
        scrollTarget: target
        ,offset: 0
        ,direction: 'Top' // can be "Top" or "Left"
        ,animateOptions: {
            duration: 500   
            ,easing: 'swing'
        }
    }, options);
    return this.each(function(){
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollVal = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset()[options.direction.toLowerCase()] + scrollPane['scroll'+options.direction]() - parseInt(settings.offset);
        var animateProps = {};
            animateProps['scroll'+options.direction] = scrollVal;
        var animateOpts = $.extend(settings.animateOptions, {
            complete: function(){
                if (typeof callback == 'function') { callback.call(this); }
            }
        });
        
        scrollPane.animate(animateProps, settings.animateOptions);
    });
};

window._defaults = {
    location: {
        type: 'Location'
        ,name: 'A New Location'
        ,address: ''
        ,latitude: null
        ,longitude: null
    }
    ,group: {
        type: 'Group'
        ,name: 'A New Group'
    }
    ,list: {
        type: 'List'
        ,name: 'A New List'
    }
    ,listItem: {
        completed: false
        , text: ''
    }
    ,note: {
        type: 'Note'
        ,name: 'A New Note'
        ,body: null
    }
    ,timeline: {
        type: 'Timeline'
        ,name: 'A New Timeline'
        ,date: null
        ,items: []
    }
    ,timelineItem: {
        startTime: null
        ,endTime: null
        ,text: ''
    }
    ,photoset: {
        type: 'Photoset'
        ,name: 'A New Photoset'
    }
    ,photoItem: {
        caption: ''
        ,sizes: {
            original: {
                width: 0
                ,height: 0
                ,url: ''
            }
            ,square_165: {
                width: 165
                ,height: 165
                ,url: ''
            }
            ,max_900: {
                width: 900
                ,height: 900
                ,url: ''
            }
        }
    }
    ,fileset: {
        type: 'Fileset'
        ,name: 'A New Fileset'
    }
    ,fileItem: {
        filename: ''
        ,url: ''
        ,ext: ''
    }
};

/***************************

 █████╗ ██████╗ ██████╗ ██╗     ██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║     ██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
███████║██████╔╝██████╔╝██║     ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
██╔══██║██╔═══╝ ██╔═══╝ ██║     ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
██║  ██║██║     ██║     ███████╗██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

***************************/

App = Ember.Application.create({
    LOG_TRANSITIONS: false
});

App.ApplicationAdapter = DS.SailsSocketAdapter.extend({
    modelNameMap: {
      Precap: 'precap'
      ,Contact: 'contact'
      ,User: 'user'
    }
});

App.ApplicationSerializer = DS.JSONSerializer.extend({
  extractArray: function(store, type, arrayPayload) {
    var serializer = this;
    return Ember.ArrayPolyfills.map.call(arrayPayload, function(singlePayload) {
      return serializer.extractSingle(store, type, singlePayload);
    });
  },
  serializeIntoHash: function(hash, type, record, options) {
    Ember.merge(hash, this.serialize(record, options));
  }
});

App.RawTransform = DS.Transform.extend({
    deserialize: function(serialized) {
        return Ember.isNone(serialized) ? {} : serialized;
    },
    serialize: function(deserialized) {
        return Ember.isNone(deserialized) ? {} : deserialized;
    }
});

filepicker.setKey('AOkSBYOLvTqK3GzWzQMOuz');




/**
 * |-----------------|
 * | jQuery-Clickout |
 * |-----------------|
 *  jQuery-Clickout is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Elements">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 *
 * @requires jQuery
 */

(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory($);
  }

})(function ($){
  'use strict';

     /**
      * A static counter is tied to the doc element to track click-out registration
      * @static
      */
  var counter = 0,

     /**
      * On mobile Touch browsers, 'click' are not triggered on every element.
      * Touchstart is.
      * @static
      */
      click = window.Touch ? 'touchstart' : 'click';


  /**
   * Shortcut for .on('clickout')
   *
   * @param data
   * @param fn
   */

  $.fn.clickout = function(data, fn) {
    if (!fn) {
      fn = data;
      data = null;
    }

    if (arguments.length > 0) {
      this.on('clickout', data, fn);
    } else {
      return this.trigger('clickout');
    }

  };

  /**
   * Implements the 'special' jQuery event interface
   * Native way to add non-conventional events
   */
  jQuery.event.special.clickout = {

    /**
     * When the event is added
     * @param handleObj Event handler
     */

    add: function(handleObj){
      counter++;

      // Add counter to element
      var target = handleObj.selector
          ? $(this).find(handleObj.selector)
          : $(this);
      target.attr('data-clickout', counter);

      // When the click is inside, extend the Event object to mark it as so
      $(this).on(click + '.clickout' + counter, handleObj.selector, function(e){
        e.originalEvent.clickin = $(this).attr('data-clickout');
      });

      // Bind a click event to the document, to be cought after bubbling
      $(document).bind(click + '.clickout' + counter, (function(id){
      // A closure is used create a static id
        return function(e){
          // If the click is not inside the element, call the callback
          if (!e.originalEvent.clickin || e.originalEvent.clickin !== id) {
            handleObj.handler.apply(this, arguments);
          }
        };
      })(counter));
    },

    /**
     * When the event is removed
     * @param handleObj Event handler
     */
    remove: function(handleObj) {
      var target = handleObj.selector
          ? $(this).find(handleObj.selector)
          : $(this)
        , id = target.attr('data-clickout');

      target.removeAttr('data-clickout');

      $(document).unbind(click + '.clickout' + id);
      $(this).off(click + '.clickout' + id, handleObj.selector);
      return false;
    }
  };

  return $;

});
