// ／／／／包含n个操作数据库集合数据的Model模块
// 引入moogooe
const mongoose = require('mongoose')
// 链接数据库
// mongodb://localhost:27017/gzhipin
//mongodb+srv://our-first-user:jy911005@cluster0.w37ma.mongodb.net/gzhipin?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://our-first-user:daibi123@cluster0.w37ma.mongodb.net/gzhipin?retryWrites=true&w=majority')
// 获取连接对象
const conn = mongoose.connection
// 绑定连接完成的对象
conn.on('connected', () => {
  console.log('db connected successfully')
})

// 定义schema 描述文档结构
const userSchema = mongoose.Schema({ // 指定文档的结构: 属性名/属性值的类型, 是否是必须的, 默认值
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
  header: {type: String},//头像
  post: {type: String},//职位
  info: {type: String},
  company: {type: String},
  salary: {type: String}
})

//定义model 与集合对应
const UserModel = mongoose.model('user', userSchema)

// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
//定义model 与集合对应
const ChatModel = mongoose.model('chat', chatSchema)
// 暴露model
exports.UserModel = UserModel
exports.ChatModel = ChatModel
