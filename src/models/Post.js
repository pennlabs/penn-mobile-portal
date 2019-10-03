class Post {
  constructor(id, name, imageUrl, imageUrlCropped, publishDate, status, analytics) {//
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.imageUrlCropped = imageUrlCropped;//
    this.publishDate = publishDate;
    this.status = status;
    this.analytics = analytics;
  }
}

export default Post;
