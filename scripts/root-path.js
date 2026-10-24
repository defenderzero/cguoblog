'use strict';

// GitHub Pages 项目页部署在 /cguoblog/ 子路径下。
// 正文里的 Markdown 图片/链接是 /images/... 这类根路径，
// 这里统一加上 config.root 前缀，避免子路径部署时 404。
hexo.extend.filter.register('after_post_render', function (data) {
  var root = hexo.config.root || '/';
  if (root === '/') return data;

  var prefix = root.replace(/\/+$/, '') + '/';
  data.content = data.content.replace(/(src|href)="\/(?!\/)/g, '$1="' + prefix);

  return data;
});
