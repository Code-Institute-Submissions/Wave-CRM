function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(transformData);
//      useData(prettyData);
      initMap(prettyData);
      makeGraphs(prettyData)
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
                        internalNotes
                        createdAt
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
    notes: item.node.internalNotes,
    created: item.node.createdAt.slice(0, 4),
    address: item.node.address.addressLine1
  };
  return customers;
}

// function useData(data) {
//   var i;
//   for(i = 0; i < data.length; i++) {
//     document.getElementById("table-body").innerHTML += `
//       <tr id="${data[i].id}">
//           <th scope="row">${i + 1}</th>
//           <td class="company">${data[i].name}</td>
//           <td class="first-name">${data[i].firstName}</td>
//           <td class="last-name">${data[i].lastName}</td>
//           <td class="mobile">${data[i].mobile}</td>
//           <td class="address">${data[i].address}</td>
//       </tr>
//     `;
//   }
// }

function initMap(data) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: -26.2041028, lng: 28.0473051}
  });
  
  var geocoder = new google.maps.Geocoder();
  var addresses = customerAddresses(data);
  
  var markers = addresses.map(function(address) {
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









    
function makeGraphs(data) {
    
  var ndx = crossfilter(data);
  
  pieChart(ndx);
  barChart(ndx);
  table(ndx);
    
  dc.renderAll();

}

function barChart(ndx) {
  var dim = ndx.dimension(dc.pluck('created'));
  var group = dim.group();
  
  dc.barChart("#bar-chart")
    .width(350)
    .height(250)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Year customer was created")
    .yAxisLabel("Number of customers")
    .yAxis().ticks(10);
}

function pieChart(ndx) {
  var dim = ndx.dimension(dc.pluck('notes'));
  var group = dim.group();
  
  dc.pieChart("#pie-chart")
    .width(200)
    .height(200)
    .innerRadius(25)
    .label(function(d) {
				return d.key; 
		})
    .dimension(dim)
    .group(group);
}

function table(ndx) {
  var dim = ndx.dimension(dc.pluck('name'));
  var group = dim.group();
  
  dc.dataTable("#table")
    .width(500)
    .height(500)
    .dimension(dim)
    .group(
      function (data) { return ''; })
    .columns([//'Name', 'Notes'
      function(d) { return d.name; },
      function(d) { return d.firstName; },
      function(d) { return d.lastName; },
      function(d) { return d.mobile; },
      function(d) { return d.address; }
//      function(d) { return numberFormat(d.high - d.low); },
//      function(d) { return d.volume; }
    ]);
}