# Serve the Frontend from a Function

[< Develop a Frontend on Your Local Machine](./develop_frontend.md)

<details><summary>Skip to "Serve the Frontend from a Function"</summary>

  Download [assets](https://github.com/binaris/react-serverless/archive/develop-a-frontend.zip) and get started

  ### Setup the Frontend

  ```bash
  $ cd frontend
  $ npm install
  ```

  ### To verify that you've successfully caught up...

  ```bash
  $ npm run start
  ```

</details>

## Table of Contents
1. [Setup Your Binaris Environment](#setup-binaris-environment)  
1. [Create a Binaris Function to Serve a Web App](#function-serve-webapp)  
1. [Deploy the React Project with Your Function](#deploy-react-project-function)  

<a name="setup-binaris-environment"></a>

### Setup Your Binaris Environment

For the next section you will need a Binaris account, if you already have one skip the following four steps.

1. Visit [signup](https://binaris.com/signup?t=8CDa36)
1. Follow the instructions and create your new Binaris account
1. Install the CLI via `npm`
    ```bash
    npm install binaris -g
    ```
1. Use `bn login` to authenticate with your newly created Binaris account
1. (Optional) visit our [getting started](https://dev.binaris.com/tutorials/nodejs/getting-started/) page to learn the basics



 <a name="function-serve-webapp"></a>

### Create a Binaris Function to Serve a Web App

[Just Show Me the Code](#function-serve-webapp-code)

Make a new sub-directory inside `frontend` (generated with `create-react-app`), name it `serve_todo`.

```bash
$ ls
  README.md    package.json serve_todo yarn.lock
  node_modules public       src

$ mkdir serve_todo
```

Navigate into the `serve_todo` directory and use `bn create` to generate the template files for our serving function.

```bash
$ cd serve_todo
$ bn create node8 public_serve_todo --executionModel concurrent

Created function public_serve_todo in /home/ubuntu/todo/frontend/serve_todo
  (use "bn deploy public_serve_todo" to deploy the function)
```

The `public_` prefix is essential because it tells the Binaris backend that the function should be publicly available to the world. This allows us to utilize the function just as we would any other webserver via https. Keep in mind that although `public_` is the right choice here, there are many other cases where requiring authentication and keeping things private is preferred.

Before we start writing code, it's important to define our goal and what we need to achieve that goal. We know our goal is to serve our React app via a function, which means we need a way to serve static files directly from the function itself.

Now, it's time to write our first Binaris function together.

1. Strip the automatically generated contents from the handler body in `function.js`

    ```diff
    > function.js
    ---
     exports.handler = async (body, context) => {
    -  const name = context.request.query.name || body.name || 'World';
    -  return `Hello ${name}!`;
     }
    ```

2. Create & define the current resource path as the path provided in the input request.

    ```diff
    > function.js
    ---
     exports.handler = async (body, context) => {
    +  let resourcePath = context.request.path;
     }
    ```

3. The above code will work when passed an explicit resource path, we also want to handle the case where only the base URL is provided. In that case, we simply want to return the `index.html`.

    ```diff
    > function.js
    ---
     let resourcePath = context.request.path;

    +if (resourcePath === '/' || resourcePath === undefined) {
    +  resourcePath = '/index.html';
    +}
    ```

4. Now that we know the path to our resource, we can load the requested content. We assume that our assets will be deployed with the function and therefore should be available on the local filesystem. The Node `fs` module seems like a great fit here, but unfortunately it's not natively `async`. To remedy this, we'll rely on the package [mz](https://www.npmjs.com/package/mz) which provides a promisified version of the native `fs` module.

    ```diff
    > function.js
    ---
     if (resourcePath === '/' || resourcePath === undefined) {
        resourcePath = '/index.html';
     }

    +// we assume that all paths provided have a leading "/"
    +const webResource = await fs.readFile(`.${resourcePath}`);
    ```

    We also need to add our `require` statement for `mz` at the top of the file.

    ```diff
    > function.js
    ---
    +const fs = require('mz/fs');
    +
     exports.handler = async (body, context) => {
    ```

5. Now that we have the requested resource loaded, we need to determine what type of resource it is. That way, the correct `Content-Type` header can be set. Luckily, the npm module `mime-types`, in combination with the builtin Node module `path`, can do the heavy lifing for us.

    ```diff
    > function.js
    ---
     }

     const webResource = await fs.readFile(`.${resourcePath}`);
    +const resourceType = mime.contentType(path.extname(resourcePath));
    ```

    Once again, we need to add `require` statements for `mime-types` and `path` at the top of the file.

    ```diff
    > function.js
    ---
     const fs = require('mz/fs');
    +const mime = require('mime-types');
    +const path = require('path');
    ```

6. All that's left is returning a `HTTPResponse` object and filling it in with the variables we created.

    
    ```diff
    > function.js
    ---
     const webResource = await fs.readFile(`.${resourcePath}`);
     const resourceType = mime.contentType(path.extname(resourcePath));

    +return new context.HTTPResponse({
    +  statusCode: 200,
    +  headers: {
    +    'Content-Type': resourceType,
    +    'Access-Control-Allow-Origin': '*',
    +    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    +  },
    +  body: webResource,
    +});
    ```

    > Note: `'Access-Control-Allow-Origin': '*'` means that anyone (even evil websites) will be able to modify your todo list. Consider using your own domain (or function URL) to alleviate this issue.

    <details><summary>HTTPResponse breakdown</summary>

    We consider returning any resource a success and therefore "200"

    ```diff
    > function.js
    ---
    +statusCode: 200,
    ```

    The first header, `'Content-Type'`, identifies the type of our response body. For its value, we can simply use the `resourceType` variable that was calculated using the `mime-types` package. 
    
    React has issues when you use non-root routes as a homepage. To alleviate this, we will enable [CORS](    https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in our response by adding the `'Access-Control-Allow-Origin'` and `'Access-Control-Allow-Headers'` headers.

    ```diff
    > function.js
    ---
    +headers: {
    +  'Content-Type': resourceType,
    +  'Access-Control-Allow-Origin': '*',
    +  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    +},
    ```

    Last but not least we need to actually provide the content that should be returned in the response. The `webResource` variable contains the resource we loaded from file, and therefore should go into the body field.

    ```diff
    > function.js
    ---
    +body: webResource,
    ```

    </details>


<a name="function-serve-webapp-code"></a>

<details><summary> Final state of <b> function.js </b> </summary>


```JavaScript
const fs = require('mz/fs');
const mime = require('mime-types');
const path = require('path');

exports.handler = async (body, context) => {
  let resourcePath = context.request.path;

  if (resourcePath === '/' || resourcePath === undefined) {
    resourcePath = '/index.html';
  }

  const webResource = await fs.readFile(`.${resourcePath}`);
  const resourceType = mime.contentType(path.extname(resourcePath));

  return new context.HTTPResponse({
    statusCode: 200,
    headers: {
      'Content-Type': resourceType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    body: webResource,
  });
};
```


</details>


**Before We Forget**

We do have one final task before moving on. Although we required our dependencies, they haven't been installed yet. To install them run 

```bash
$ npm init -y
$ npm install mime-types mz path
```
inside of the `serve_todo` directory.


<a name="deploy-react-project-function"></a>

### Deploy the React Project with Your Function

Before we can see our function in action, there are two small changes we need to make in our outer `frontend/package.json`. These changes will allow our React app to be hosted in the recently created `public_serve_todo` function.

1. Add a "homepage" so that React routing uses your account specific function URL. Make sure to replace `<ACCOUNT_ID>` with your specific Binaris account ID. Assuming you successfully ran `bn login`, your account ID can be found in `~/.binaris.yml`.

    > Note: Your Account ID will always be a unique number, 10 digits in length.


    ```diff
    > frontend/package.json
    ---
     "private": true,
    +"homepage": "https://run.binaris.com/v2/run/<ACCOUNT_ID>/public_serve_todo",
     "dependencies": {
    ```

2. Add a new script to `frontend/package.json` which will save some time when deploying our function
    ```diff
    > frontend/package.json
    ---
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
    +  "deploy": "cp -R serve_todo/* build/ && cd build && bn deploy public_serve_todo",
       "test": "react-scripts test",
       "eject": "react-scripts eject"
    ```

Finally, deploy your function using `npm run build` followed by `npm run deploy` and vist the function URL (printed by your console) in the browser. Hurray!

```bash
$ pwd
  /Users/ubuntu/todo/frontend
$ npm run build
$ npm run deploy
```

[Set Up a Redis Datastore >](./setup_redis.md)
