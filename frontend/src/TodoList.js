import React, { Component } from 'react';

import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

class TodoList extends Component {
  render() {
    const { removeTodo, todos } = this.props;
    return(
      <List>
        {
          Object.keys(todos).map(todoID => (
            <ListItem key={todoID}>
              <ListItemText primary={todos[todoID]} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Remove"
                  onClick={() => removeTodo(todoID)}
                >
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </List>
    );
  }
}

export default TodoList;
