const initWebsocket = require("../../config/websocket.config");
/**
 *
 */

const ShowDialogController = {
  showDialog: async (req, res) => {
    let ip = req.socket.remoteAddress;
    const { data, toguys } = req.body;
    console.log(req.body);
    let info = {
      toguys: toguys,
      data: {
        param: data,
      },
    };
    console.log(info);
    let result = initWebsocket.callPhone(info, ip);
    if (result) {
      res.send({
        code: 200,
        message: "success",
      });
    } else {
      res.send({
        code: 500,
        message: "客户端未连接",
      });
    }
  },
};

module.exports = ShowDialogController;
