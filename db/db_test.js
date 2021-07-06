const md5 = require('blueimp-md5') // md5加密的函数
/*1. 连接数据库*/
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () { // 连接成功回调
  console.log('数据库连接成功, YE!!!')
})
// 描述文档结构
const userSchema = mongoose.Schema({ // 指定文档的结构: 属性名/属性值的类型, 是否是必须的, 默认值
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
  header: {type: String}
})
// 定义Model 与集合对应， 可以操作集合
const UserModel = mongoose.model('user', userSchema) //集合名字叫users
//通过Model实例save（）添加数据
function testSave() {
  // 创建UserModel的实例
  const userModel = new UserModel({username: 'Bob', password: md5('234'), type: 'laoban'})
  // 调用save()保存
  userModel.save(function (error, user) {
    console.log('save()', error, user)
  })
}
// testSave()
// 查询数据
function testFind() {
  // 查询多个
  UserModel.find(function (error, users){
    console.log('find()',error, users)
  })
  // 查询1个
  UserModel.findOne({_id: '5ff4f4b08f5bc02db5679e05'}, function(error, user) {
    console.log('findOne()',error, user)
  })
}

//testFind()
// 更新数据
function testUpdate() {
  UserModel.findByIdAndUpdate({_id:'5ff4f4b08f5bc02db5679e05'},{username: 'Jack'}, function(error, oldUser){
    console.log('findByIdAndUpdate()', error, oldUser)
  })
}
// testUpdate()

// 删除
function testRemove() {
  UserModel.remove({_id: '5ff4f634cd1d812eb606b4e6'},function(error, doc) {
    console.log('remove()', error, doc) //{n: 1/0, ok: 1}
  })
}
testRemove()
