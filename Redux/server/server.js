const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.get('/echo',(req, res) => {
    res.jsonp(req.query)
})


server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if(['POST', 'PUT', 'PATCH'].includes(req.method)){
        if(new Date(req.body.publishDate).getTime() < new Date().getTime()){
            return res.status(422).send({
                error: {
                    publishDate : 'Không được publish vào thời điểm trong quá khứ'
                }
            })
        }
    }
    next()
})


server.use(router)
setTimeout(() => {
    server.listen(4000, () => {
        console.log('Json server is running')
    });
}, 10000);

// server.listen(4000, () => {
//     console.log('Json server is running')
// });
