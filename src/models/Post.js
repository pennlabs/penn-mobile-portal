class Post {
  constructor(id, name, imageUrl, imageUrlCropped, publishDate, status, analytics, org, endDate) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.imageUrlCropped = imageUrlCropped;
    this.publishDate = publishDate;
    this.status = status;
    this.analytics = analytics;
    this.organization = org;
    this.endDate = endDate;
  }
}

export default Post;
