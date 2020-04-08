const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (req, res, next) => {
  let {id} = req.params;
  console.log(id);

  if(!isUuid(id)) {
    return res.status(400).json({
      error: "Invalid Id"
    })
  }

  return next();
}

app.get("/repositories", (req, res) => {
  res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, description, owner } = req.body;
  let { techs, url } = req.body;

  const id = uuid();
  
  if(!techs) techs = [];
  if(!url) url = "";
  
  const project = { id, title, description, techs, owner, url, likes: 0 };

  repositories.push(project);

  return res.status(200).json(project)
});

app.put("/repositories/:id", validateId, async (req, res) => {
  const { id } = req.params;
  const index = await repositories.findIndex(r => r.id === id);

  const newProject = {
    ...req.body, likes: repositories[index].likes, id
  };

  repositories[index] = newProject;
  
  return res.status(200).json(newProject)
});

app.delete("/repositories/:id", validateId, async (req, res) => {
  const { id } = req.params;
  const index = await repositories.findIndex(r => r.id === id);
  repositories.splice(index, 1);
  return res.sendStatus(204)
});

app.post("/repositories/:id/like", validateId, async (req, res) => {
  const { id } = req.params;
  const index = await repositories.findIndex(r => r.id === id);

  repositories[index].likes += 1;

  return res.status(200).json({likes: repositories[index].likes})
});

module.exports = app;
