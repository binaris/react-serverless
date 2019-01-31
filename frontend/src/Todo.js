import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import uuidv4 from 'uuid/v4';

import './index.css';

import TodoList from './TodoList';
import TodoForm from './TodoForm';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: {} };
  }

  createTodo = async todoText => {
    const uniqueID = uuidv4();
    this.setState({
      todos: {
        ...this.state.todos,
        [uniqueID]: todoText,
      },
    });
  }

  removeTodo = async todoID => {
    const todos = { ...this.state.todos };
    delete todos[todoID];
    this.setState({ todos });
  }

  render() {
    return (
      <div className="Todo">
        <Typography variant="h2">
          Todo
        </Typography>
        <TodoForm createTodo={this.createTodo} />
        <TodoList
          todos={this.state.todos}
          removeTodo={this.removeTodo}
        />
      </div>
    );
  }
}

export default Todo;
