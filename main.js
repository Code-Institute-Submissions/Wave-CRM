function loadDoc() {
  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var prettyData = data.data.business.customers.edges.map(transformData);
      useData(prettyData);
      
      console.log(prettyData);
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
    lastName: item.node.lastName
  };
 
  return customers;
}

function useData(data) {
  var i;
  for(i = 0; i < data.length; i++) {
    document.getElementById("demo").innerHTML += data[i].id;
  }
}



// fetch("https://swapi.co/api/people/1/", {
//     method: 'get'
//   })
//   .then(res => res.json())
//   .then(function (data) {
//     console.log('Request succeeded with JSON response', data);
//   })
//   .catch(function (error) {
//     console.log('Request failed', error);
//   });
  
//   fetch("https://demo.wp-api.org/wp-json/wp/v2/posts", {
//     method: 'get'
//   })
//   .then(res => res.json())
//   .then(function (data) {
//     console.log('Request succeeded with JSON response', data);
//   })
//   .catch(function (error) {
//     console.log('Request failed', error);
//   });
  
  
  
// fetch('https://gql.waveapps.com/graphql/public', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Authorization': 'Bearer 8NBKTN3t9pfYUS0GsEoNapjY6ooRbi'
//   },
//   body: JSON.stringify({  query: `{ 
//                             business(id: "QnVzaW5lc3M6NjNiOTVkZGItNWRkOS00MzI0LWEzNGYtMDkxOTJmNjNjNDc0") { 
//                               customers { 
//                                 edges { 
//                                   node {
//                                     id
//                                     name
//                                     firstName
//                                     lastName
//                                   } 
//                                 } 
//                               }
//                             } 
//                           }`
//                         })
//   })
//   .then(r => r.json())
//   .then(function(data) {
//   // data => console.log(data.business.customers.map(d => d.node));
// //   var theData = data.business.customers.edges["0"].node.name;
//     console.log(data);
//     console.log(data.business.customers.edges["0"].node.name);
//     //console.log(item.name);
//   });