# Develop a Frontend on Your Local Machine

This section walks through building a todo list in React at a high level. If you're interested in learning React, we highly recommend the following [official React tutorial](https://reactjs.org/tutorial/tutorial.html)

## Table of Contents
1. [Setting Up the Project](#setting-up-project)  
1. [Creating Our Central Todo Component](#central-todo)  
1. [Creating and Manipulating State](#create-and-manipulate-state)  
1. [Displaying Todo Items](#displaying-todo-items)  
1. [Adding New Todos](#adding-new-todos)  
1. [Beast to Beauty](#beast-to-beauty)  

<a name="setting-up-project"></a>

### Setting Up the Project

React is a framework that allows complex frontend design to be expressed through native JavaScript code (or jsx files). In this tutorial we will go through the individual steps required to make your own React todo application. This goal could definitely be accomplished using vanilla React, but to save us some time and uneeded busy work we will use the `create-react-app` framework. `create-react-app` handles the traditionally tedious project creation and boilerplate generation steps, allowing us to immediately start writing our app relevant logic.


```bash
# create boilerplate project
$ npx create-react-app frontend
```

Now that our files are generated let's test it
```bash
$ cd frontend
$ npm run start
```

<a name="central-todo"></a>

### Creating Our Central Todo Component

Let's start off by removing some unnecessary files.

```diff
-src/index.css
-src/App.js
-src/App.test.js
-src/logo.svg
-src/App.css
-src/serviceWorker.js
```

Next, create a file named `Todo.js` with the following contents in the `src` directory.

```JavaScript
import React, { Component } from 'react';

class Todo extends Component {
  render() {
    return (
      <div className="Todo">
        <h1>Hello</h1>
      </div>
    );
  }
}

export default Todo;
```

<details><summary>Todo Component explained</summary>

The first line brings the React library into our current scope, nothing special.

```JavaScript
import React, { Component } from 'react';
```

Here we define a new JS class named "Todo" which extends something called `Component`. A Component is the building block of any React application. Components are almost completely flexible but they generally accept input and return some rendered portion of the user interface. Our `Todo` Component will hold the entire Todo application.

```JavaScript
class Todo extends Component {
```

The [official React documentation](https://reactjs.org/docs/components-and-props.html) is very helpful here

Inside of the `Todo` class we define a method named `render`. 

`render` is a method inherited from Component and is expected to return the rendered contents representing your Component. Our current render code is very simple and just returns a header tag "Hello"

```Javascript
render() {
  return (
    <div className="Todo">
      <h1>Hello</h1>
    </div>
  );
}
```

Lastly, we export our `Todo` class so it's available to use in external files (such as `src/index.js`)

```JavaScript
export default Todo;
```

</details>


Because we deleted `src/App.js` we will need to update our `src/index.js` to use the new `src/Todo.js` file

```diff
> src/index.js
---
-import './index.css';
-import App from './App';
-import * as serviceWorker from './serviceWorker';
+import Todo from './Todo';
...
-ReactDOM.render(<App />, document.getElementById('root'));
+ReactDOM.render(<Todo />, document.getElementById('root'));
...
-// If you want your app to work offline and load faster, you can change
-// unregister() to register() below. Note this comes with some pitfalls.
-// Learn more about service workers: http://bit.ly/CRA-PWA
-serviceWorker.unregister();
```

We are also going to need a few dependencies and might as well install those now. Do so by running 

`npm install @material-ui/core @material-ui/icons url-join uuid` inside the `frontend` directory.


Before we move on to the next section, let's test and make sure we didn't break everything by running...

`npm run start`

You should see a minimal (but working) webpage in your browser

Now that we're on the same page, let's start adding to our application. We'll start off slow and simply improve the text displayed when you visit the todo app in a browser. Currently native `<h1>` tags are used but we can do better. Instead of `<h1>` tags let's rely on a `Typography` element from the `material-ui` library we installed in the previous section.

```diff
> src/Todo.js
---
-<h1>Hello</h1>
+<Typography variant="h2">
+  Todo
+</Typography>
```

To use `Typography` the correct dependency should be imported

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
+import Typography from '@material-ui/core/Typography';
```

Test in your browser to see the slightly updated "Todo" text.

<a name="create-and-manipulate-state"></a>

### Creating and Manipulating State

[Just Show Me the Code](#create-and-manipulate-state-code)

We'll want to create external files and Components for displaying the todo items, but it's usually a good idea to have a centralized representation of state. We can achieve this by adding a constructor to the `Todo` class and define the format of our initial state. To keep things simple we'll store our todo items using a basic key value mapping.

```diff
> src/Todo.js
---
 class Todo extends Component {
+  constructor(props) {
+    super(props);
+    this.state = { todos: {} };
+  }
```
It's important to call `super(props)` because we want the parent Component initialization to still take place.

Now that we know our state format in the `Todo` class, it's probably best to write some "accessor" functions so that we avoid directly modifying values. To start, let's define a function that creates a new todo.

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
 import Typography from '@material-ui/core/Typography';
+import uuidv4 from 'uuid/v4';
...
   this.state = { todos: {} };
 }
+
+createTodo = async todoText => {
+  const uniqueID = uuidv4();
+  this.setState({
+    todos: {
+      ...this.state.todos,
+      [uniqueID]: todoText,
+    },
+  });
+}
```

<details><summary>createTodo explained</summary>

Our `createTodo` function needs to take in the text representation of the new todo. We use the arrow operator because it allows the function body to use `this` to refer to our `Todo` class scope instead of the caller scope. If you're not sure what I mean [here](https://hackernoon.com/javascript-es6-arrow-functions-and-lexical-this-f2a3e2a5e8c4) is a nice article that explains.

```diff
> src/Todo.js
---
+createTodo = async todoText => {
```

The `uuid` module is used to generate a unique key for our todo entry. `this.setState` is used because directly modifying `this.state` is not possible in a React Component.

```diff
> src/Todo.js
---
+const uniqueID = uuidv4();
+this.setState({
+  todos: {
+    ...this.state.todos,
+    [uniqueID]: todoText,
+  },
+});
```

Our final step is to add the import for the `uuid` dependency to ensure it's accessible.

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
 import Typography from '@material-ui/core/Typography';
+import uuidv4 from 'uuid/v4';
```
</details>


The ability to create a todo has been added but now we probably also want the ability to remove a todo. Because of the decisions we made in `createTodo` we can assume that `removeTodo` will receive that same uuid based `todoID` that was generated and stored at creation.

```diff
> src/Todo.js
---
+removeTodo = async todoID => {
+  const todos = { ...this.state.todos };
+  delete todos[todoID];
+  this.setState({ todos });
+}
```


<details><summary>removeTodo explained</summary>


Just as with create, our removeTodo function takes a single argument. Instead of todo data it instead accepts an ID which represents some previously created todo item. Because we use `this` inside of the function, the arrow operator is crucial.

```diff
> src/Todo.js
---
+removeTodo = async todoID => {
```

The body of `removeTodo` is straightforward enough. We copy `this.state` and delete the ID of the provided todo. Then, using the proper `this.setState` function we update the state to reflect the removal.

```diff
> src/Todo.js
---
 removeTodo = async todoID => {
+  const todos = { ...this.state.todos };
+  delete todos[todoID];
+  this.setState({ todos });
+}
```
</details>

<a name="create-and-manipulate-state-code"></a>

<details><summary> Current state of <b> Todo.js </b> </summary>

```JavaScript
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import uuidv4 from 'uuid/v4';

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
      </div>
    );
  }
}

export default Todo;
```
</details>

<a name="displaying-todo-items"></a>

### Displaying Todo Items

[Just Show Me the Code](#displaying-todo-items-code)

Now that we have modifiable state, we can start building the actual Components which will manipulate that state. Considering that this is a todo application we should probably add a way to display todos.

Start by creating a new file in `src` named `TodoList.js`. `TodoList.js` will be our Component responsible for displaying and interacting with todos. Just as with `Todo.js` we'll want to define a class inside `TodoList.js` called... you guessed it `TodoList`. Since we know that every Component must have a valid `render` method defined, let's also go ahead and create an empty stub too.

```diff
> src/TodoList.js
---
+class TodoList extends Component {
+  render() {}
+}
+
+export default TodoList;
```

The next step in building out our `TodoList` class is to bring in the accessors and data that we created in the previous section. We haven't actually passed this data to `TodoList` on the caller side so we'll have to make a mental note and get back to it when we finish the work on our list.

```diff
> src/TodoList.js
---
 render() {
+  const { removeTodo, todos } = this.props;
 }
```


<details><summary>About Components</summary> 

A defining characteristic of React Components is their ability to receive input. All Components share a constructor signature that takes a minimum of 1 argument, `props`. Props amongst other things holds any potential input that was passed in from the caller. Assuming the base functionality is not overwritten, this `props` data will then be available throughout the lifetime of the Component.

</details>


We've defined our class, it's render method and taken in the state and accessors, so now it's time to actually do something with it. Once again we can start off easy and just add our outermost tags in the return statement.

```diff
> src/TodoList.js
---
   const { removeTodo, todos } = this.props;
+  return(
+    <List>
+
+    </List>
+  );
 }
```

The `List` component from Material-UI should simplify our process of creating a dynamic todo display. But because it's from an external library we'll need to import it at the top of our `TodoList.js` file. While we're at it, let's get ahead of ourselves and import the other items we'll need to complete our list.

```diff
> src/TodoList.js
---
+import React, { Component } from 'react';
+
+import CheckIcon from '@material-ui/icons/Check';
+import IconButton from '@material-ui/core/IconButton';
+import List from '@material-ui/core/List';
+import ListItem from '@material-ui/core/ListItem';
+import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
+import ListItemText from '@material-ui/core/ListItemText';

 class TodoList extends Component {
```

It may seem like a lot but it's really not, so don't get overwhelmed.

Moving back to our `render` method remember that we need to fill in the `<List> </List>` with all of the todos our user has added. Using the `todos` variable that we deconstructed from the input `props` we can programatically create a list item for each todo. Native JavaScript maps make this task a breeze.

```diff
> src/TodoList.js
---
 return(
   <List>
+    {
+      Object.keys(todos).map(todoID => (
+        <ListItem key={todoID}>
+
+        </ListItem>
+      ))
+    }
   </List>
 );
```

Map over all of the `todos` using the dict key (which will have been generated using `uuid` in our createTodo method) as a unique identifier for the `ListItem`.

At this point our list has a bunch of items, but they don't have any data which allows them to be displayed. Knowing that each item should show the relevant todo text, let's add a sub-component to each `ListItem` that simply displays the todo text.

```diff
> src/TodoList.js
---
 Object.keys(todos).map(todoID => (
   <ListItem key={todoID}>
+    <ListItemText primary={todos[todoID]} />
   </ListItem>
 ))
```

While displaying the todo is a nice step, we probably want some way to remove the todo when the item has been completed. To accomplish this we can add a secondary action to our outer `ListItem` and connect that to the functionality we defined in `removeTodo`.

```diff
> src/TodoList.js
---
 Object.keys(todos).map(todoID => (
   <ListItem key={todoID}>
     <ListItemText primary={todos[todoID]} />
+    <ListItemSecondaryAction>
+      <IconButton
+         aria-label="Remove"
+         onClick={() => removeTodo(todoID)}
+      >
+        <CheckIcon />
+      </IconButton>
+    </ListItemSecondaryAction>
   </ListItem>
 ))
```

<details><summary>Closer look at remove functionality</summary>

Because we've already added `ListItemText` as our primary component in the `ListItem`, we use `ListItemSecondaryAction` so we can define the additional remove functionality.

```diff
> src/TodoList.js
---
 <ListItem key={todoID}>
   <ListItemText primary={todos[todoID]} />
+  <ListItemSecondaryAction>
+  </ListItemSecondaryAction>
 </ListItem>
```

There needs to be some trigger on our list which can fire the `remove` event. The simplest and most obvious way to accomplish this is with a Button. Specfically we use `IconButton` because it allows us to use an informative Icon for our button, this hopefully makes the functionality self explanatory to the user.

```diff
> src/TodoList.js
---
 Object.keys(todos).map(todoID => (
   <ListItem key={todoID}>
     <ListItemText primary={todos[todoID]} />
     <ListItemSecondaryAction>
+      <IconButton
+        aria-label="Remove"
+        onClick={() => removeTodo(todoID)}
+      >
+      </IconButton>
     </ListItemSecondaryAction>
   </ListItem>
 ))
```

The `aria-label` is simply an internal label used to identify the buttons purpose. More important is `onClick`, this defines what code will be called when the button is pressed. As you can see we hook up `removeTodo` using the `todoID` of the `<ListItem>` who owns the button.

Lastly, we want an icon that communicates the functionality to the user. Usually you remove things from a todo list when you've completed what you need to do. To me, a `Check` communicates this functionality so I'll use the `CheckIcon` I imported earlier. If you feel like my Icon foo is subpar, [here's a link](https://material-ui.com/style/icons/) to all available icons so you can customize with your own choice.


```diff
> src/TodoList.js
---
 Object.keys(todos).map(todoID => (
   <ListItem key={todoID}>
     <ListItemText primary={todos[todoID]} />
     <ListItemSecondaryAction>
       <IconButton
         aria-label="Remove"
         onClick={() => removeTodo(todoID)}
       >
+        <CheckIcon />
       </IconButton>
     </ListItemSecondaryAction>
   </ListItem>
 ))
```

</details>


And that's it, `TodoList` is complete.


The last step is to integrate our new `TodoList` in our centralized `Todo` Component. Keeping in mind the mental note made in the previous section, we make sure to pass the correct input fields so our `TodoList` can operate on the stateful data.

```diff
> src/Todo.js
---
   <div className="Todo">
     <Typography variant="h2" style={{ marginBottom: 30 }}>
       Todo
     </Typography>
+    <TodoList
+      todos={this.state.todos}
+      removeTodo={this.removeTodo}
+    />
   </div>
 );
```

And of course, don't forget to import

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
 import Typography from '@material-ui/core/Typography';

+import TodoList from './TodoList';
```

<a name="displaying-todo-items-code"></a>

<details><summary> Final state <b> TodoList.js </b> </summary>

```JavaScript
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
```

</details>


<details><summary> Current state of <b> Todo.js </b> </summary>

```JavaScript
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import uuidv4 from 'uuid/v4';

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
        <TodoList
          todos={this.state.todos}
          removeTodo={this.removeTodo}
        />
      </div>
    );
  }
}

export default Todo;
```

</details>

<details><summary>Sanity Check</summary>
Although not required, it's usually a good idea to make sure that things work by checking them incrementally. Although there is no external way to add todo items (and therefore validate that our `TodoList` is working), we can add a few temporary lines to fake some user input.

All that we need to do is modify the initial `this.state` we set in the constructor of `Todo.js` to have some pre-made entries. Once that's done, it should be as easy as running the React project locally.

```diff
> src/Todo.js
---
 constructor(props) {
   super(props);
-  this.state = { todos: {} };
+  this.state = {
+    todos: {
+      231231: 'Go shopping',
+      298393: 'Eat dinner',
+      BOGUS: 'anything else that was forgotten',
+    },
+  };
 }
```

Don't forget to revert the change once you feel comfortable with the results!

</details>

<a name="adding-new-todos"></a>

### Adding New Todos

[Just Show Me the Code](#adding-new-todos-code)

We now have centralized state and a way to display that state, but one thing is still missing, the ability to add new todo items. To add a new todo, users will need some type of input field along with a potential button(s) to trigger the `addTodo` event. Let's start as we did for `TodoList` and create a new file in `src` for our input *form* named `TodoForm.js`.

```diff
> src/TodoForm.js
---
+class TodoForm extends Component {
+  render() {}
+}
+
+export default TodoForm;
```

It's clear that the `render` method will need to be filled in before things can start working, but before doing that let's make sure we know what our goal and need(s) are. As we previously discussed, the form should provide the ability to externally add a todo which probably means this Component needs to track the intermediate representation. We'll accomplish this by adding a default todo item and then setting the initial state to the default in the constructor

```diff
> src/TodoForm.js
---
+const EMPTY_TODO = {
+  todoText: '',
+};
+
 class TodoForm extends Component {
+  constructor(props) {
+    super(props);
+    this.state = Object.assign({}, EMPTY_TODO);
+  }
   render() {}
```

The state of our `TodoForm` component will now be used to track the current todo text. Before we move onto our `render` method, let's once again import all the dependencies needed.

```diff
> src/TodoForm.js
---
+import React, {Component} from 'react';

+import AddIcon from '@material-ui/icons/Add';
+import IconButton from '@material-ui/core/IconButton';
+import TextField from '@material-ui/core/TextField';

 const EMPTY_TODO = {
   todoText: '',
 };

 class TodoForm extends Component {
```

The first addition to our `render` method is intended to make our lives a bit easier. At the start of every call to render, we'll extract the text field from the state.

```diff
> src/TodoForm.js
---
 render() {
+  const { todoText } = this.state;
 }
```

Now we can get down to business. Let's add a `form` to `render` which will fire events related to todo additions. Specifically we want to handle the event where a user hits the `enter` key while typing in the form.

```diff
> src/TodoForm.js
---
   const { todoText } = this.state;
+  return(
+    <form
+      onSubmit={this.addTodo}
+    >
+    </form>
+  );
 }
```

As you may have noticed, in the `onSubmit` event handler we refer to a method named `addTodo` which hasn't yet been defined. Now that we understand the structure we can accurately define it. By default the input would be ignored, but by consuming the input and calling out to an external function we can take responsibility for this specific event.

```diff
> src/TodoForm.js
---
 constructor(props) {
   super(props);
   this.state = Object.assign({}, EMPTY_TODO);
 }

+addTodo = (event) => {
+  event.preventDefault();
+  if (this.state.todoText === '') return
+  this.props.createTodo(this.state.todoText);
+  this.setState(EMPTY_TODO);
+}
```

The tricky line `this.props.createTodo(this.state.todoText);` makes an assumption that our `TodoForm` props already has the centralized `createTodo` method that we made in `Todo.js`. Once again we should keep a mental note and remember to pass it in when we move back to `Todo.js`.

Although we have a `form`, it doesn't yet allow users to actually type anything in. Let's fix this by adding a nested `TextField` Component into our form body.

```diff
> src/TodoForm.js
---
   }}
 >
+  <TextField
+    variant="outlined"
+    type="text"
+    placeholder="Add todo"
+    value={todoText}
+    onChange={this.updateTodoText}/>
 </form>
```

`TextField` from `material-ui` takes in a `eventListener` for the `onChange` event. This will be called every time the text is updated, added or removed. Just as with `addTodo` we now need to define and implement the method `updateTodoText` to handle the onChange event.

```diff
> src/TodoForm.js
---
 addTodo = (event) => {
   event.preventDefault();
   if (this.state.todoText === '') return
   this.props.createTodo(this.state.todoText);
   this.setState(EMPTY_TODO);
 }
+
+updateTodoText = event => {
+  const { value } = event.target;
+  this.setState({ todoText: value });
+}
```

Technically, we have everything needed for a working input form. But right now, users are limited to adding todo items with the `enter` key. As a final step, let's add a "submit" button which has identical functionality to the `enter` key we already set up. Luckily, we can reuse the previously defined `addTodo` method for our new button. 

```diff
> src/TodoForm.js
---
   <TextField
     variant="outlined"
     type="text"
     placeholder="Add todo"
     value={todoText}
     onChange={this.updateTodoText}/>
+  <IconButton
+    aria-label="Add"
+    onClick={this.addTodo}
+  >
+    <AddIcon/>
+  </IconButton>
 </form>
```

And with that we have our final change to `TodoForm`. In fact, not only are we done with `TodoForm`, we're also a single change away from having a fully functional app. The last thing to address is the mental note we made in the previous section. Let's go back to `Todo.js` and add the recently created `TodoForm` (while not forgetting to pass the `createTodo` as input).

```diff
> src/Todo.js
---
 <Typography variant="h2" style={{ marginBottom: 30 }}>
   Todo
 </Typography>
+<TodoForm createTodo={this.createTodo} />
 <TodoList
```

And of course, don't forget to import

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
 import Typography from '@material-ui/core/Typography';

 import TodoList from './TodoList';
+import TodoForm from './TodoForm';
```

<a name="adding-new-todos-code"></a>

<details><summary> Current state of <b> TodoForm.js </b> </summary>

```JavaScript
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
```

</details>


<details><summary> Current state of <b> Todo.js </b> </summary>


```JavaScript
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import uuidv4 from 'uuid/v4';

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
```

</details>


You can either check the result by rebuilding and redeploying your function, or by simply running `npm run start` to see a local representation in your browser.

<a name="beast-to-beauty"></a>

### Beast to Beauty

[Just Show Me the Code](#beast-to-beauty-code)

Our todo list is fully functional, but with two small changes we can make it visually appealing as well. The first improvement is adding some simple css that will center our content and give us control over the font. Let's add a new file in `src` named `index.css`, all we'll do is center align the text and choose a wacky font.

```diff
> src/index.css
---
+.Todo {
+  font-family: fantasy;
+  text-align: center;
+}
```

All that's left is to import it in `Todo.js`

```diff
> src/Todo.js
---
 import Typography from '@material-ui/core/Typography';
 import uuidv4 from 'uuid/v4';

+import './index.css';

 import TodoList from './TodoList';
```

This centered most of our content but it actually caused our input form to become offset from the title. To fix this, we'll use an inline style on our form, there are definitely more elegant solutions but it gets the job done for now.


```diff
> src/TodoForm.js
---
 <form
   onSubmit={this.addTodo}
+  style={{ marginLeft: 48 }}
 >
```

This fixes our offset by using a left margin as a simple counter-offset.

<a name="beast-to-beauty-code"></a>

<details><summary>  Final state of <b> TodoForm.js </b>  </summary>

```JavaScript
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
```

</details>


<details><summary> Current state of  <b> Todo.js </b> </summary>


```JavaScript
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
```

</details>

[Serve the Frontend from a Function >](./serve_frontend.md)
