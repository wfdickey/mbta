$(document).foundation();

var markersArray = [];
var map;

$(".sub-nav dd").click(function () {
    var buttonToggle = $(this);

    buttonToggle.siblings('.active').removeClass('active');
    buttonToggle.addClass('active');
    console.log(buttonToggle.data("type"));

    clearOverlays();
    checkMarkers(map, buttonToggle.data("type"));
});



jQuery(function ($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++) {
        if (markersArray[i].type != "permanent") {
            markersArray[i].setMap(null);
        }
    }
}


// Display multiple markers on a map
var infoWindow;

function drawMarkers(thisMarker, i) {
    var position = new google.maps.LatLng(thisMarker.latitude, thisMarker.longitude);

    marker = new google.maps.Marker({
        position: position,
        map: map,
        title: thisMarker.name,
        icon: thisMarker.image,
        type: thisMarker.type
    });

    markersArray.push(marker);

    // Allow each marker to have an info window    
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
            infoWindow.setContent(infoWindowContent[i][0]);
            infoWindow.open(map, marker);
        }
    })(marker, i));

    // Info Window Content
    var infoWindowContent = [
        ['<div class="info-content">' +
            '<h4>Russos Station</h4>' + '<p>83, 84, 100</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ],
        ['<div class="info-content">' +
            '<h4>Soil Station</h4>' + '<img src="img/smallredblock.svg"/>' + '<br>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ],
        ['<div class="info-content">' +
            '<h4>Grove Station</h4>' + '<p>Fairmount Line</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ],
        ['<div class="info-content">' +
            '<h4>Charles Dock</h4>' + '<p>F4</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ]
    ];

    infoWindow = new google.maps.InfoWindow(), marker, i;
}

function checkMarkers(map, type) {
    var bounds = new google.maps.LatLngBounds();

    // Multiple Markers
    var markers = [{
        'name': 'Russos Station',
        'latitude': 42.3666582,
        'longitude': -71.2140624,
        'image': 'img/bussmall.svg',
        'type': 'bus'
    }, {
        'name': 'Soil Station',
        'latitude': 42.3664128,
        'longitude': -71.2053169,
        'image': 'img/subwaysmall.svg',
        'type': 'subway'
    }, {
        'name': 'Grove Station',
        'latitude': 42.3711899,
        'longitude': -71.2120311,
        'image': 'img/trainsmall.svg',
        'type': 'train'
    }, {
        'name': 'Charles Station',
        'latitude': 42.3657324,
        'longitude': -71.2018986,
        'image': 'img/boatsmall.svg',
        'type': 'boat'
    }, {
        'name': 'You',
        'latitude': 42.3681125,
        'longitude': -71.2074732,
        'type': 'permanent'
    }];

    // Loop through our array of markers & place each one on the map  
    for (i = 0; i < markers.length; i++) {

        var position = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
        bounds.extend(position);

        if (typeof type == 'undefined') {

            drawMarkers(markers[i], i);

        } else {
            if (type == markers[i].type) {
                drawMarkers(markers[i], i);
            }
        }


        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
}

function initialize() {
    var mapOptions = {
        mapTypeId: 'roadmap'
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setTilt(45);


    checkMarkers(map);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
        this.setZoom(15);
        google.maps.event.removeListener(boundsListener);
    });


}