const express = require("express");
var cors = require("cors");
var PokeAPI = require("./Routes/PokeAPI");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`start listen to port:${PORT}`);
});

app.use("/investigation_pokemons", PokeAPI);

//Default 404 page not found
app.get("/", function(req, res) {
  res.send(404);
});
