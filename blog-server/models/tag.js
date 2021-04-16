const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modalSchema = new Schema({
  tag_category: String,
  tag_content: String,
  tag_color: String,
  tag_background: String,
  icon: String,
  post_article_count: {
    default: 0, 
    type: Number
  },
  concern_user_count: {
    default: 0,
    type: Number
  }
},   {
  timestamps: true, //为每一条记录增加一个创建和修改的时间戳
})

module.exports = mongoose.model('tags', modalSchema);