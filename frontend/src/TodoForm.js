import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

const EMPTY_TODO = {
  todoText: '',
};

class TodoForm extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, EMPTY_TODO);
  }

  updateTodoText = event => {
    const { value } = event.target;
    this.setState({ todoText: value });
  }

  addTodo = (event) => {
    event.preventDefault();
    if (this.state.todoText === '') return
    this.props.createTodo(this.state.todoText);
    this.setState(EMPTY_TODO);
  }

  render() {
    const { todoText } = this.state;
    return(
      <form
        onSubmit={this.addTodo}
        style={{ marginLeft: 48 }}
      >
        <TextField
          variant="outlined"
          type="text"
          placeholder="Add todo"
          value={todoText}
          onChange={this.updateTodoText}/>
        <IconButton
          aria-label="Add"
          onClick={this.addTodo}
        >
          <AddIcon/>
        </IconButton>
      </form>
    );
  }
}

export default TodoForm;
