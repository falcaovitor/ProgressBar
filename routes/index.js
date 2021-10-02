var express = require('express');
var formidable = require('formidable');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Barra de progresso com ajax' });
});

router.post('/uploads', (req, res, next) => {
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  });
  form.parse(req, (err, fields, files) => {
    res.json({
      files
    });
  });
});

module.exports = router;
