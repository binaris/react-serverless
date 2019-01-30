# Call the Backend Functions From the React Frontend

[< Build a CRUD Backend with Functions](./build_a_crud.md)

<details><summary>Skip to "Call the Backend Functions from the React Frontend"</summary>

  Download [assets](https://github.com/binaris/react-serverless/archive/build-a-crud.zip) and get started

  ### Setup Your Binaris Environment

  For the next section you will need a Binaris account, if you already have one skip the following four steps.

  1. Visit https://binaris.com/try
  1. Follow the instructions and create your new Binaris account
  1. Install the CLI via `npm`
      ```bash
      npm install binaris -g
      ```
  1. Use `bn login` to authenticate with your newly created Binaris account
  1. (Optional) visit our [getting started](https://dev.binaris.com/tutorials/nodejs/getting-started/) page to learn the basics

  ### Setup Redis

  If you already have a Redis account, you can use either a new or pre-existing Redis instance from your account. Otherwise, you have to go through the account and instance creation flow described [here](./setup_redis.md).

  ```bash
  $ export REDIS_HOST=<YOUR_REDIS_HOST> REDIS_PORT=<YOUR_REDIS_PORT> REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
  ```

  ### Setup the Frontend and Backend

  ```bash
  $ cd backend
  $ npm install
  $ npm run deploy
  $ cd ../frontend
  ```

  Add a "homepage" so that React routing uses your account specific function URL. Make sure to replace `<ACCOUNT_ID>` with your specific Binaris account ID. Assuming you successfully ran `bn login`, your account ID can be found in `~/.binaris.yml`.

  > Note: Your Account ID will always be a unique number, 10 digits in length.

  ```diff
  > frontend/package.json
  ---
   "private": true,
  -"homepage": "https://run.binaris.com/v2/run/<ACCOUNT_ID>/public_serve_todo",
  +"homepage": "https://run.binaris.com/v2/run/23232*****/public_serve_todo",
   "dependencies": {
  ```

  ```bash
  $ cd serve_todo
  $ npm install
  $ cd ../
  $ npm install
  ```

  ### To verify that you've successfully caught up...

  ```bash
  $ npm run build && npm run deploy
  ```

  And navigate to the URL provided in the output dialog.

</details>



## Table of Contents
1. [Define our Backend Interface](#backend-interface)  
1. [Connect the Things](#connect-the-things)  

Now that the backend and frontend are finished, the only task left is to hook them up. We know that the frontend will need to communicate with the backend, and because we adopted the `CRUD` paradigm, our interface should be relatively straightforward.


<a name="backend-interface"></a>

### Define our Backend Interface

[Just Show Me the Code](#backend-interface-code)

It's good practice to separate responsibilities, especially when frontend and backend code is involved. So let's make a new file in `frontend/src/` named `BinarisAPI.js`, which will be the interface between the frontend and backend logic.

We need to make some requests, but how do we know where to make the requests? This answer will come later but for now we can assume that our `BinarisAPI` is passed the root account endpoint. The root account endpoint is the portion of the endpoint that doesn't contain function specific information.

```
// function specific BAD
https://run.binaris.com/v2/run/1234*****/fooFunc

// account specific GOOD
https://run.binaris.com/v2/run/1234*****/

```

With that in mind, let's make the class BinarisAPI with a constructor that takes in a single `rootEndpoint` argument.

```diff
> src/BinarisAPI.js
---
+class BinarisAPI {
+  constructor(rootEndpoint) {
+  }
+}
+
+export default BinarisAPI;
```

We know that, by the end, we'll need to handle four different endpoints (one for each `CRUD` operation), fortunately the endpoint for each function is deterministic, so we can already define them. We'll use the `url-join` package from npm to join our urls just to play things on the safe side.

```diff
> src/BinarisAPI.js
---
+import urljoin from 'url-join';
+
 class BinarisAPI {
   constructor(rootEndpoint) {
+    this.createEndpoint = urljoin(rootEndpoint, 'public_create_endpoint');
+    this.readEndpoint = urljoin(rootEndpoint, 'public_read_endpoint');
+    this.updateEndpoint = urljoin(rootEndpoint, 'public_update_endpoint');
+    this.deleteEndpoint = urljoin(rootEndpoint, 'public_delete_endpoint');
   }
```

We've defined all our endpoints, so now it's time to start thinking about the requests that need to be sent. Although each CRUD operation is using a different endpoint, they do share some similarities. For example, all requests will be POST requests and must have `CORS` enabled

Knowing this, let's write a generic request handler that can be used for all of the CRUD operations.

```diff
> src/BinarisAPI.js
---
 import urljoin from 'url-join';

+function CORSOptions(itemData) {
+  const options = {
+    method: 'POST',
+    mode: 'cors',
+  };
+  if (itemData) {
+    options.body = JSON.stringify(itemData);
+    options.headers = { 'Content-Type': 'application/json' };
+  }
+  return options;
+}

 class BinarisAPI {
```

We define the function outside of the class scope because we don't want it being called directly from external users.

`reqWithCORS` covers all our bases in terms of CRUD operations, so all that's left is to actually utilize it. We'll accomplish this by wrapping each `CRUD` operation in a class method, while adhering to the API defined in the backend tutorial.

```diff
> src/BinarisAPI.js
---
     this.updateEndpoint = urljoin(rootEndpoint, 'public_update_endpoint');
     this.deleteEndpoint = urljoin(rootEndpoint, 'public_delete_endpoint');
   }

+  async createItem(item) {
+    const res = await fetch(this.createEndpoint, CORSOptions({ message: item }));
+    return res.json();
+  }
+
+  async readAllItems() {
+    const res = await fetch(this.readEndpoint, CORSOptions());
+    return res.json();
+  }
+
+  async updateItem(itemID, item) {
+    const mergeData = {
+      message: item,
+      id: itemID,
+    };
+    const res = await fetch(this.updateEndpoint, CORSOptions(mergeData));
+    return res.json();
+  }
+
+  async deleteItem(itemID) {
+    await fetch(this.deleteEndpoint, CORSOptions({ id: itemID }));
+  }
 }

 export default BinarisAPI;
```

<a name="backend-interface-code"></a>

<details><summary> Final state of <b> BinarisAPI.js </b> </summary>

```JavaScript
import urljoin from 'url-join';

function CORSOptions(itemData) {
  const options = {
    method: 'POST', 
    mode: 'cors',
  };
  if (itemData) {
    options.body = JSON.stringify(itemData);
    options.headers = { 'Content-Type': 'application/json' };
  }
  return options;
}

class BinarisAPI {
  constructor(rootEndpoint) {
    this.createEndpoint = urljoin(rootEndpoint, 'public_create_endpoint');
    this.readEndpoint = urljoin(rootEndpoint, 'public_read_endpoint');
    this.updateEndpoint = urljoin(rootEndpoint, 'public_update_endpoint');
    this.deleteEndpoint = urljoin(rootEndpoint, 'public_delete_endpoint');
  }

  async createItem(item) {
    const res = await fetch(this.createEndpoint, CORSOptions({ message: item }));
    return res.json();
  }

  async readAllItems() {
    const res = await fetch(this.readEndpoint, CORSOptions());
    return res.json();
  }

  async updateItem(itemID, item) {
    const mergeData = {
      message: item,
      id: itemID,
    };
    const res = await fetch(this.updateEndpoint, CORSOptions(mergeData));
    return res.json();
  }

  async deleteItem(itemID) {
    await fetch(this.deleteEndpoint, CORSOptions({ id: itemID }));
  }
}

export default BinarisAPI;
```

</details>


<a name="connect-the-things"></a>

### Connect the Things

[Just Show Me the Code](#connect-the-things-code)

Our final task is to integrate the API into our `Todo.js` file. We'll replace our temporary in-memory solution with the API we just defined.

Start by importing our new file.

```diff
> src/Todo.js
---
 import TodoForm from './TodoForm';

+import BinarisAPI from './BinarisAPI';

 class Todo extends Component {
```

We made an assumption while writing `BinarisAPI.js` that the root endpoint would be passed into the constructor. Of course it's possible to hardcode the URL here, but why not opt for a more elegant solution. `create-react-app` supports environment variables out of the box so let's utilize them.

In our `Todo` constructor we'll check to see if the expected environment variable exists, if it doesn't we'll throw an error. If it does exist we can then use it to create our backend API.

```diff
> src/Todo.js
---
 constructor(props) {
   super(props);
   this.state = { todos: {} };
+
+  if (!process.env.REACT_APP_BINARIS_ROOT_ENDPOINT) {
+    throw new Error('Environment variable "REACT_APP_BINARIS_ROOT_ENDPOINT" is required!');
+  }
+  this.backend = new BinarisAPI(process.env.REACT_APP_BINARIS_ROOT_ENDPOINT);
 }
```

The backend is now initialized in our `Todo` application. Now, all we're left to do is update our existing operations to utilize the remote state. 

Starting with `removeTodo`, the changes are incredibly minimal. It's safe to delete without looking at the response, considering an error in the request will make the next two lines unreachable.

```diff
> src/Todo.js
---
 removeTodo = async todoID => {
+  await this.backend.deleteItem(todoID);
   const todos = { ...this.state.todos };
   delete todos[todoID];
   this.setState({ todos });
 }
```

`createTodo` is a bit trickier but still pretty straightforward. The backend now has responisbility for unique ID generation, so we can remove it in the frontend. Additionally, we now use the direct response from the backend to populate the new todo item in our state.

```diff
> src/Todo.js
---
 createTodo = async todoText => {
-  const uniqueID = uuidv4();
+  const newItemData = await this.backend.createItem(todoText);
   this.setState({
     todos: {
       ...this.state.todos,
-      [uniqueID]: todoText,
+      ...newItemData,
     }
   });
 }
```

Don't forget to remove the now unused `uuid`.

```diff
> src/Todo.js
---
 import React, { Component } from 'react';
 import Typography from '@material-ui/core/Typography';
-import uuidv4 from 'uuid/v4';

 import './index.css';
```

If we were to test things right now, they would be mostly functional. However, you would quickly notice that refreshes to the page fail to maintain the previous state. This is because we don't actually fetch the initial state when we initialize our frontend. Your initial thought might be to add this functionality into the `constructor`, but unfortunately, it won't work. There are two reasons the `constructor` can't be used to accomplish this,

1. In ECMAScript the `constructor` is a reserved keyword and cannot be declared `async`. This means our remote backend calls would need to be handled elsewhere causing a mess.

2. When using React, a constructor being called doesn't indicate that the Component itself has been added to the root `div`. Instead, React provides a dedicated method which is guaranteed to be called when your Component is fully intialized and mounted, `componentDidMount`.

By making `componentDidMount` async we can use it to load in our initial backend state.

```diff
> src/Todo.js
---
       ...newItemData,
     }
   });
 }

+async componentDidMount() {
+  const existingData = await this.backend.readAllItems();
+  this.setState({ todos: existingData || {} });
+}
```

Now our todo list will be populated with the initial backend state every time it's loaded.


<a name="connect-the-things-code"></a>


<details><summary> Final state of <b> Todo.js </b> </summary>

```JavaScript
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
```

</details>

The code is done but we have two little steps left before things will work.

```bash
$ npm install url-join
```

And lastly, export the root endpoint environment variable.

```bash
$ export REACT_APP_BINARIS_ROOT_ENDPOINT="https://run.binaris.com/v2/run/1234******/"
```

Now, just rebuild and redeploy and everything will work.

```bash
$ npm run build && npm run deploy
```
