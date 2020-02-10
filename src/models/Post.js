class Post {
  constructor(id, title, subtitle, detail_label, imageUrl, imageUrlCropped, publishDate, endDate, status, analytics, org, approved) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.detailLabel = detail_label;
    this.imageUrl = imageUrl;
    this.imageUrlCropped = imageUrlCropped;
    this.publishDate = publishDate;
    this.endDate = endDate;
    this.status = status;
    this.analytics = analytics;
    this.organization = org;
    this.approved = approved;
  }
}

export default Post;
