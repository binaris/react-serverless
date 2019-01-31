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
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      throw new Error(`Missing request body parameter: ${field}.`);
    }
  }
}

/*
 * responseContent takes in the request context, and the intended body to be returned
 * in an HTTP Response. If the response body is undefined, it returns an HTTP Response
 * with no body, and the status code 200. If the response body is defined, it Json
 * stringifies it, and adds the content-type header to the response.
 */
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
