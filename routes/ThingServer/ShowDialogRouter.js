const express = require("express");
const showDialogRouter = express.Router();
const ShowDialogController = require("../../controller/ThingController/ShowDialogController");
showDialogRouter.post("/showdialog", ShowDialogController.showDialog);
module.exports = showDialogRouter;
