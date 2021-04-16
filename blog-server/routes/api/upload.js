const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = null;
    if(req.url.includes('upload_tag')) {
      type = 'tag-icon';
    } else {
      type = file.mimetype.includes('image') ? 'images' : 'music';
    }
    cb(null, `./public/upload/${type}`)
  },
  filename: function (req, file, cb) {
    // req.filename = '/upload/' + Date.now() + '-' + file.originalname;
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1000 * 1000 // file size limit < 5M
  } 
})

//upload.single中的参数file表示form表单中的字段名
router.post('/upload', upload.single('file'), (req, res) => {
  const path = req.file.path.replace('public', '')
  res.json({
    upload: "success",
    message: 'File Upload Success!',
    url: `${path}`,
  });
});

router.post('/upload_editor', upload.single('editormd-image-file'), (req, res) => {
  const path = req.file.path.replace('public', '')
  res.json({
    success: 1,
    message: 'File Upload Success!',
    url: `http://${req.headers.host}${path}`,
  });
});

router.post('/upload_tag', upload.single('file'), (req, res) => {
  const path = req.file.path.replace('public', '')
  res.json({
    success: 1,
    message: 'File Upload Success!',
    url: `http://${req.headers.host}${path}`,
  });
});
module.exports = router;
