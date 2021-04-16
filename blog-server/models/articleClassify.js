const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  category: {
    type: String
  }
}, {
  timestamps: true, //为每一条记录增加一个创建和修改的时间戳
})

module.exports = mongoose.model('articleClassify', modelSchema);
