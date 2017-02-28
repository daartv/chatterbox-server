var messages = [];

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    response.writeHead(200, headers);
    response.end();
    return;
  }

  if (request.method === 'POST' && request.url === '/classes/messages') {
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

  if (request.method === 'GET' && request.url === '/classes/messages') {
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
