/*
Wave API return customer list

The loadDoc function makes a request to the Wave API for customer information. 
Once a successful response is recieved, multiple functions are called with the returned data passed as a parameter.
This function is called when the index.html page loads (on body tag).
The Authorization key used is from a test account
*/

function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(function(item, i) { return transformData(item, i); });
      
      $("#loader").addClass("hideLoader");
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
              address {
                addressLine1
              }
            } 
          } 
        }
      } 
    }`
  }));
}

/*
Prettify returned data

The transformData function is called in the loadDoc function.
This function formats the returned data and makes it more user friendly.
*/

function transformData(item, i) {
  var customers = {
    id: item.node.id,
    index: i + 1,
    name: item.node.name, 
    firstName: item.node.firstName,
    lastName: item.node.lastName,
    notes: item.node.internalNotes,
    created: item.node.createdAt.slice(0, 4),
    website: function() { if(item.node.website != "") { return "Yes";} else { return "No";}}(),
    address: item.node.address.addressLine1,
    lat: 0,
    lng: 0
  };
  return customers;
}

/*
Render dc.js elements

The makeGraphs function renders all the graphs and crossfilters the returned data from the loadDoc function.
This function is called from the loadDoc function.
*/

function makeGraphs(data) {
    
  var ndx = crossfilter(data);
  
  has_website(ndx);
  pieChart(ndx);
  barChart(ndx);
  table(ndx, 10);
  
  dc.renderAll();
  $(".dc-select-menu").addClass("custom-select");

}

/*
Bar Chart

The barChart function uses dc.js to make a bar chart based on the crossfilter data.
This function is called from the makeGraphs function.
*/

function barChart(ndx) {
  var dim = ndx.dimension(dc.pluck('created'));
  var group = dim.group();
  
  dc.barChart("#bar-chart")
    .width(350)
    .height(250)
    .margins({top: 30, right: 50, bottom: 45, left: 40})
    .dimension(dim)
    .group(group)
    .transitionDuration(1000)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Customer created")
    .yAxisLabel("# of customers")
    .yAxis().ticks(10);
}

/*
Pie Chart

The pieChart function uses dc.js to make a pie chart based on the crossfilter data.
This function is called from the makeGraphs function.
*/

function pieChart(ndx) {
  var dim = ndx.dimension(dc.pluck('notes'));
  var group = dim.group();
  
  dc.pieChart("#pie-chart")
    .width(200)
    .height(200)
    .transitionDuration(1000)
    .innerRadius(25)
    .label(function(d) {
				return d.key; 
		})
    .dimension(dim)
    .group(group);
}

/*
Table

The table function uses dc.js to make a table based on the crossfilter data.
This function is called from the makeGraphs function.
*/

function table(ndx) {
  var dim = ndx.dimension(dc.pluck('name'));
  
  dc.dataTable("#table")  
    .width(500)
    .height(500)
    .dimension(dim)
    .size(Infinity)
    .sortBy(function(d){ return d.State ; })
    .group(function (data) { return ''; })
    .columns([
      function(d) { return d.index; },
      function(d) { return d.name; },
      function(d) { return d.firstName; },
      function(d) { return d.lastName; },
      function(d) { return d.address; }
    ]);
}

/*
Website select

The has_website function uses dc.js to make an HTML select element based on whewther or not the customer has a website.
This function is called from the makeGraphs function.
*/

function has_website(ndx) {
    var dim = ndx.dimension(dc.pluck('website'));
    var group = dim.group();
    
    dc.selectMenu("#website-selector")
        .dimension(dim)
        .group(group)
        .order(function (a,b) { return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;});
}

/*
Google map

The initMap function creates the Google map and adds pins to the map from the customer addresses.
These customer addresses are first transformed into co-ordinates using the Google Geocoder API.
This function is called from the loadDoc function.
*/

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
            position: results[0].geometry.location,
            label: {text: item.index.toString(), color: "white"},
            zIndex: item.index
          });
        }
      });
    }
  });
}

/*
jQuery initialisation

These functions initialise and Bootstrap popover when the document is loaded.
Additionally the modal event is created to pop-up the modal on a show event.
These functions are called when the determined events occur.
*/

$( document ).ready(function($) {
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
  
  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text('New message to ' + recipient);
    modal.find('.modal-body input').val(recipient);
    
  
      
  });
});

/*
Wave API create new customer

The addCustomer function makes a request to the Wave API to create a new customer record.
Once a response is recieved, success will trigger a success message and failure wil trigger a failure message.
This function is called when the modal save button is submitted.
The Authorization key used is from a test account
*/

function addCustomer() {
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      if(data.data.customerCreate.didSucceed == true) {
        alert("New customer created");
      } else {
        alert("New customer NOT created, please make sure the customer information is correct");
        console.log(this.responseText);
      }
    }
  };
  
  xhttp.open("POST", "https://gql.waveapps.com/graphql/public", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.setRequestHeader('Accept', 'application/json');
  xhttp.setRequestHeader('Authorization', 'Bearer 8NBKTN3t9pfYUS0GsEoNapjY6ooRbi');
  xhttp.send(JSON.stringify({
    query: `mutation($input: CustomerCreateInput!) { 
      customerCreate(input: $input) {
        didSucceed
        customer {
          id
          name
          firstName
          lastName
          email
          currency {
            code
          }
        }
      }
    }`,
    variables: customerInput()
  }));
}

/*
Wave API mutation variable

The customerInput function makes a GraphQl variable to be used in the create customer request.
This function is called in the addCustomer function.
*/

function customerInput() {
    var customerVariables = {
      "input": {
        "businessId": "QnVzaW5lc3M6NjNiOTVkZGItNWRkOS00MzI0LWEzNGYtMDkxOTJmNjNjNDc0", 
        "name": $("#businessName").val(), 
        "firstName": $("#firstName").val(), 
        "lastName": $("#lastName").val(), 
        "email": $("#emailAddress").val(),
        "mobile": $("#phoneNumber").val(),
        "internalNotes": $("#customerStatus").val(),
        "website": $("#webAddress").val(),
        "currency": "ZAR", 
        "address": {
          "addressLine1": $("#physicalAddress").val()
        }
      }
    };
    return customerVariables;
}