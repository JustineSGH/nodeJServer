const app = require('express')();
const fs = require('fs');

/*let runPy = new Promise(function(success, nosuccess) {

    const spawn = require('child_process').spawn;
    const pyprog = spawn('python', ['./../classify.py']);

    pyprog.stdout.on('data', function(data) {
        success(data);
    });
    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    });
});*/

app.get('/', (req, res) => {
    res.send('Bienvenu sur le serveur');

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./classify.py']);

    pyprog.stdout.on('data', function(data) {
	console.log('data stdout' , data.toString('utf8'));
        //success(data);
    });

    pyprog.stderr.on('data', (data) => {
	console.log('data stderr', data.toString('utf8'))
        //nosuccess(data);
    });

    /*runPy.then(function(fromRunpy) {
        console.log(fromRunpy.toString());
        res.end(fromRunpy);
    });*/

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
	fs.writeFile('./test/newImage.jpg', image, function(err) {
  		// If an error occurred, show it and return
  		if(err){
			console.error(err);
		}
		console.log("image saved !");
  		// Successfully wrote binary contents to the file!
	});
        res.send(200, {status: 'OK'});
    } else {
        res.send(500);
    }
});

app.get('/main', function(req, res) {
	var image = fs.readFileSync("./test/newImage.jpg");
	res.writeHead(200, {"Content-Type": "image/jpg"});
      	res.write(image);
      	res.end();
});

app.listen(3000, () => console.log('Server running'));
