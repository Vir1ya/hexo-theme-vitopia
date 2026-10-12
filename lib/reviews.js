'use strict';

var TYPES = ['anime', 'manga', 'game', 'literature', 'other'];
var escape = function (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

function safeUrl(value, local) {
  if (typeof value !== 'string' || /[\x00-\x20\\]/.test(value)) return '';
  if (local && (/^\/(?!\/)/.test(value) || /^#/.test(value))) return value;
  try {
    var url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password ? value : '';
  } catch (_) { return ''; }
}

// Only emphasis and links are interpreted. Raw HTML is always escaped.
function shortMarkdown(value, depth) {
  var text = String(value == null ? '' : value);
  if ((depth || 0) > 3) return escape(text);
  var pattern = /\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  var output = '', offset = 0, match;
  while ((match = pattern.exec(text))) {
    output += escape(text.slice(offset, match.index));
    if (match[1]) output += '<strong>' + escape(match[1]) + '</strong>';
    else if (match[2]) output += '<em>' + escape(match[2]) + '</em>';
    else {
      var url = safeUrl(match[4], true);
      output += url ? '<a href="' + escape(url) + '" rel="noopener noreferrer">' + shortMarkdown(match[3], (depth || 0) + 1) + '</a>' : escape(match[0]);
    }
    offset = pattern.lastIndex;
  }
  return (output + escape(text.slice(offset))).replace(/\r?\n/g, '<br>');
}

function workOf(post) {
  var work = post.work;
  if (!work || typeof work !== 'object' || Array.isArray(work)) return null;
  return {
    title: String(work.title || post.title || ''),
    type: TYPES.indexOf(work.type) >= 0 ? work.type : 'other',
    year: String(work.year || ''),
    cover: safeUrl(work.cover, true),
    meta: String(work.meta || ''),
    synopsis: String(work.synopsis || ''),
    review: shortMarkdown(work.review),
    sources: (Array.isArray(work.sources) ? work.sources : []).map(function (source) {
      if (typeof source === 'string') source = { url: source };
      var url = safeUrl(source && source.url);
      if (!url) return null;
      var host = new URL(url).hostname;
      var label = /(^|\.)(bgm\.tv|bangumi\.tv|chii\.in)$/.test(host) ? 'Bangumi' : /(^|\.)douban\.com$/.test(host) ? '豆瓣' : /(^|\.)wikipedia\.org$/.test(host) ? 'Wikipedia' : host;
      return { url: url, label: String(source.label || label) };
    }).filter(Boolean),
    pinned: work.pinned === true,
    listed: work.listed === true
  };
}

function reviewPath(config) {
  var value = config && config.path || 'reviews';
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(value)) {
    throw new Error('reviews.path must be a relative directory, e.g. reviews');
  }
  return value.replace(/\/$/, '') + '/';
}

function filteredLocals(locals, Query) {
  var visible = function (post) { return !post.work || post.work.listed === true; };
  var filter = function (posts) { return new Query(posts.data.filter(visible)); };
  var relations = function (items) {
    return items.map(function (item) {
      var posts = filter(item.posts);
      return new Proxy(item, {
        get: function (target, property) {
          if (property === 'posts') return posts;
          if (property === 'length') return posts.length;
          return Reflect.get(target, property, target);
        }
      });
    }).filter(function (item) { return item.length > 0; });
  };
  return Object.assign({}, locals, { posts: filter(locals.posts), tags: relations(locals.tags), categories: relations(locals.categories) });
}

module.exports = { TYPES: TYPES, safeUrl: safeUrl, shortMarkdown: shortMarkdown, workOf: workOf, reviewPath: reviewPath, filteredLocals: filteredLocals };
