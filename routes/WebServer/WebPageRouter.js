const express = require("express");
const WebPageRouter  = express.Router();
const WebPageController = require('../../controller/WebController/WebPageController')
WebPageRouter.post('/api/showTopic',WebPageController.showTopic)
module.exports = WebPageRouter