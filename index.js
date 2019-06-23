const http = require('http');

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write(
      `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
        </head>
        <body>
          <h1>Привет, ты на главной странице</h1>
          <a href="/users">Нажми, чтобы посмотреть список юзеров</a>
          <form action="/create-user" method="POST">
              <input type="text" name="user" placeholder="Enter the user name">
              <button type="submit">Create user</button>
          </form>
        </body>
      </html>`
    );
    return res.end();
  }

  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
    <ul>
      <li>User 1</li>
      <li>User 2</li>
      <li>User 3</li>
      <li>User 4</li>
      <li>User 5</li>
      <li>User 6</li>
      <li>User 7</li>
      <li>User 8</li>
      <li>User 9</li>
      <li>User 10</li>
    </ul>
   `);
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    let body = [];

    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });

    req.on('end', () => {
      const bodyParser = Buffer.concat(body).toString();
      const message = bodyParser.split('=')[1];

      console.log(message);

      res.writeHead(302, {
        Location: '/'
      });

      return res.end();
    });
  }
});

server.listen(3001, () => console.log('Server is running on port 3001!'));
