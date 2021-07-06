var express = require('express');
var router = express.Router();
const { UserModel, ChatModel } = require('../db/models');
const md5 = require('blueimp-md5')
const filter = {password: 0, __v: 0} //查询时过滤出指定属性
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//// 定义一个 用户注册 路由
router.post('/register', function (req, res) {
  // 1 读取请求参数数据
  const {username, password, type} = req.body
  // console.log(req.body)
  // 2 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
    // 查询(根据username)
  UserModel.findOne({username}, function (err, user) {
    // 如果user有值(已存在)
    if(user) {
      // 3 返回提示错误的信息
      res.send({code: 1, msg: 'User exists'})
    } else { // 没值(不存在)
      // 保存
      new UserModel({username, type, password:md5(password)}).save(function (error, user) {

        // 生成一个cookie(userid: user._id), 并交给浏览器保存， maxAge: 1000*60*60*24一天免登录
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
        // 返回包含user的json数据
        const data = {username, type, _id: user._id} // 响应数据中不要携带password
        res.send({code: 0, data})
      })
    }
  })
})

//// 定义一个 用户登录 路由
router.post('/login', function(req, res){
  //1 读取请求参数数据
  const {username, password} = req.body
  //2 处理: 判断用户是否已经存在, username and password
  UserModel.findOne({username:username, password:md5(password)}, filter, function(error, user){
    if (user) {
      // 登录成功
      // 生成一个cookie(userid: user._id), 并交给浏览器保存，maxAge: 1000*60*60*24一天免登录
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
      res.send({code: 0, data: user})
    } else {
      // 登录失败
      res.send({code: 1, msg: 'Username or Password not Correct'})
    }
  })
})

////定义更新用户信息的路由
router.post('/update', function(req, res) {
  //1 读取请求参数数据
  //从请求的cookie得到userid
  const userid = req.cookies.userid
  // console.log(userid)
  if(!userid) {
    //cookie不存在
    return res.send({code: 1, msg: 'Please Login'})
  }
  //cookie存在, 根据userid更新user文档数据
  const user = req.body
  // console.log(user)
  UserModel.findByIdAndUpdate({_id: userid}, user, function(error, oldUser) {
    // cookie被篡改
    if(!oldUser) {
      //通知浏览器删除userid cookie
      res.clearCookie('userid')
      res.send({code: 1, msg: 'Please Login'})
    } else {
      const {_id, username, type} = oldUser
      //先后顺序， 后面会覆盖前面相同数据， 这里没有相同的
      const data = {_id, username, type, ...user}
      res.send({code: 0, data: data})
    }
  })
})

//定义一个获取用户信息路由，根据cookie中userid
router.get('/user', function (req, res) {
  const userid = req.cookies.userid
  // console.log(req.cookies.userid)
  if(!userid) {
    res.send({code: 1, msg: 'Please Login'})
  }
  UserModel.findOne({_id: userid},filter, function(error, user) {
    res.send({code: 0, data: user})
  })
})

//定义一个获取用户列表的路由 (根据用户类型)
router.get('/userlist/:type', function (req, res) {
// console.log(req.params)
// router.get('/userlist', function (req, res) {
  // console.log(req.params)
  const {type} = req.params
  UserModel.find({type: type}, filter, function(error, users){
    res.send({code: 0, data: users})
  })
})

//定义获取聊天列表的路由
router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid
  // 查询得到所有user
  UserModel.find(function (error, userDocs) {
    const users = {}
    userDocs.forEach(user => {
      users[user._id] = {username: user.username, header: user.header}
    })
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function(error, chatMsgs){
      // 返回所有用户和与当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

//修稿指定消息为已读
router.post('/readmsg', function (req, res) {
  const from = req.body.from
  const to = req.cookies.userid
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(error, doc){
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified})
  })
})
// router.post('/readmsg', function (req, res) {
//   // 得到请求中的from和to
//   const from = req.body.from
//   const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
//   ChatModel.update({from:from, to:to, read: false}, {read: true}, {multi: true}, function (err, doc) {
//     console.log('/readmsg', doc)
//     res.send({code: 0, data: doc.nModified}) // 更新的数量
//   })
// })
module.exports = router;
