const app = require('express')();
const fs = require('fs');

app.get('/', (req, res) => {
  res.send({message: 'Bienvenu sur le serveur'});
});

function rawBody(req, res, next) {
    var chunks = [];
    req.on('data', function(chunk) {
        chunks.push(chunk);
    });
    req.on('end', function() {
        var buffer = Buffer.concat(chunks);

        req.bodyLength = buffer.length;
        req.rawBody = buffer;
        next();
    });
    req.on('error', function (err) {
        console.log(err);
        res.status(500);
    });
}

app.post('/upload-image', rawBody, function (req, res) {
    if (req.rawBody && req.bodyLength > 0) {
	var image = req.rawBody;
	fs.writeFile('./image/newImage.jpg', image, function(err) {
  		// If an error occurred, show it and return
  		if(err){
			console.error(err);
		}
		console.log("image saved !");
  		// Successfully wrote binary contents to the file!
	});
        //base64_decode(image,'/image/newImage.jpg');
	//console.log("image" , image);
        // TODO save image (req.rawBody) somewhere

        res.send(200, {status: 'OK'});
    } else {
        res.send(500);
    }
});

app.get('/main', function(req, res) {
	var image = fs.readFileSync("./image/newImage.jpg");
	res.writeHead(200, {"Content-Type": "image/jpg"});
      	res.write(image);
      	res.end();

    /*fs.readFileSync('./home.html', function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });*/

});

app.listen(3000, () => console.log('Server running'));
