const http=require('http');
const express=require('express');

const app = express();

const server = http.createServer(app);

app.use(express.static(__dirname))

server.listen(9000, () => {
    console.log(`Server started on port ${server.address().port}`);
});