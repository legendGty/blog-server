const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  userName: {
    type: String, //数据类型
    required: true, //必填项
  },
  passWord: {
    type: String,
    required: true
  },
  work: String,
  skill: String,
  nickName: {
    type: String,
    default: '用户001',
  },
  desc: String,
  birthday: String,
  sex: String,
  identity: {
    default: 'user',
    type: String
  },
  user_tags: [{type: Schema.Types.ObjectId, ref: "tags"}],
  created: {
    type: String,
    default: new Date(),
  },
  headerImg: String,
},
  {
    timestamps: true, //为每一条记录增加一个创建和修改的时间戳
  }
)

module.exports = mongoose.model('users', modelSchema);
