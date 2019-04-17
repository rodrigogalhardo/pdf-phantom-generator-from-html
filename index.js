const phantom = require('phantom');
const express = require('express');  
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring');

var conversion = require("phantom-html-to-pdf")();
var fs = require('fs');

let app = express();  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

app.get('/pdf/:url', async function(req, res) {

    const url_to_download = `http://` + req.params.url;

    console.warn("URL: " + url_to_download);

    conversion({
        url: url_to_download,
    }, function(err, pdf) {
       var filename = pdf.stream.path;
        var output = fs.createWriteStream(filename);

        console.warn(" ARQUIVO :: ");
        console.log(pdf);
        console.warn(" END ARQUIVO ");

        console.log(pdf.logs);
        console.log(pdf.numberOfPages);

          // since pdf.stream is a node.js stream you can use it
          // to save the pdf to a file (like in this example) or to
          // respond an http request.
        pdf.stream.pipe(output);
        console.warn("PATH: " + filename);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('content-length', `${pdf.stream.length}`);
        
        res.writeHead(200);
        res.status(200).sendFile(filename);
        
        res.end(pdf.stream.length);
      });
});

let server = app.listen(8080, function() {  
    console.log('Server is listening on port 8080')
});

