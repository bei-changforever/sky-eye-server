var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");
const WebPageRouter = require("./routes/WebServer/WebPageRouter");
const showDialogRouter = require("./routes/ThingServer/ShowDialogRouter");
const commonApiRouter = require("./routes/ThingServer/CommonRouter");
var app = express();
//设置允许跨域访问该服务.
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(WebPageRouter);
app.use(showDialogRouter);
app.use(commonApiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
//去除304 http缓存状态码
app.disable('etag');
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
