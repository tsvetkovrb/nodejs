const http = require('http');

const routes = require('./routes');

const server = http.createServer(routes);

server.listen(3001, () => console.log('Server runing on 3001 port!'));
