## Build a CRUD Backend with Functions

[< Setup a Redis Data Store](./setup_redis.md)

<details><summary>Skip to "Build a CRUD Backend with Functions"</summary>

  Download [assets](https://github.com/binaris/react-serverless/archive/serve-a-frontend.zip) and get started

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


  ### Setup Redis

  If you already have a Redis account, you can use either a new or pre-existing Redis instance from your account. Otherwise, you have to go through the account and instance creation flow described [here](./setup_redis.md).

  ```bash
  $ export REDIS_HOST=<YOUR_REDIS_HOST> REDIS_PORT=<YOUR_REDIS_PORT> REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
  ```

  ### Setup the Frontend

  ```bash
  $ cd frontend
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
  $ npm install
  $ cd serve_todo
  $ npm install
  ```

  ### To verify that you've successfully caught up...

  ```bash
  $ cd ../
  $ npm run build
  $ npm run deploy
  ```

  And navigate to the URL provided in the output dialog.

</details>

## Table of Contents

1. [Create the Create Function](#backend-create-create)  
1. [Use Environment Variables](#backend-env-vars)  
1. [Create the Read, Update, and Delete Functions](#backend-rud-functions)  
1. [Add CORS support to our Backend Functions](backend-cors-functions)  

<a name="backend-create-create"></a>

### Initialize project

We will create the backend directory, create the Binaris project, and create the Redis functions file.

First, ensure that you are out of the `frontend` directory. If your frontend directory is currently your working directory, first do...

```bash
$ pwd
  /Users/ubuntu/todo/frontend
$ cd ..
```

Then...

```bash
$ mkdir backend
$ cd backend
$ bn create node8 public_create_endpoint
```

We will also rename our generated `function.js` file, since this will contain all four of our CRUD functions.

```bash
$ mv ./function.js functions.js
```

### Update the `binaris.yml` file

We'll update the `entrypoint` field of the function so it maps to the new function location.

```diff
> backend/binaris.yml
---
 functions:
   public_create_endpoint:
     file: functions.js
-    entrypoint: handler
+    entrypoint: create_endpoint
     runtime: node8
```

Time to write our Redis CRUD code.

### Write the Create Code

[Just Show Me the Code](#backend-create-code)

Let's start by adding the CREATE functionality to redisConnection.js.

First we install our dependencies.

```bash
$ npm init -y
$ npm install ioredis uuid
```

First, we will add our dependencies, which include ioredis and uuid.

```diff
> backend/functions.js
---
+'use strict';
+
+const uuid = require('uuid/v4');
+const Redis = require('ioredis');

 exports.handler = async (body, context) => {
```

Let's also clear out the generated boilerplate code. We are going to have all of our handlers in one file, so we will rename the handler function. We also will not have to use the context argument, so we will be removing that as well.

```diff
> backend/functions.js
---
-exports.handler = async (body, context) => {
+exports.createEndpoint = async (body) => {
-  const name = context.request.query.name || body.name || 'World';
-  return `Hello ${name}!`;
 }
```

Next, we will be creating our hash key for Redis, and setting up our Redis client.

```diff
> backend/functions.js
---
 const Redis = require('ioredis');
+
+const HASH_KEY = 'todoList';
+
+const client = new Redis({
+  host: <YOUR_REDIS_HOST>,
+  port: <YOUR_REDIS_PORT>,
+  password: <YOUR_REDIS_PASSWORD>,
+});
+
exports.createEndpoint = async (body) => {
```

Now that we have done all the setup, we can write our create function. This function will generate a unique key for the message in the hash set, insert the message with the key, and return the key value pair.

```diff
> backend/functions.js
---
   password: <YOUR_REDIS_PASSWORD>,
 });
+
 exports.createEndpoint = async (body) => {
+  const key = uuid();
+  await hSet(HASH_KEY, key, body.message);
+  return { [key]: body.message };
 }
```

We will also add in a helper function that will validate our body parameters for us. By default, Binaris returns an empty dict, so we just need to check for our expected parameters.

```diff
> backend/functions.js
---
   password: <YOUR_REDIS_PASSWORD>,
 });

+function validateBody(body, ...fields) {
+  for(const field of fields) {
+    if (!body[field]) {
+      throw new Error(`Missing request body parameter: ${field}.`);
+    }
+  }
+}
+
 exports.createEndpoint = async (body) => {
```

Now let's implement our body validation function in our create function. The only parameter we need for create is the message, so we will pass that into the `validateBody` method.

```diff
> backend/functions.js
---
 exports.createEndpoint = async (body) => {
+  validateBody(body, 'message');
   const key = uuid();
   await hSet(HASH_KEY, key, body.message);
   return { [key]: body.message };
 }
```

With our first function written, it's time to deploy and test it!

```bash
$ bn deploy public_create_endpoint
```

> Note: The invocation methods that will print out after deployment will not include the required `data` field. To invoke successfully, use one of the following methods:
>```bash
> $ bn invoke public_create_endpoint --data '{"message": "test"}'
> $ curl https://run.binaris.com/v2/run/{your_account_id}/public_create_endpoint --data '{"message": "test"}'
>```

<a name="backend-create-code"></a>

<details><summary> Current state of <b> binaris.yml </b> </summary>

```yml
functions:
  public_create_endpoint:
    file: functions.js
    entrypoint: create_endpoint
    runtime: node8
```

</details> 

<details><summary> Current state of <b> functions.js </b> </summary>

```JavaScript
`use strict`;

const uuid = require('uuid/v4');
const Redis = require('ioredis');

const HASH_KEY = 'todoList';

const client = new Redis({
  host: <YOUR_REDIS_HOST>,
  port: <YOUR_REDIS_PORT>,
  password: <YOUR_REDIS_PASSWORD>,
});

function validateBody(body, ...fields) {
  for (const field of fields) {
    if (!body[field]) {
      throw new Error(`Missing request body parameter: ${field}.`);
    }
  }
}

exports.createEndpoint = async (body, context) => {
  validateBody(body, 'message');
  const key = uuid();
  await hSet(HASH_KEY, key, body.message);
  return { [key]: body.message };
};
```

</details>

<a name="backend-env-vars"></a>

###  Use Environment Variables

Now that our function is working, let's add our Redis secrets to our environment variables so that we can access them from our `binaris.yml` file. (that way, if you decide to commit this code anywhere, your secrets are safe!).

```bash
$ export REDIS_HOST=<YOUR_REDIS_HOST> REDIS_PORT=<YOUR_REDIS_PORT> REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
```

With our Redis secrets in our environment variables, we can add them to our `binaris.yml` file. We will also alias them as `COMMON`, since we will need to use them with our other functions later on. For more information on how to use yaml aliases, see [this link](https://github.com/cyklo/Bukkit-OtherBlocks/wiki/Aliases-(advanced-YAML-usage)).

```diff
> backend/binaris.yml
---
functions:
 public_create_endpoint:
   file: src/create.js
   entrypoint: handler
   runtime: node8
+  env:
+    <<: &COMMON
+      REDIS_HOST:
+      REDIS_PORT:
+      REDIS_PASSWORD:
```

With the constants in our `binaris.yml`, we can reference them in our code.

```diff
> backend/functions.js
---
 const redis = require('redis');

 const HASH_KEY = 'todoList';

+const {
+  REDIS_HOST: host,
+  REDIS_PORT: port,
+  REDIS_PASSWORD: password,
+} = process.env;
+
```

Now that we have the environment variable constants, let's use them in the redis client creation.

```diff
> backend/functions.js
---
} = process.env;

 const client = redis.createClient({
-  host: <YOUR_REDIS_HOST>,
-  port: <YOUR_REDIS_PORT>,
-  password: <YOUR_REDIS_PASSWORD>,
+  host,
+  port,
+  password,
 });
```

Time to redeploy our create function to propogate these changes.

```bash
$ bn deploy public_create_endpoint
```

<a name="backend-rud-functions"></a>
## Create the Read, Update and Delete Functions

[Just Show Me the Code](#backend-final-code)

Time to create our other three functions. First, let's update our `binaris.yml` file to add the necessary functions, handlers, and environment variables.

```diff
> backend/binaris.yml
---
 functions:
   public_create_endpoint:
     file: functions.js
     entrypoint: create_endpoint
     runtime: node8
     env:
       <<: &COMMON
         REDIS_HOST:
         REDIS_PORT:
         REDIS_PASSWORD:
+  public_read_endpoint:
+    file: functions.js
+    entrypoint: read_endpoint
+    runtime: node8
+    env:
+      <<: *COMMON
+  public_update_endpoint:
+    file: functions.js
+    entrypoint: update_endpoint
+    runtime: node8
+    env:
+      <<: *COMMON
+  public_delete_endpoint:
+    file: functions.js
+    entrypoint: delete_endpoint
+    runtime: node8
+    env:
+      <<: *COMMON
```

With the setup in our `binaris.yml` complete, let's add the function handlers in our `functions.js` file.

```diff
> backend/functions.js
---
 exports.createEndpoint = async (body) => {
   validateBody(body, 'message');
   const key = uuid();
   await client.hset(HASH_KEY, key, body.message);
   return { [key]: body.message };
 };
+
+exports.readEndpoint = async () => {
+  const redisDict = await client.hgetall(HASH_KEY);
+  return redisDict;
+};
+
+exports.updateEndpoint = async (body) => {
+  validateBody(body, 'message', 'id');
+  await client.hset(HASH_KEY, body.id, body.message);
+  return { [body.id]: body.message };
+};
+
+exports.deleteEndpoint = async (body) => {
+  validateBody(body, 'id');
+  client.hdel(HASH_KEY, body.id);
+};
```

With our handler complete, we can now deploy our new binaris functions.

```bash
$ bn deploy public_read_endpoint
$ bn deploy public_update_endpoint
$ bn deploy public_delete_endpoint
```

<a name="backend-final-code"></a>

<details><summary> Current State of <b> binaris.yml </b> </summary>

```yml
functions:
  public_create_endpoint:
    file: functions.js
    entrypoint: create_endpoint
    runtime: node8
    env:
      <<: &COMMON
        REDIS_HOST:
        REDIS_PORT:
        REDIS_PASSWORD:
  public_read_endpoint:
    file: functions.js
    entrypoint: read_endpoint
    runtime: node8
    env:
      <<: *COMMON
  public_update_endpoint:
    file: functions.js
    entrypoint: update_endpoint
    runtime: node8
    env:
      <<: *COMMON
  public_delete_endpoint:
    file: functions.js
    entrypoint: delete_endpoint
    runtime: node8
    env:
      <<: *COMMON
```
.p
</details> 

<details><summary> Current State of <b> functions.js </b> </summary>

```JavaScript
`use strict`;

const uuid = require('uuid/v4');
const Redis = require('ioredis');

const HASH_KEY = 'todoList';

const {
  REDIS_HOST: host,
  REDIS_PORT: port,
  REDIS_PASSWORD: password,
} = process.env;

const client = new Redis({
  host,
  port,
  password,
});

function validateBody(body, ...fields) {
  for (const field of fields) {
    if (!body[field]) {
      throw new Error(`Missing request body parameter: ${field}.`);
    }
  }
}

exports.createEndpoint = async (body) => {
  validateBody(body, 'message');
  const key = uuid();
  await hSet(HASH_KEY, key, body.message);
  return { [key]: body.message };
};

exports.readEndpoint = async () => {
  const redisDict = await client.hgetall(HASH_KEY);
  return redisDict;
};

exports.updateEndpoint = async (body) => {
  validateBody(body, 'message', 'id');
  await client.hset(HASH_KEY, body.id, body.message);
  return { [body.id]: body.message };
};

exports.deleteEndpoint = async (body) => {
  validateBody(body, 'id');
  client.hdel(HASH_KEY, body.id);
};
```
</details>

<a name="backend-cors-functions"></a>

### Add CORS support to our Backend Functions

[Just Show Me The Code](#backend-cors-code)

One last step with the backend; our frontend functions will be using [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) to communicate with the backend, so we need to support CORS requests and responses. One specific thing we will need to support is [CORS Preflight Requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request). Additionally, our responses will have to support CORS Headers.

Let's start by adding the function that will be wrapping our return values in HTTPResponses, and adding the CORS headers that our frontend will be expecting from us. This function takes in the context and the intended response body, and returns a CORS-compliant response.

```diff
> backend/functions.js
---
       throw new Error(`Missing request body parameter: ${field}.`);
     }
   });
 }
+
+function responseContent(context, responseBody) {
+  const response = {
+    statusCode: 200,
+    headers: {
+      'Access-Control-Allow-Origin': '*',
+      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
+    },
+  };
+  if (body !== undefined) {
+    response.headers['Content-Type'] = 'application/json';
+    response.body = JSON.stringify(responseBody);
+  }
+  return new context.HTTPResponse(response);
+}
```

Next, we create the function that will handle the CORS preflight requests. This function will:
1. Intercept all requests that are sent to the specific CRUD function
1. Check to see if it is a preflight request
1. If so, return a blank response
1. Otherwise, return the wrapped response from the designated CRUD function.

```diff
> backend/functions.js
---
+    response.body = JSON.stringify(responseBody);
+  }
+  return new context.HTTPResponse(response);
+}
+
+function handleCORS(handler) {
+  return async (body, context) => {
+    if (context.request.method === 'OPTIONS') {
+      return responseContent(context);
+    }
+    const result = await handler(body);
+    return responseContent(context, result);
+  };
+}
```

Now that our CORS preflight-handling [decorator](https://www.sitepoint.com/javascript-decorators-what-they-are/) is written, we can add it to each of our function handlers.

```diff
> backend/functions.js
---
-exports.createEndpoint = async (body) => {
+exports.createEndpoint = handleCORS(async (body) => {
   validateBody(body, 'message');
   const key = uuid();
   await client.hset(HASH_KEY, key, body.message);
   return { [key]: body.message };
-}
+});

-exports.readEndpoint = async (body) => {
+exports.readEndpoint = handleCORS(async (body) => {
   const redisDict = await client.hgetall(HASH_KEY);
   return redisDict;
-}
+});

-exports.updateEndpoint = async(body) => {
+exports.updateEndpoint = handleCORS(async (body) => {
   validateBody(body, 'message', 'id');
   await client.hset(HASH_KEY, body.id, body.message);
   return { [body.id]: body.message };
-}
+});

-exports.deleteEndpoint = async (body) => {
+exports.deleteEndpoint = handleCORS(async (body) => {
   validateBody(body, 'id');
   client.hdel(HASH_KEY, body.id);
-}
+});
```

<a name="backend-cors-code"></a>

<details><summary> Final State of <b> binaris.yml </b> </summary>

```yml
functions:
  public_create_endpoint:
    file: functions.js
    entrypoint: create_endpoint
    runtime: node8
    env:
      <<: &COMMON
        REDIS_HOST:
        REDIS_PORT:
        REDIS_PASSWORD:
  public_read_endpoint:
    file: functions.js
    entrypoint: read_endpoint
    runtime: node8
    env:
      <<: *COMMON
  public_update_endpoint:
    file: functions.js
    entrypoint: update_endpoint
    runtime: node8
    env:
      <<: *COMMON
  public_delete_endpoint:
    file: functions.js
    entrypoint: delete_endpoint
    runtime: node8
    env:
      <<: *COMMON
```
.p
</details> 

<details><summary> Final State of <b> functions.js </b> </summary>

```JavaScript
'use strict';

const uuid = require('uuid/v4');
const Redis = require('ioredis');

const HASH_KEY = 'todoList';

const {
  REDIS_HOST: host,
  REDIS_PORT: port,
  REDIS_PASSWORD: password,
} = process.env;

const client = new Redis({
  host,
  port,
  password,
});

function validateBody(body, ...fields) {
  for (const field of fields) {
    if (!body[field]) {
      throw new Error(`Missing request body parameter: ${fields}.`);
    }
  }
}

function responseContent(context, responseBody) {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
  };
  if (responseBody !== undefined) {
    response.headers['Content-Type'] = 'application/json';
    response.body = JSON.stringify(responseBody);
  }
  return new context.HTTPResponse(response);
}

function handleCORS(handler) {
  return async (body, context) => {
    if (context.request.method === 'OPTIONS') {
      return responseContent(context);
    }
    const result = await handler(body);
    return responseContent(context, result);
  };
}

exports.createEndpoint = handleCORS(async (body) => {
  validateBody(body, 'message');
  const key = uuid();
  await client.hset(HASH_KEY, key, body.message);
  return { [key]: body.message };
});

exports.readEndpoint = handleCORS(async () => {
  const redisDict = await client.hgetall(HASH_KEY);
  return redisDict;
});

exports.updateEndpoint = handleCORS(async (body) => {
  validateBody(body, 'message', 'id');
  await client.hset(HASH_KEY, body.id, body.message);
  return { [body.id]: body.message };
});

exports.deleteEndpoint = handleCORS(async (body) => {
  validateBody(body, 'id');
  client.hdel(HASH_KEY, body.id);
});
```

</details> 

Finally, we redeploy and we are done with the backend!

```bash
$ npm run deploy
```

[Call the Backend Functions from the React Frontend >](./connect_everything.md)
