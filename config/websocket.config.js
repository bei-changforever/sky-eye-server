const WebSocket = require("ws");
const jsonwebtoken = require('jsonwebtoken');
WebSocket.binaryType = "arraybuffer";
// 解码key
const secret = 'YYIT-AIOT-3D-123456';
const JWT = {
  // 编码
  generate(value, expires) {
    return jsonwebtoken.sign(value, secret,
      {
        // 可设置过期时间
        expiresIn: expires
      })
  },
  // 解码
  verify(token) {
    try {
      return jsonwebtoken.verify(token, secret)
    }
    catch (err) {
      return false
    }
  }
}
//传入请求HttpRequest
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.headers['x-real-ip'] || // 判断 connection 的远程 IP
    req.socket.remoteAddress
  );
}
//express框架获取ip
function getClientIp(req) {
  return req.ip;
}
function ab2str(buf) {
  /*Int8Array：8位有符号整数，长度1个字节。
    Uint8Array：8位无符号整数，长度1个字节。
    Int16Array：16位有符号整数，长度2个字节。
    Uint16Array：16位无符号整数，长度2个字节。
    Int32Array：32位有符号整数，长度4个字节。
    Uint32Array：32位无符号整数，长度4个字节。
    Float32Array：32位浮点数，长度4个字节。
    Float64Array：64位浮点数，长度8个字节。*/
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const initWebsocket = {
  wss: null,
  WebSocketType: {
    thing: "thing",
    web: "web",
  },
  WebSocketserver: (server) => {
    let that = this;
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", function connection(socket, req) {
      const myURL = new URL(req.url, "http://10.100.50.50:3001");
      // const myURL = new URL(req.url, `http://${location.host}`);
      const playLoad = myURL.searchParams.get("token");

      if (playLoad) {
        console.log("连接用户" + playLoad);

        // 签发token ::ffff:
        socket.ip = req.socket.remoteAddress.split('::ffff:').join('');
        // 解码
        console.log(socket.ip);
        socket.send(JSON.stringify(playLoad, "客户端连接成功"));
        socket.user = playLoad;
      }
      //向客户端发送
      socket.on("message", (data) => {
        try {
          const bufferString = ab2str(data);
          if (bufferString === "ping") {
            // 回复心跳
            try {
              that.wss.clients.forEach((client) => {
                if (
                  client.readyState === WebSocket.OPEN &&
                  client.user == "web"
                ) {
                  client.send("pong", {
                    binary: false,
                  });
                }
              });
            } catch (err) {
              console.log("send failed (" + err.code + ")");
            }
          } else {
            // 普通回复
            const msgObj = JSON.parse(data);
            that.wss.clients.forEach((client) => {
              if (
                client.user === msgObj.toguys &&
                client.readyState === WebSocket.OPEN
              ) {
                client.send(JSON.stringify(msgObj.data), {
                  binary: false,
                });
              }
            });
          }
        } catch (err) {
          that.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify("错误格式，请重新发送"), {
                binary: false,
              });
            }
          });
        }
      });
      //服务器错误
      socket.on("error", console.error);
      //用户离开
      socket.on("close", () => {
        that.wss.clients.delete(socket.user);
        console.log(playLoad + "离开");
      });
    });
  },
  callPhone: (msgObj, ip) => {
    let forward = false;
    this.wss.clients.forEach((client) => {
      console.log(client.user);
      if (
        client.user == msgObj.toguys &&
        client.readyState === WebSocket.OPEN &&
        client.ip === ip
      ) {
        console.log("要发送的用户ip为：", client.ip);
        try {
          client.send(
            JSON.stringify({ eventName: msgObj.eventName, data: msgObj.data }),
            { binary: false }
          );
          forward = true;
        } catch (err) {
          console.log("send failed (" + err.code + ")");
          forward = false;
        }
      }
    });

    return forward;
  },
};



module.exports = initWebsocket;
