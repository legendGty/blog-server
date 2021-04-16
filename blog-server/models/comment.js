const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  comment_content: String,
  topic_id: String,
  reply_level: {
    default: 1,
    type: Number
  },
  parent_id: String,
  comment_user_id: String,
  comment_user_info: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users"
  },
  reply_user_id: String,
  reply_user_info: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },
  // like: {
  //   default: 0,
  //   style: Number
  // },
  // login_user_like: {
  //   type: mongoose.SchemaTypes.ObjectId,
  //   ref: "likes",
  // },
  is_author: Boolean,
  created: {
    type: String,
    default: new Date(),
  }},
  {
    timestamps: true, //为每一条记录增加一个创建和修改的时间戳
  }
)

module.exports = mongoose.model('comments', modelSchema);
