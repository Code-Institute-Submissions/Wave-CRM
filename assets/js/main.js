function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(transformData);
      useData(prettyData);
    }
  };
  
  xhttp.open("POST", "https://gql.waveapps.com/graphql/public", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.setRequestHeader('Accept', 'application/json');
  xhttp.setRequestHeader('Authorization', 'Bearer 8NBKTN3t9pfYUS0GsEoNapjY6ooRbi');
  xhttp.send(JSON.stringify({
              query: `{ 
                business(id: "QnVzaW5lc3M6NjNiOTVkZGItNWRkOS00MzI0LWEzNGYtMDkxOTJmNjNjNDc0") { 
                  customers { 
                    edges { 
                      node {
                        id
                        name
                        firstName
                        lastName
                        mobile
                        address {
                          addressLine1
                        }
                      } 
                    } 
                  }
                } 
              }`
            })
          );
}

function transformData(item, index) {
  var customers = {
    id: item.node.id, 
    name: item.node.name, 
    firstName: item.node.firstName,
    lastName: item.node.lastName,
    mobile: item.node.mobile,
    address: item.node.address.addressLine1
  };
 
  return customers;
}

function useData(data) {
  var i;
  for(i = 0; i < data.length; i++) {
    document.getElementById("table-body").innerHTML += `
      <tr id="${data[i].id}">
          <th scope="row">${i + 1}</th>
          <td class="company">${data[i].name}</td>
          <td class="first-name">${data[i].firstName}</td>
          <td class="last-name">${data[i].lastName}</td>
          <td class="mobile">${data[i].mobile}</td>
          <td class="address">${data[i].address}</td>
      </tr>
    `;
  }
}

function initMap() {
var locations = [
      ['Bondi Beach', '850 Bay st 04 Toronto, Ont'],
      ['Coogee Beach', '932 Bay Street, Toronto, ON M5S 1B1'],
      ['Cronulla Beach', '61 Town Centre Court, Toronto, ON M1P'],
      ['Manly Beach', '832 Bay Street, Toronto, ON M5S 1B1'],
      ['Maroubra Beach', '606 New Toronto Street, Toronto, ON M8V 2E8']
    ];

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(43.253205,-80.480347),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
      geocodeAddress(map, geocoder, locations[i]);
    }
}

function geocodeAddress(map, geocoder, location) {
  geocoder.geocode( { 'address': location[1]}, function(results, status) {
  //alert(status);
    if (status == google.maps.GeocoderStatus.OK) {

      //alert(results[0].geometry.location);
      map.setCenter(results[0].geometry.location);
      createMarker(results[0].geometry.location,location[0]+"<br>"+location[1]);
    }
    else
    {
      alert("some problem in geocode" + status);
    }
  }); 
}

function createMarker(latlng,html){
  var marker = new google.maps.Marker({
    position: latlng,
    map: map
  }); 

  google.maps.event.addListener(marker, 'mouseover', function() { 
    infowindow.setContent(html);
    infowindow.open(map, marker);
  });
		
  google.maps.event.addListener(marker, 'mouseout', function() { 
    infowindow.close();
  });
}