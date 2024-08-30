const initWebsocket = require("../../config/websocket.config");
const WebPageController = {
  showTopic: async (req, res) => {
    const { toguys, data } = req.body;

    let result = initWebsocket.callPhone({
      toguys,
      data,
    });

    if (result) {
      res.send({
        code: 200,
        message: "发送成功",
      });
    } else {
      res.send({
        code: 500,
        message: "客户端未连接",
      });
    }
  },
};

module.exports = WebPageController;
