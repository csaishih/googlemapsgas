var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/src'));

var port = process.env.PORT || 8080;


var router = express.Router();

router.get('/', function(req, res) {
    res.sendfile('/src/index.html', { root: __dirname });
});

app.use('/api', router);

app.listen(port);
console.log('Go to ' + port);