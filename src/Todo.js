import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, { useEffect, useState } from "react";
import moment from "moment";

import db from "./firebase";

function Todo(props) {
  const [checked, setChecked] = useState(false);

  // update the status of the todo from parent
  useEffect(() => {
   setChecked(props.todo.isDone)
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
    const res = db.collection('todos').doc(id).set({
        isDone: status
    }, { merge: true });

  };
  return (
    // <ListItem>
    //   <ListItemText key={props.todo.id} primary={props.todo.todo} secondary={ moment(props.todo.completeBy).format('MMMM Do YYYY, h:mm:ss a')} />
    //   <DeleteForeverIcon onClick={event => db.collection('todos').doc(props.todo.id).delete()} />
    // </ListItem>

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
          aria-label="delete"
          onClick={(event) =>
            db.collection("todos").doc(props.todo.id).delete()
          }
        >
          <DeleteForeverIcon style={{ color: "red" }} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default Todo;
