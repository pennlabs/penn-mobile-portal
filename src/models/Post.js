class Post {
  constructor(id, name, imageUrl, imageUrlCropped, publishDate, status, org) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.imageUrlCropped = imageUrlCropped;
    this.publishDate = publishDate;
    this.status = status;
    this.organization = org;
  }
}

export default Post;
