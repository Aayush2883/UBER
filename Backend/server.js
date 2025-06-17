const http = require('http');;
const app = require('./app'); // Import the Express app
const port = process.env.PORT || 4000; // Set the port

// Create the HTTP server
const server = http.createServer(app);

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})