'use strict';

var reviews = require('../lib/reviews');
var galleryText = require('../lib/gallery');

hexo.extend.generator.register('gallery', function (locals) {
  var gallery = hexo.theme.config.gallery;
  if (!gallery || !gallery.enable) return;
  var path = 'gallery/';
  var conflict = function (page) { return page.path === path || page.path === path + 'index.html'; };
  var reviewConfig = hexo.theme.config.reviews;
  if (locals.pages.some(conflict) || locals.posts.some(conflict) || (reviewConfig && reviewConfig.enable && reviews.reviewPath(reviewConfig) === path)) {
    throw new Error('Gallery route conflicts with an existing page: ' + path);
  }
  var images = (Array.isArray(gallery.images) ? gallery.images : []).map(function (image) {
    if (typeof image === 'string') image = { src: image };
    var src = reviews.safeUrl(image && image.src, true);
    if (!src || src.charAt(0) === '#') return null;
    var tags = typeof image.tags === 'string' ? image.tags.split(/[,，\n]/) : image.tags;
    tags = Array.isArray(tags) ? tags.filter(function (tag) { return typeof tag === 'string'; }).map(function (tag) { return tag.trim(); }).filter(Boolean) : [];
    var text = String(image.text || '');
    return { src: src, alt: String(image.alt || ''), caption: String(image.caption || ''), text: text, textHtml: galleryText.renderMarkdown(hexo, text), tags: Array.from(new Set(tags)) };
  }).filter(Boolean);
  var labels = hexo.theme.i18n.get(hexo.config.language);
  return { path: path + 'index.html', layout: 'gallery', data: { title: labels.gallery || 'Gallery', galleryImages: images, galleryTags: Array.from(new Set(images.reduce(function (tags, image) { return tags.concat(image.tags); }, []))) } };
});
