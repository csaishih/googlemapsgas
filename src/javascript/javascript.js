function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
     
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.8488551, lng: -79.3405793},
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    
    var onChangeHandler = function() {
        if (document.getElementById('start').value != '' && document.getElementById('end').value != '') {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 43.8488551, lng: -79.3405793},
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
            directionsDisplay.set(map);  
            calculateAndDisplayRoute(directionsService, directionsDisplay, map);
        }
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, map) {
  directionsService.route({  
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    // origin: '5020 Fairwind Drive',
    // destination: '15 Coleriane Avenue, Markham, ON',
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: true,
    avoidTolls: true,
    drivingOptions: {
        departureTime: new Date(),
        trafficModel: google.maps.TrafficModel.PESSIMISTIC
    }
  }, function(response, status) {
        console.log(response);
        var gallonsUsed = 0;
        if (status === google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = response.routes.length; i < len; i++) {
                var gallonsUsed = 0;
                console.log(' ');
                console.log("Route: " + i);
                response.routes[i].legs[0].steps.forEach(function(step) {
                    var mph = convertToMPH(step.distance.value / step.duration.value);
                    var fuelEconomy = 23.5;
                    var mpg = convertToMPG(mph,fuelEconomy);
                    var gallons = convertMetersToMiles(step.distance.value) / mpg;
                    gallonsUsed += gallons;
                });
                // set var rand = Math.random()*0.6;  in order to generate random traffic value which will add idle gas consumption.
                var rand = 0;
                var info = document.createElement("div");
                console.log((response.routes[i].legs[0].duration.value/60),(rand+1));
                document.getElementById('info-panel').appendChild(info);
                info.className = 'info';
                info.innerHTML = '<div class="distance">' + response.routes[i].legs[0].distance.text + '</div><div class="duration">' + ((response.routes[i].legs[0].duration.value/60)*(rand+1)).toFixed(2) + '</div><div class="liters">' + (gallonsToLiters(gallonsUsed)+((response.routes[i].legs[0].duration.value/60)*(rand)*0.000333)).toFixed(3) + 'L</div><div class="cost">$' + ((gallonsToLiters(gallonsUsed)+((response.routes[i].legs[0].duration.value/60)*(rand)*0.000333)) * 0.989).toFixed(2) + '</div>';
                console.log(response.routes[i].legs[0].distance);
                console.log(response.routes[i].legs[0].duration);
                console.log('Liters used: ' + gallonsToLiters(gallonsUsed));
                console.log('$' + gallonsToLiters(gallonsUsed) * 0.989);
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    routeIndex: i
                });
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
  });
}

function convertToMPH(x) {
    return 2.23694 * x;
}

function convertToMPG(x, mpg) {
    return (0.00000004*Math.pow(x,5) - 0.00001*Math.pow(x,4) + 0.001*Math.pow(x,3) - 0.0576*Math.pow(x,2) + 1.8094*x + 5.0267)*(mpg/30);
}

function convertMetersToMiles(x) {
    return 0.000621371 * x;
}

function gallonsToLiters(x) {
    return 3.78541 * x;
}

function generateTraffic (timeToTravel){
  // Provided by Google API
  var trafficInMins = timeToTravel*((Math.random()*0.6));
  var fuelUsedInLitres = 0.000333*trafficInMins;
  console.log(fuelUsedInLitres);
  return fuelUsedInLitres;
}

//0.00000004*x^5) - 0.00001*x^4) + 0.001*x^3) - 0.0576*x^2) + 1.8094*x + 5.0267)*(mpg/30)
