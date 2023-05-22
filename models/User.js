import { Schema, model } from 'mongoose'

const User = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  hashedRt: { type: String, select: false },
  news: [{ type: Schema.Types.ObjectId, ref: 'File' }],
})

export default model('User', User)
