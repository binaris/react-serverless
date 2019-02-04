<details><summary>Skip to "Serve the Frontend from a Function"</summary>

  ### Setup the frontend

  ```bash
  $ cd frontend
  $ npm install
  ```

  ### To verify that you've successfully caught up...

  ```bash
  $ npm run start
  ```

</details>



<details><summary>Skip to "Set Up a Redis Datastore"</summary>

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

  ### Setup the Frontend

  ```bash
  $ cd frontend
  ```

  Add a "homepage" so that React routing uses your account specific function URL. Make sure to replace `<ACCOUNT_ID>` with your specific Binaris account ID. Assuming you successfully ran `bn login`, your account ID can be found in `~/.binaris.yml`.

  > Note: Your account ID will always be a unique number, 10 digits in length.

  ```diff
  > frontend/package.json
  ---
   "private": true,
  -"homepage": "https://run.binaris.com/v2/run/<ACCOUNT_ID>/public_serve_todo",
  +"homepage": "https://run.binaris.com/v2/run/23232*****/public_serve_todo",
   "dependencies": {
  ```

  And then run the following commands

  ```bash
  $ npm install
  $ cd serve_todo
  $ npm install
  ```

  ### To verify that you've successfully caught up...

  ```bash
  $ cd ../
  $ npm run build && npm run deploy
  ```


</details>

<details><summary>Skip to "Build a CRUD Backend with Functions"</summary>

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

<details><summary>Skip to "Call the Backend Functions from the React Frontend"</summary>


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

<details><summary>Skip to "Just do it for me"</summary>

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

  ### Setup everything

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
  +"homepage": "https://run.binaris.com/v2/run/1234******/public_serve_todo",
   "dependencies": {
  ```

  Export the root endpoint environment variable (using your personal `ACCOUNT_ID`)

  ```bash
  $ export REACT_APP_BINARIS_ROOT_ENDPOINT="https://run.binaris.com/v2/run/1234******/"
  $ cd serve_todo
  $ npm install
  $ cd ../
  $ npm install && npm run build && npm run deploy
  ```

  Navigate to the URL provided in the output dialog to view your app.


</details>
