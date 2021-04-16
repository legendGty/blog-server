
function getAuthorArticleInfo (db, id) {
  const o = {};

  o.map = function () { emit(this.author, {
    article_amount: 1,
    digger_count: this.digger_count,
    collection_count: this.collection_count,
    comment_count: this.comment_count,
    view_count: this.view_count
  }) }
  o.reduce = function (k, vals) {
    const result = {
      article_amount: 0,
      digger_count: 0,
      collection_count: 0,
      view_count: 0,
      comment_count: 0
    }
    vals.forEach(data => {
      result.article_amount += data.article_amount;
      result.digger_count += data.digger_count;
      result.collection_count += data.article_amount;
      result.comment_count += data.comment_count
      result.view_count += data.view_count
    })
    return result
  }
  o.query = { author: id };

  return db.mapReduce(o);
}

module.exports = {
  getAuthorArticleInfo
}