import { Schema, model } from 'mongoose'

const News = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  newsCoverPhoto: { type: String, required: true },
  newsCoverPhotoName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export default model('News', News)
