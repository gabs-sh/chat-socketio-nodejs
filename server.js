const express = require('express')
const path =  require('path')

const app = express()

const server = require('http').createServer(app)

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

app.set('views',path.join(__dirname,'public'))

app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')

app.use('/', (req,res) => {
    res.render('index.html')
})

let messages = []

io.on('connection', socket => {

    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('mensagensAntigas', messages)

    //on é um listener que aguarda um evento
    //o evento no caso é 'enviarMensagem', posso criar o nome que eu quiser e quantos eventos eu quiser
    socket.on('enviarMensagem', data => {
        messages.push(data)
        socket.broadcast.emit('mensagemRecebida', data)
    })

})

server.listen(3000)

