/**
 * @params {
 *    db: collections
 *    page: page number
 *    size: limit count,
 *    filter
 * }
 */

async function getPage(db, page, size, filter, id) {
  let ipage = page || 1;
  let isize = size || 10;
  let ifilter = filter || {};
  const dbData = await Promise.all([
    db.countDocuments(),
    db.find(ifilter).sort({'_id': -1}).skip(Number(isize) * (ipage -1)).limit(isize).populate({
      path: 'author',
      select: '-passWord'
    }).populate({
      path: 'digger_list',
      match: {
        from: 'article',
        userInfo: id
      }
    })
  ])

  return {
    total: dbData[0],
    data: dbData[1],
    page: Number(page)
  }
}

module.exports = getPage