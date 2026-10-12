'use strict';

var reviews = require('../lib/reviews');

// This repository historically uses `ch` in site config. Support that alias
// without changing a site's configuration or duplicating translation files.
hexo.extend.filter.register('before_generate', function () {
  if (hexo.theme.config.reviews && hexo.theme.config.reviews.enable && [].concat(hexo.config.language).indexOf('ch') >= 0 && hexo.theme.i18n.list().indexOf('ch') < 0) {
    hexo.theme.i18n.set('ch', hexo.theme.i18n.get('zh-CN'));
  }
});

hexo.extend.helper.register('review_path', function () {
  return reviews.reviewPath(hexo.theme.config.reviews);
});
hexo.extend.helper.register('work_data', reviews.workOf);
hexo.extend.helper.register('visible_taxonomy', function (name) {
  var locals = hexo.locals.toObject();
  if (!hexo.theme.config.reviews || !hexo.theme.config.reviews.enable) return locals[name].toArray();
  return reviews.filteredLocals(locals, hexo.model('Post').Query)[name];
});
hexo.extend.helper.register('taxonomy_is_linked', function (item) {
  if (!hexo.theme.config.reviews || !hexo.theme.config.reviews.enable) return true;
  return item.posts.some(function (post) { return !post.work || post.work.listed === true; });
});

hexo.extend.generator.register('reviews', function (locals) {
  if (!hexo.theme.config.reviews || !hexo.theme.config.reviews.enable) return;
  var path = reviews.reviewPath(hexo.theme.config.reviews);
  var conflicts = function (page) { return page.path === path + 'index.html' || page.path === path; };
  if (locals.pages.some(conflicts) || locals.posts.some(conflicts)) {
    throw new Error('琉璃集路径与现有页面冲突：' + path);
  }
  var posts = locals.posts.toArray().filter(function (post) { return reviews.workOf(post); });
  posts.sort(function (a, b) {
    return Number(b.work.pinned === true) - Number(a.work.pinned === true) || b.date.valueOf() - a.date.valueOf() || a.path.localeCompare(b.path);
  });
  return { path: path + 'index.html', layout: 'reviews', data: { title: hexo.theme.i18n.get(hexo.config.language).reviews || 'Liuli Collection', reviewPosts: posts } };
});

// Give each list generator its own filtered queries; retain global posts for
// article routes and search. Filtering templates alone would break pagination.
hexo.extend.filter.register('after_init', function () {
  ['index', 'archive', 'tag', 'category'].forEach(function (name) {
    var original = hexo.extend.generator.get(name);
    if (!original) return;
    hexo.extend.generator.register(name, function (locals) {
      if (!hexo.theme.config.reviews || !hexo.theme.config.reviews.enable) return original.call(this, locals);
      return original.call(this, reviews.filteredLocals(locals, hexo.model('Post').Query));
    });
  });
});
