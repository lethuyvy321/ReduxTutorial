const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (new Date(req.body.publishDate).getTime() < new Date().getTime()) {
      return res.status(422).send({
        error: {
          publishDate: "Không được publish vào thời điểm trong quá khứ",
        }
      })
    }
    if (req.body.title === 'admin'){
      return res.status(500).send({
        error: 'Server nhận được từ khóa ghi lỗi',
      })
    }
  }
  setTimeout(() => {
    next();
  }, 2000);
});

server.use(router);
server.listen(4000, () => {
  console.log("Json server is running");
});

// server.listen(4000, () => {
//     console.log('Json server is running')
// });
