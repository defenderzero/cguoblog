hexo.extend.helper.register('related_posts', function (current, limit) {
  limit = limit || 3;
  if (!current) return [];

  var posts = (this.site && this.site.posts) ? this.site.posts : hexo.locals.get('posts');
  var currentCategories = [];
  var currentTags = [];
  var scored = [];

  if (current.categories) {
    current.categories.each(function (category) {
      currentCategories.push(category.name);
    });
  }

  if (current.tags) {
    current.tags.each(function (tag) {
      currentTags.push(tag.name);
    });
  }

  posts.each(function (post) {
    if (post._id === current._id) return;

    var score = 0;

    if (post.categories) {
      post.categories.each(function (category) {
        if (currentCategories.indexOf(category.name) !== -1) score += 3;
      });
    }

    if (post.tags) {
      post.tags.each(function (tag) {
        if (currentTags.indexOf(tag.name) !== -1) score += 1;
      });
    }

    scored.push({ post: post, score: score });
  });

  scored.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.date - a.post.date;
  });

  return scored.slice(0, limit).map(function (item) {
    return item.post;
  });
});
