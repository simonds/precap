
Precap.Section.Location = new Class({
    Extends: Precap.Section.Base

    ,Implements: [Options,Events]

    ,options: {}

    ,initialize: function(data, options, doc){
        this.setOptions(options);
        this.parent(data, options, doc);

        var google = window.google || null;
        if (google) {
            google.maps.visualRefresh = true;
        }

        this._getContentContainer().adopt(
            this._buildContent()
            ,this._buildContentFooter()
        );

        // standalone (for testing)
        if (!doc) {
            this.loadMap();
        }

        if (google) {
            this._setupAutocomplete();
        }
        if (!this._data.gPlace) {
            this.hideMap();
        }
    }

    ,_getDefaultData: function(){
        var data = {
            type: 'Location'
            ,name: 'A New Location'
        };
        return data;
    }



    // BUILDS
    ,_buildContent: function() {
        this._locationBody = new Element('div.LocationMap').adopt(
            this._mapContainer = new Element('div.MapContainer', {reveal: {duration: 200}})
        );
        return this._locationBody;
    }

    ,_buildHeader: function() {
        /* This overwrites the _buildHeader in Section/Base.js */
        this._title = new EditableText(this._data.name, {
            tag: 'h2'
            ,className: 'SectionTitle'
            ,allowLineBreaks: false
            ,returnHTML: false
            ,deactivateOn: 'enter'
            ,onDeactivate: function(editable, hasChanged){
                this.save();
            }.bind(this)
        });

        this._header = new Element('header').adopt(
            this._title
            ,this._locationDetail = new Element('input', {
                type: 'text'
                ,placeholder: (this._data.gPlace ? this._data.gPlace.formatted_address : 'Type an address for this location')
                ,'class': 'LocationAddress'+(this._data.gPlace ? ' Populated' : ' Instructive')
            })
        );
        return this._header;
    }

    ,_buildContentFooter: function(){
        this._contentFooter = new Element('div.ContentFooter').adopt(
            new Element('div.Right').grab(
                this._hideShowTrigger = new Precap.Button({
                    title: 'Toggle the visibility of this map'
                    ,text: 'Hide Map'
                    ,className: 'Instructive HideShow'
                    ,textOnly: true
                    ,onClick: function(e, button){
                        if (button.getText() == 'Hide Map') {
                            this.hideMap();
                        } else {
                            this.showMap();
                        }
                    }.bind(this)
                })
            )
        );

        return this._contentFooter;
    }           



    // MAP
    ,setupMap: function(){

    }

    ,_setupAutocomplete: function() {
        // Setup autocomplete field
        if (google && google.maps && google.maps.places) {
            var autocomplete = new google.maps.places.Autocomplete(this._locationDetail, {
                bounds: this._mapBounds
            });
            // add listener...
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var placeJSON = JSON.encode(place);
                // console.log('new place', place);
                // console.log('place JSON', placeJSON);
                if (!place.geometry) {
                    // Inform the user that a place was not found and return.
                    alert('Not found');
                    return;
                }
                this._locationDetail.removeClass('Instructive');
                this._prepNewMapData(place);
                this.loadMap(null, 1);
            }.bind(this));
        }
    }

    ,loadMap: function(mapOptions, saveOnLoad) {
        var google = window.google || null;
        if (!google || !google.maps || !google.maps.LatLng) {
            console.error('Maps cannot be loaded at this time.');
            return;
        }

        var showDelay = 0;
        if (!this.mapIsVisible()) {
            showDelay = 500;
            this.showMap();
        }

        (function(){
            this._map = new google.maps.Map(this._mapContainer, this._prepMapOptions(mapOptions));

            var markerOptions = {
                draggable:true
                ,animation: google.maps.Animation.DROP
                ,position: this._getMapCoords()
                ,map: this._map
                ,title: this._data.name
            };

            this._mapMarker = new google.maps.Marker(markerOptions);

            var infoContent = '';
                infoContent += '<h2>'+this._data.name+'</h2>';
                infoContent += '<div><a href="https://maps.google.com/maps?saddr=current+location&daddr='+this._data.gPlace.formatted_address+'&hl=en&sll='+this._data.gPlace.geometry.location.ob+','+this._data.gPlace.geometry.location.pb+'" target="_blank">Get Directions</a></div>';
            this._infoWindow = new google.maps.InfoWindow({
                content: infoContent
            });

            google.maps.event.addListener(this._mapMarker, 'click', function() {
                this._infoWindow.open(this._map, this._mapMarker);
            }.bind(this));
            google.maps.event.addListener(this._mapMarker, 'dragend', function() {
                var pos = this._mapMarker.getPosition();
                this._setMarkerLatLng(pos.lat(), pos.lng());
                this.save();
            }.bind(this));
            // google.maps.event.addListenerOnce(this._map, 'bounds_changed', function() {
            //  this._mapBounds = this._map.getBounds();
            //  this._setupAutocomplete();
            // }.bind(this));

            if (saveOnLoad) this.save();
        }.bind(this)).delay(showDelay);

        return this;
    }

    ,showMap: function(){
        this._hideShowTrigger.setText('Hide Map');
        this._mapContainer.reveal();
        this._mapIsHidden = false;
    }

    ,hideMap: function(){
        this._hideShowTrigger.setText('Show Map');
        this._mapContainer.dissolve();
        this._mapIsHidden = true;
    }

    ,mapIsVisible: function(){
        return !this._mapIsHidden;
    }

    ,_prepNewMapData: function(place) {
        delete this._data.gPlace;
        delete this._data.storedLat;
        delete this._data.storedLng;

        this._data.gPlace = place;
        this._data.storedLat = this._data.gPlace.geometry.location.lat();
        this._data.storedLng = this._data.gPlace.geometry.location.lng();
    }

    ,_prepMapOptions: function(data) {
        data = data || this._data;
        this._mapLatLng = new google.maps.LatLng(
            (this._data.storedLat || data.gPlace.geometry.location.lat())
            ,(this._data.storedLng || data.gPlace.geometry.location.lng())
        );
        var options = {
            center: this._mapLatLng
            ,zoom: 14
            ,mapTypeId: google.maps.MapTypeId.ROADMAP
            ,scrollwheel: false
        };
        return options;
    }

    ,_getMapCoords: function() {
        return this._mapLatLng;
    }

    ,_setMarkerLatLng: function(lat, lng){
        this._data.storedLat = lat;
        this._data.storedLng = lng;
    }

    // OTHER
    ,save: function() {
        this._data.name = this._title.getValue();

        this.parent();
    }

    ,toElement: function() {
        return this._html;
    }
});