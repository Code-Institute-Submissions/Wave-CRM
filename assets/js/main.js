function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(transformData);
      useData(prettyData);
      initMap(prettyData);
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

function initMap(data) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: -26.2041028, lng: 28.0473051}
  });
  
  var geocoder = new google.maps.Geocoder();
  var addresses = customerAddresses(data);
  
    addresses.map(function(address) {
      geocodeAddress(address, geocoder, map);
    });
}

function geocodeAddress(address, geocoder, resultsMap) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function customerAddresses(data) {
  var customerAddressArray = [];
  var i;
  for(i = 0; i < data.length; i++) {
    if( data[i].address.length > 0 ) {
      customerAddressArray.push(data[i].address);
    }
  }
  return customerAddressArray;
}