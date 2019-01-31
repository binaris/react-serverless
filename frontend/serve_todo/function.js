const fs = require('mz/fs');
const mime = require('mime-types');
const path = require('path');

exports.handler = async (body, ctx) => {
  let resourcePath = ctx.request.path;

  if (resourcePath === '/' || resourcePath === undefined) {
    resourcePath = '/index.html';
  }

  const webResource = await fs.readFile(`.${resourcePath}`);
  const resourceType = mime.contentType(path.extname(resourcePath));

  return new ctx.HTTPResponse({
    statusCode: 200,
    headers: {
      'Content-Type': resourceType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    body: webResource,
  });
}
