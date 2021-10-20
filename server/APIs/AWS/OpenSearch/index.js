var AWS = require("aws-sdk");
var elasticsearch = require('elasticsearch');
var connectionClass = require('http-aws-es');
const { uuid } = require('uuidv4');

const awsConfig = {
	domain:process.env.OPEN_SEARCH_DOMAIN,
	region:process.env.REGION,
	accessKeyId:process.env.ACCESS_KEY_ID,
	secretAccessKey:process.env.SECRET_ACCESS_KEY
};

var client = new elasticsearch.Client({
	host: awsConfig.domain,
	connectionClass: connectionClass,
	protocol: 'https',
	port: 443,
	amazonES: {
		region: awsConfig.region,
		accessKey: awsConfig.accessKeyId,
		secretKey: awsConfig.secretAccessKey
	}
});

AWS.config.update({
	credentials: new AWS.Credentials(awsConfig.accessKeyId, awsConfig.secretAccessKey),
	region: awsConfig.region

});

const savePokemonsInvestigation = async (dangerPokemons = [])=>{
	if (!dangerPokemons || Object.keys(dangerPokemons).length == 0) return false;

	var sentPokemonsResultsList = [];

	const awsCallRequest =  (dangerPokemon)=>{
		return new Promise((resolve,reject)=>{
			client.index({
				index:"pokemon_in_investigation",
				type:"passport",
				id:uuid(),
				body:dangerPokemon
			},(err, resp, status)=>{
				if(err || status != 201) {
					console.log(`Error code ${status}: ${err}`);
					sentPokemonsResultsList.push({
						pokemonName:dangerPokemon.name,
						success:false
					});

					reject();
				}
		
				sentPokemonsResultsList.push({
					pokemonName:dangerPokemon.name,
					success:true
				});
	
				console.log(`The passport of pokemon ${dangerPokemon.name} have been saved successfully.`);
				resolve();
			});
		}).catch((err)=>console.log(`The passport of pokemon ${dangerPokemon.name} have been filed to save.`));
	}

	for (let index = 0; index < dangerPokemons.length; index++) {
		const dangerPokemon = dangerPokemons[index];
		await awsCallRequest(dangerPokemon);
	}

	return sentPokemonsResultsList;
}

module.exports.savePokemonsInvestigation = savePokemonsInvestigation;
