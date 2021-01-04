import "./App.css";
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  List,
  TextField,
} from "@material-ui/core";
import Todo from "./Todo";
import db from "./firebase";



function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [timeLine, setTimeLine] = useState("");
  

  // when app loads we need to listen to the database and fetch new todos as they get added/removed
  useEffect(() => {
    // this code fires up when app loads
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo, completeBy: doc.data().completeBy, isDone: doc.data().isDone }))
        );
      });
  }, []);

  const addTodo = (event) => {
    // when clicking button to add todo this will fire up
    event.preventDefault(); // THis will stop page refresh
    db.collection("todos").add({
      todo: input,
      completeBy: timeLine,
      isDone: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
    setTimeLine("");
  };
  return (
    <div className="App" style={{padding: 30}}>
      <form action="">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1>mTodo App</h1>
          </Grid>
          <Grid item xs={12} md={7}>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="todo">Enter a TODO</InputLabel>
              <Input
                id="todo"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-describedby="todo-text-help"
                fullWidth={true}
              />
              <FormHelperText id="todo-text-help">
                what you want to do next?
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <TextField
                value={timeLine}
                onChange={(event) => setTimeLine(event.target.value)}
                id="datetime"
                label="Timeline"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              disabled={!input || !timeLine}
              onClick={addTodo}
              variant="contained"
              color="primary"
            >
              Add Todo
            </Button>
          </Grid>
        </Grid>
      </form>
      <List>
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </List>
    </div>
  );
}

export default App;
