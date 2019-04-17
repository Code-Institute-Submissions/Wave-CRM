function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(transformData);
      initMap(prettyData);
      makeGraphs(prettyData);
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
                        internalNotes
                        createdAt
                        website
                        modifiedAt
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

function transformData(item) {
  var customers = {
    id: item.node.id, 
    name: item.node.name, 
    firstName: item.node.firstName,
    lastName: item.node.lastName,
    notes: item.node.internalNotes,
    created: item.node.createdAt.slice(0, 4),
    website: function() { if(item.node.website != "") { return "Yes";} else { return "No";}}(),
    modified: item.node.modifiedAt,
    address: item.node.address.addressLine1,
    lat: 0,
    lng: 0
  };
  return customers;
}

function initMap(data) {
  var geocoder = new google.maps.Geocoder();
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: -26.2041028, lng: 28.0473051}
  });
  
  data.map(function( item, index ) {
    if (item.address.length > 1) {
      geocoder.geocode( { 'address': item.address}, function(results, status) {
        if (status == 'OK') {
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  });
}
    
function makeGraphs(data) {
    
  var ndx = crossfilter(data);
  
  has_website(ndx);
  pieChart(ndx);
  barChart(ndx);
  table(ndx, 10);
  
  dc.renderAll();

}

function has_website(ndx) {
    var dim = ndx.dimension(dc.pluck('website'));
    var group = dim.group();
    
    dc.selectMenu("#website-selector")
        .dimension(dim)
        .group(group)
        .order(function (a,b) { return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;});
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
  
  dc.dataTable("#table")  
    .width(500)
    .height(500)
    .dimension(dim)
    .sortBy(function(d){ return d.State ; })
    .group(function (data) { return ''; })
    .columns([
      function(d) { return d.name; },
      function(d) { return d.firstName; },
      function(d) { return d.lastName; },
      function(d) { return d.address; }
    ]);
}