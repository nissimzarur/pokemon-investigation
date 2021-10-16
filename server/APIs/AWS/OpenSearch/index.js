var AWS = require("aws-sdk");

var region = "us-east-2"; // e.g. us-west-1
var domain =
  "https://search-pokemon-task-5pigc5ahw4xawcmvxfxa5lz3yq.us-east-2.es.amazonaws.com"; // e.g. search-domain.region.es.amazonaws.com
var index = "pokemon_in_investigation";
var type = "string";
var id = "1";

// const savePokemonsInvestigation = (dangerPokemons = {}) => {
//   if (!dangerPokemons || Object.keys(dangerPokemons).length == 0) return false;

//   var json = dangerPokemons;
//   axios
//     .put(`${domain}/_bulk`, JSON.stringify(dangerPokemons))
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((err) => console.log(`----- bad POST: '${err}' ------`));
// };

function savePokemonsInvestigation(dangerPokemons = {}) {
  console.log(dangerPokemons);
  if (!dangerPokemons || Object.keys(dangerPokemons).length == 0) return false;

  var endpoint = new AWS.Endpoint(domain);
  var request = new AWS.HttpRequest(endpoint, region);

  request.method = "PUT";
  request.path += index + "/" + type;
  // request.path += index + "/" + type + "/" + id;
  request.body = JSON.stringify(dangerPokemons);
  request.headers["host"] = domain;
  request.headers["Content-Type"] = "application/json";
  request.headers["Content-Length"] = Buffer.byteLength(request.body);

  var credentials = new AWS.EnvironmentCredentials("AWS");
  var signer = new AWS.Signers.V4(request, "es");
  signer.addAuthorization(credentials, new Date());

  var client = new AWS.HttpClient();
  client.handleRequest(
    request,
    null,
    function(response) {
      console.log(response.statusCode + " " + response.statusMessage);
      var responseBody = "";
      response.on("data", function(chunk) {
        responseBody += chunk;
      });
      response.on("end", function(chunk) {
        console.log("Response body: " + responseBody);
      });
    },
    function(error) {
      console.log("Error: " + error);
    }
  );
}

module.exports.savePokemonsInvestigation = savePokemonsInvestigation;
