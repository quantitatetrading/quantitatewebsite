let express = require('express');
let app = express();
var path = require ('path');

app.use(express.static(__dirname + '/public'));


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.listen(3000, () => console.log('App listening on port 3000!'));