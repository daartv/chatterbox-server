var url = require('url');
var messages = [];

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  /*console.log('URL PARSE: ', url.parse(request.url));*/
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var urlPathName = url.parse(request.url);

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();  
    return;
  }

//request.url = /classes/messages
  if (request.method === 'POST' && urlPathName.pathname === '/classes/messages') {
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      headers['Content-Type'] = 'application/json';

      var message = JSON.parse(body);
      messages.push(message);
      response.writeHead(201, headers);
      response.end();

    });
    return;
  }

  if (request.method === 'GET' && urlPathName.pathname === '/classes/messages') {
    var payload = {};
    payload.results = messages;
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);
    response.end(JSON.stringify(payload));
    return;

  }
  response.writeHead(404, headers);
  response.end('ENDED!');
};

module.exports = requestHandler;
