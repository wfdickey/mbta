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

// When clicked,
$("#small-screen-selector dd").off().on('click', function(event) {
    event.preventDefault();

    var self = $(this);

   // if active, hide tab content and remove active class 
   if ($(this).hasClass("active")) {

    // This is bad
    setTimeout(function () {
      self.removeClass("active");

    
      // get href from a within this <dd>
      var href = self.find("a").attr("href");

      $(href).removeClass("active");

    }, 1);
   }

});

$(".accordian-tab").click(function(){
    $(this).toggleClass("dark");
})


$("#searchInput").keyup(function () {
    //split the current value of searchInput
    var data = this.value.split(" ");
    //create a jquery object of the rows
    var jo = $("#fbody").find("tr");
    if (this.value == "") {
        jo.show();
        return;
    }
    //hide all the rows
    jo.hide();

    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
        var $t = $(this);
        for (var d = 0; d < data.length; ++d) {
            if ($t.is(":contains('" + data[d] + "')")) {
                return true;
            }
        }
        return false;
    })
    //show the rows that match.
    .show();
}).focus(function () {
    this.value = "";
    $(this).css({
        "color": "black"
    });
    $(this).unbind('focus');
}).css({
    "color": "#C0C0C0"
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
        ],
        ['<div class="info-content">' +
            '<h4>Cheese Station</h4>' + '<p>F4</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ],
        ['<div class="info-content">' +
            '<h4>Wills Wharf</h4>' + '<p>F2H</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
            '</div>'
        ],
        ['<div class="info-content">' +
            '<h4>The Spot</h4>' + '<p>83</p>' + '<a href="#">Schedule</a>' + '<br>' + '<a href="#">Plan Trip</a>' +
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
        'name': 'Charles Dock',
        'latitude': 42.3657324,
        'longitude': -71.2018986,
        'image': 'img/boatsmall.svg',
        'type': 'boat'
    },  {
        'name': 'Cheese Station',
        'latitude': 42.3721899,
        'longitude': -71.2170311,
        'image': 'img/subwaysmall.svg',
        'type': 'subway'
    }, {
        'name': 'Wills Wharf',
        'latitude': 42.362411,
        'longitude': -71.2155507,
        'image': 'img/boatsmall.svg',
        'type': 'boat'
    }, {
        'name': 'The Spot',
        'latitude': 42.369411,
        'longitude': -71.2185507,
        'image': 'img/bussmall.svg',
        'type': 'bus'
    }, 
    {
        'name': 'You',
        'latitude': 42.3681125,
        'longitude': -71.2074732,
        'type': 'permanent'
    }
    ];

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
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });


}