const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(users => users.username === username );

  if (!user){
    return response.status(404).json({error: "User not found!"});
  };

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name } = request.body;
  const { username } = request.body;

  let userExists = users.find( users => users.username === username);

  if (userExists){
    return response.status(400).json({error: "user alredy exists!"});
  };

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  
  return response.status(201).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title } = request.body;
  const { deadline } = request.body;

  const todo = 
  { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title } = request.body;
  const { deadline } = request.body;
  const { id } = request.params;

  let todo = user.todos.find(todos => todos.id === id );

  if (!todo) {
    return response.status(404).json({error: `Não foi encontrato nenhum todo com o ID:${id}`});
  };

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  let todo = user.todos.find(todos => todos.id === id);

  if (!todo) {
    return response.status(404).json({error: `Não foi encontrato nenhum todo com o ID:${id}`});
  };

  todo.done = true;

  response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  let index = user.todos.findIndex(obj => obj.id == id);

  if (index === -1) {
    return response.status(404).json({error: `Não foi encontrato nenhum todo com o ID:${id}`});
  };

  user.todos.splice( index, 1);

  response.status(204).send();


});

module.exports = app;