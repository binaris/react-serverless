import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

import './index.css';

import TodoList from './TodoList';
import TodoForm from './TodoForm';

import BinarisAPI from './BinarisAPI';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: {} };
    if (!process.env.REACT_APP_BINARIS_ROOT_ENDPOINT) {
      throw new Error('Environment variable "REACT_APP_BINARIS_ROOT_ENDPOINT" is required!');
    }
    this.backend = new BinarisAPI(process.env.REACT_APP_BINARIS_ROOT_ENDPOINT);
  }

  createTodo = async todoText => {
    const newItemData = await this.backend.createItem(todoText);
    this.setState({
      todos: {
        ...this.state.todos,
        ...newItemData,
      },
    });
  }

  removeTodo = async todoID => {
    await this.backend.deleteItem(todoID);
    const todos = { ...this.state.todos };
    delete todos[todoID];
    this.setState({ todos });
  }

  async componentDidMount() {
    const existingData = await this.backend.readAllItems();
    this.setState({ todos: existingData || {} });
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
