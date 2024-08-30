const express = require("express");
const commonApiRouter = express.Router();
const commonController = require("../../controller/ThingController/CommonContoller");
commonApiRouter.post("/common", commonController.commonApi);
commonApiRouter.post("/findItAsset", commonController.findItAsset);
commonApiRouter.post("/sendBack", commonController.sendBack);
commonApiRouter.post('/moni',commonController.moni);
commonApiRouter.post('/backMoni',commonController.backMoni);
commonApiRouter.post('/moniStopCar',commonController.moniStopCar);
module.exports = commonApiRouter;