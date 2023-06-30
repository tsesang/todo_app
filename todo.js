const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const fs = require("fs");
const cors = require("cors");

const port = 3001;
app.use(cors());
app.use(bodyParser.json());

function findIndex(todo, id) {
  for (let i = 0; i < todo.length; i++) {
    if (todo[i].id == id) {
      return i;
    }
  }
  return -1;
}

app.get("/todo", (req, res) => {
  fs.readFile("todo.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/todo", (req, res) => {
  const newtodo = {
    id: Math.floor(Math.random() * 100),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile("todo.json", "utf-8", (err, data) => {
    let todo = JSON.parse(data);
    todo.push(newtodo);

    fs.writeFile("todo.json", JSON.stringify(todo), (err) => {
      if (err) throw err;
      res.status(201).json(newtodo);
    });
  });
});

app.delete("/todo/:id", (req, res) => {
  console.log(parseInt(req.params.id))
  fs.readFile("todo.json", "utf-8", (err, data) => {
    var todo = JSON.parse(data);
    var id = req.params.id;
    var todoIndex = findIndex(todo, id);
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todo.splice(todoIndex, 1);
      fs.writeFile("todo.json", JSON.stringify(todo), (err) => {
        if (err) throw err;
        res.send("note deleted....");
      });
    }
  });
});

app.put('/todo/:id',(req,res)=>{
  fs.readFile('todo.json','utf-8',(err,data)=>{
    if(err)throw err;
    else{
      var todo = JSON.parse(data);
      var todoIndex = findIndex(todo,parseInt(req.params.id));
      var updatedTodo = {
        id:todo[todoIndex].id,
        title:req.body.title,
        description:req.body.description
      }
      todo[todoIndex] = updatedTodo;
      fs.writeFile('todo.json',JSON.stringify(todo),(err)=>{
        if(err)throw err;
        res.status(201).json(updatedTodo);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log("http server started in port  : " + port);
});
