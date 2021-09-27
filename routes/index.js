var express = require('express');
var router = express.Router();
const Video = require('./controllers/videoController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({
      "msg": "Added successfully!",
      "result": 'response'
  });
});

// router.get('/', function(req, res, next) {
//   res.status(200).send({
//       "msg": "Added successfully!",
//       "result": response
//   });
// });

router.get('/api/test', function(req, res, next) {
  res.status(200).send({
      "msg": "Added successfullysssss!",
      "result": 'response'
  });
});

router.post('/api/process-interval', Video.processInterval);
router.post('/api/process-ranges', Video.processRanges);
router.post('/api/process-segments', Video.processSegment);
router.post('/api/combine-video', Video.combineVideo);

module.exports = router;
