const http = require('http');
const fs = require('fs');
const path = require('path');

//Create a server instance
const server = http.createServer((req, res) => {
    //Determine the file path based on the request Url
    let filePath = '.' + req.url;

    // If the request is for the root URL, serve index.html
    if (req.url === '/') {
        filePath = './index.html';
    }

    // Handle specific paths: '/post' and '/contact'
    if (req.url === '/post') {
        filePath = './post.html';
    } else if (req.url === '/contact') {
        filePath = './contact.html';
    }

    // Read the file from the file system
    fs.readFile(filePath, function(error, content) {
        if (error) {
            // Read the file from the file system
            if(error.code === 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            }
            // Handle server errors (500)
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }
        else {
            // Determine content type based on file extension
            let contentType = 'text/html';
            const extname = path.extname(filePath);

            switch (extname) {
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
            }

            // Serve the file with appropriate content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Define the port on which the server will listen
const PORT = process.env.PORT || 8000;

// Start the server and listen for incoming requests
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
