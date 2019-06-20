const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My first page</title></head>');
  res.write('<body><h1>My first page</h1></body>');
  res.write('</html>');
  res.end();
  if (req.url === '/exit') {
    process.exit();
  }
});

server.listen(3001, () => console.log('Server runing on 3001 port!'));
