App.MapView = Ember.ContainerView.extend({
    id: 'map_canvas'
    ,tagName: 'div'
    ,classNames: 'MapContainer'
    ,map: null
    ,isHidden: Ember.computed.alias('controller.isHidden')
    ,classNameBindings: ['isHidden']

    ,didInsertElement: function() {
        var mapData = this.get('context')
            ,mapLatlng = new google.maps.LatLng(mapData.latitude,mapData.longitude)
            ,mapOptions = {
                center: mapLatlng
                ,zoom: 14
                ,mapTypeId: google.maps.MapTypeId.ROADMAP
                ,scrollwheel: false
                ,draggable: true
            }
            ,map = new google.maps.Map(this.$().get(0),mapOptions)
            ,markerOptions = {
                draggable:false
                ,animation: google.maps.Animation.DROP
                ,position: mapLatlng
                ,map: map
                ,title: mapData.name
            }
            ,marker = new google.maps.Marker(markerOptions);

        marker.setMap(map);
        this.set('map', map);
        this.set('marker', marker);

        var infoContent = '<h2>'+mapData.name+'</h2><div><a href="https://maps.google.com/maps?saddr=current+location&daddr='+mapData.address+'&hl=en&sll='+mapData.latitude+','+mapData.longitude+'" target="_blank">Get Directions</a></div>'
            ,infoWindow = new google.maps.InfoWindow({
                content: infoContent
            });
        this.set('infoWindow', infoWindow);

        var _this = this;
        google.maps.event.addListener(marker, 'click', function() {
            var infoWindow = _this.get('infoWindow')
                ,map = _this.get('map')
                ,marker = _this.get('marker');
            infoWindow.open(map, marker);
        });
    }
});