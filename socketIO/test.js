module.exports = function(server) {
  const io = require('socket.io')(server);
  // 监视客户端与服务器的连接
  io.on('connection', function(socket) {
    console.log('One client connected to server successfully')
    //绑定监听, 接收客服端发送的消息
    socket.on('sendMsg', function(data) {
      console.log('Server received msg from client', data)
      //处理数据
      data.name = data.name.toUpperCase()
      // 服务器向客户端发送信息
      socket.emit('receiveMsg', data)
      console.log('Server sent msg to client', data)
    })
  })
}
