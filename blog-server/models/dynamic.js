const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  content: String,
  digger_count: {
    default: 0,
    type: Number
  },
  digger_list: [{type: Schema.Types.ObjectId, ref: "likes"}],
  comment_count: {
    default: 0,
    type: Number
  },
  author_user_info: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  created: {
    type: String,
    default: new Date(),
  },
  dynamicImg: [String],
  link_parse_content: {
    
  },
  },
  {
    timestamps: true, //为每一条记录增加一个创建和修改的时间戳
  }
)

module.exports = mongoose.model('dynamics', modelSchema);
