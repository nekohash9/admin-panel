const { writeData } = require("../utils/data");

//? Getting games
const sendAllGames = async (req, res) => {
  res.send(req.games);
};

const deleteGame = async (req, res) => {
  //? Read game by id
  const id = Number(req.params.id);

  //? Search game by id, which you need delete
  req.game = req.games.find((item) => item.id === id);

  //? Search game by id
  const index = req.games.findIndex((item) => item.id === req.game.id);

  //? Delete game
  req.games.splice(index, 1);

  //? Write update array in games.json
  await writeData("./utils/data/games.json", req.games);

  //? Show response about the operation performed
  res.send({
    games: req.games,
    updated: req.game,
  });
};

const addGameController = async (req, res) => {
  //? Check, is there a game with the same name
  req.isNew = !Boolean(req.games.find((item) => item.title === req.body.title));
  //? If the game we want to add is new (it wasn't in the list)
  if (req.isNew) {
    //? Add obj with new game
    const inArray = req.games.map((item) => Number(item.id));
    let maximalId;
    if (inArray.length > 0) {
      maximalId = Math.max(...inArray);
    } else {
      maximalId = 0;
    }
    req.updatedObject = {
      id: maximalId + 1,
      title: req.body.title,
      image: req.body.image,
      link: req.body.link,
      description: req.body.description,
    };
    //? Add data new game with old games
    req.games = [...req.games, req.updatedObject];
  } else {
    res.status(400);
    res.send({
      status: "error",
      message: "Игра с таким именем уже есть.",
    });
    return;
  }
  //? Write update list game
  await writeData("./utils/data/games.json", req.games);
  res.send({
    games: req.games,
    updated: req.updatedObject,
  });
};

module.exports = {
  sendAllGames,
  deleteGame,
  addGameController,
};
