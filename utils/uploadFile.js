import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images') // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(null, file.originalname + '-' + suffix)
  },
})

export const upload = multer({ storage })
