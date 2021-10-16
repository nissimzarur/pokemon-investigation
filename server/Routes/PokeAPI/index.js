var express = require("express");
const axios = require("axios");

const { pokemonNames, dangeresTypes, dangeresMoves } = require("../../data.js");
const { savePokemonsInvestigation } = require("../../APIs/AWS/OpenSearch");

var url = "https://pokeapi.co/api/v2/pokemon";
var PokeAPI = express.Router();
var pokemonsInvestigation = [];

PokeAPI.get("/", (req, res) => {
  // savePokemonsInvestigation([true]);
  // return;
  const runOnPokemonsName = async () => {
    for (let index = 0; index < pokemonNames.length; index++) {
      const name = pokemonNames[index];

      await checkIfPokemonIsDangerByName(name);

      if (index == pokemonNames.length - 1) {
        console.log("total:" + pokemonsInvestigation.length);
        savePokemonsInvestigation(pokemonsInvestigation);
      }
    }
  };
  runOnPokemonsName();
});

const checkIfPokemonIsDangerByName = async (name) => {
  await axios
    .get(`${url}/${name.toLowerCase()}`)
    .then((response) => {
      if (!isValidPokemon(response)) return res.sendStatus(400);

      const typeNames = pokemonTypeNames(response["data"]["types"]);

      if (!typeNames || !Array.isArray(typeNames)) return res.sendStatus(400);

      for (let index = 0; index < typeNames.length; index++) {
        const tName = typeNames[index];
        if (tName && dangeresTypes.includes(tName)) {
          const moveNames = pokemonMoveNames(response["data"]["moves"]);

          if (!moveNames || !Array.isArray(moveNames))
            return res.sendStatus(400);

          for (let index = 0; index < moveNames.length; index++) {
            const mName = moveNames[index];

            if (mName && dangeresMoves.includes(mName)) {
              let pokemonObj = {
                id: response["data"]["id"],
                name: response["data"]["name"],
                base_experience: response["data"]["base_experience"],
                height: response["data"]["height"],
                typeNames: typeNames,
                moveNames: moveNames,
              };

              pokemonsInvestigation.push(pokemonObj);
              return;
            }
          }
        }
      }
    })
    .catch((err) => console.log(`----- bad request for '${err}' ------`));
};

const isValidPokemon = (response) => {
  if (
    response &&
    Object.keys(response).length > 0 &&
    response["data"] &&
    response["data"]["types"] &&
    Array.isArray(response["data"]["types"]) &&
    response["data"]["types"].length > 0 &&
    response["data"]["moves"] &&
    Array.isArray(response["data"]["moves"]) &&
    response["data"]["moves"].length > 0
  )
    return true;

  return false;
};

const pokemonMoveNames = (moves = []) => {
  if (!Array.isArray(moves) || !moves || moves.length == 0) return false;

  let moveNames = [];
  moves.forEach((move) => moveNames.push(move.move.name));

  return moveNames;
};

const pokemonTypeNames = (types = []) => {
  if (!Array.isArray(types) || !types || types.length == 0) return false;

  let typeNames = [];
  types.forEach((type) => typeNames.push(type.type.name));

  return typeNames;
};

module.exports = PokeAPI;

/*
 typeNames.forEach((tName) => {
            if (tName && dangeresTypes.includes(tName)) {
              const moveNames = pokemonMoveNames(response["data"]["moves"]);

              if (!moveNames || !Array.isArray(moveNames))
                return res.sendStatus(400);

              moveNames.forEach((mName) => {
                if (
                  mName &&
                  dangeresMoves.includes(mName) &&
                  !existPokIds.includes(response["data"]["id"])
                ) {
                  let pokemonObj = {
                    id: response["data"]["id"],
                    name: response["data"]["name"],
                    base_experience: response["data"]["base_experience"],
                    height: response["data"]["height"],
                    typeNames: typeNames,
                    moveNames: moveNames,
                  };

                  existPokIds.push(pokemonObj.id);
                  pokemonsInvestigation.push(pokemonObj);
                }
              });
            }
            console.log(pokemonsInvestigation.length);
          });
          */
