import Router from 'express'
import { check, validationResult } from 'express-validator'
import authMiddleware from '../middleware/auth.middleware.js'
import { getNews, getNewsById, createNews, updateNews, deleteNews, getListOfNews } from '../controllers/news.controller.js'
import { upload } from '../utils/uploadFile.js'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const news = await getNews()
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.get('/:id', [check('id', 'id is required').exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.params
    const news = await getNewsById(id)
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.get('/list/:limit/:skip', [check('limit', 'limit is required').exists(), check('skip', 'skip is required').exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { limit, skip } = req.params
    const news = await getListOfNews(limit, skip)
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/', [check('title', 'Title is required').exists(), check('text', 'Text is required').exists(), authMiddleware], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const news = await createNews(req.body, req.user.id)
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.put('/:id', [check('id', 'id is required').exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.params
    const news = await updateNews(id, req.body)
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.delete('/:id', [check('id', 'id is required').exists()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const { id } = req.params
    const news = await deleteNews(id)
    res.json(news)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `http://localhost:4000/images/${req.file.originalname}`
    res.json({ fileUrl })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

export default router
