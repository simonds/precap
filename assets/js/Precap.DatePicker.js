var Precap = Precap || {};

Precap.DatePicker = new Class({
    Extends: Picker.Date

    ,Implements: [Options, Events]

    ,options: {
        presetValue: ''
        ,pickerClass: 'Precap-DatePicker DatePicker'
        ,animationDuration: 140
        ,months_abbr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        ,days_title: function(date, options){
            return date.format('%B %Y');
        }
        ,draggable: false
        ,startDay: 0
        ,dateDisplayStringMod: function(dateObj){
            return moment(dateObj).format('MMMM Do YYYY');
        }
    }

    ,initialize: function(element, options){
        this.setOptions(options);

        var presetValue = (
            this.options.presetValue 
            ? this.options.presetValue
            : element.get('html')
        );

        // element is our NON-input toggle element
        this.options.toggle = element;
        // the hidden 'input' element - because Picker.Date is hell-bent on needing one. 
        var attachToInput = new Element('input', {value: presetValue});
            attachToInput.hide();
        element.grab(attachToInput, 'after');

        // Upon selection, set our trigger's text to the date
        this.addEvent('select', function(date){
            this.options.toggle.set('html', this.options.dateDisplayStringMod(date));
        }.bind(this));

        this.parent(attachToInput, this.options);
    }
});