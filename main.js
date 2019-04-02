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
  
  
  
  
fetch('https://gql.waveapps.com/graphql/public', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer 8NBKTN3t9pfYUS0GsEoNapjY6ooRbi'
  },
  body: JSON.stringify({  query: `{ 
                            businesses { 
                              edges { 
                                node { 
                                  id 
                                  name 
                                } 
                              }
                            } 
                          }`
                        })
  })
  .then(r => r.json())
  .then(function(data) {
    //data => console.log('data returned:', data)
    var theData = data;
    console.log(theData);
    console.log(data.businesses.edges[""0""].node.name);
  });