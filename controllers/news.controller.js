import News from '../models/News.js'

export const createNews = (news, userId) => {
  try {
    const newNews = new News({ ...news, author: userId })
    return newNews.save()
  } catch (e) {
    throw e
  }
}

export const getNews = async () => {
  try {
    const news = await News.find().populate('author')
    return news
  } catch (e) {
    throw e
  }
}

export const getListOfNews = async (limit, skip) => {
  try {
    const news = await News.find().select('title _id date newsCoverPhoto').limit(+limit).skip(+skip)
    return news
  } catch (e) {
    throw e
  }
}

export const getNewsById = async id => {
  try {
    const news = await News.findById(id).populate('author')
    return news
  } catch (e) {
    throw e
  }
}

export const updateNews = async (id, news) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(id, news, {
      new: true,
    }).populate('author')
    return updatedNews
  } catch (e) {
    throw e
  }
}

export const deleteNews = async id => {
  try {
    const deletedNews = await News.findByIdAndDelete(id)
    return deletedNews
  } catch (e) {
    throw e
  }
}
