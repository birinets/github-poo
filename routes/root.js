var express = require('express');
var router = express.Router();

router.get("/signup", function(req, res) {
  console.log(req);
  res.send("Hello world");
});

module.exports = router;
