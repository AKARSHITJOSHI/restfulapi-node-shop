const http = require('http');
const app = require('./app');
const port = 8000 || process.env.PORT;

const server = http.createServer(app);

server.listen(port, () => {
    console.log("Listening on port:" + port);
});