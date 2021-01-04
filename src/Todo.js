import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Modal,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";
import React, { useEffect, useState } from "react";
import db from "./firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function Todo(props) {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [input, setInput] = useState("");
  const [timeLine, setTimeLine] = useState("");

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      maxWidth: 900,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  // update the status of the todo from parent
  useEffect(() => {
    setChecked(props.todo.isDone);
  }, [props.todo.isDone]);

  const handleToggle = (id) => () => {
    let status = false;
    if (checked) {
      setChecked(false);
      status = false;
    } else {
      setChecked(true);
      status = true;
    }
    // Update the value in Database
    db.collection("todos").doc(id).set(
      {
        isDone: status,
      },
      { merge: true }
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setInput(props.todo.todo);
  }, [props.todo.todo]);

  useEffect(() => {
    setTimeLine(props.todo.completeBy);
  }, [props.todo.completeBy]);

  const editTodo = (event, id) => {
    // when clicking button to add todo this will fire up
    event.preventDefault(); // THis will stop page refresh
    // Update the value in Database
    db.collection("todos").doc(id).set(
      {
        todo: input,
        completeBy: timeLine,
      },
      { merge: true }
    );
    setInput("");
    setTimeLine("");
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          {/* <h2 id="simple-modal-title">Text in a modal</h2>
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p> */}
          <form action="">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>mTodo</h1>
              </Grid>
              <Grid item xs={12} md={7}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="todo">Edit todo</InputLabel>
                  <Input
                    id="todo"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    aria-describedby="todo-text-help"
                    fullWidth={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
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
              <Grid item xs={12} md={3}>
                <Button
                  type="submit"
                  disabled={!input || !timeLine}
                  onClick={(e) => {
                    editTodo(e, props.todo.id);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Edit Todo
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>

      <ListItem
        key={props.todo.id}
        role={undefined}
        dense
        button
        onClick={handleToggle(props.todo.id)}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            tabIndex={-1}
            disableRipple
            style={{ color: "blue" }}
            inputProps={{ "aria-labelledby": props.todo.id }}
          />
        </ListItemIcon>
        <ListItemText
          id={props.todo.id}
          primary={props.todo.todo}
          secondary={moment(props.todo.completeBy).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleOpen}
            style={{ paddingRight: 14 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(event) =>
              db.collection("todos").doc(props.todo.id).delete()
            }
          >
            <DeleteForeverIcon style={{ color: "red" }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
}

export default Todo;
