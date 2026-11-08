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

var NOVEL_STATUS = ['serial', 'finished', 'short'];
var ID = /^[a-zA-Z0-9_-]+$/;

// Writings are organised as book -> part (篇) -> chapter. Books and parts have
// no routes of their own; chapters keep their ordinary post URLs. Book-level
// fields may be written on any chapter of the book, part-level fields on any
// chapter of the part; the earliest chapter that provides a value wins.
function novelOf(post) {
  var novel = post.novel;
  if (!novel || typeof novel !== 'object' || Array.isArray(novel)) return null;
  var book = String(novel.book || '').trim();
  if (!book) return null;
  var order = Number(novel.order);
  return {
    book: book,
    part: String(novel.part || '').trim(),
    order: isFinite(order) ? order : Infinity,
    id: typeof novel.id === 'string' && ID.test(novel.id) ? novel.id : '',
    partId: typeof novel.part_id === 'string' && ID.test(novel.part_id) ? novel.part_id : '',
    cover: safeUrl(novel.cover, true),
    synopsis: String(novel.synopsis || ''),
    partSynopsis: String(novel.part_synopsis || ''),
    status: NOVEL_STATUS.indexOf(novel.status) >= 0 ? novel.status : '',
    pinned: novel.pinned === true,
    listed: novel.listed === true
  };
}

function hashId(prefix, name) {
  var hash = 5381;
  for (var i = 0; i < name.length; i++) hash = ((hash << 5) + hash + name.charCodeAt(i)) >>> 0;
  return prefix + hash.toString(36);
}

function textLength(html) {
  return String(html || '').replace(/<[^>]+>/g, '').replace(/&[a-zA-Z#0-9]+;/g, ' ').replace(/\s+/g, '').length;
}

// Hexo's `updated` defaults to the file's modification time, so the latest
// chapter's publication date is used for a stable "updated" value.
function latestDate(items) {
  return items.reduce(function (latest, item) {
    return !latest || item.post.date.valueOf() > latest.valueOf() ? item.post.date : latest;
  }, null);
}

function pickFrom(items, key) {
  var found = items.find(function (item) { return item.novel[key]; });
  return found ? found.novel[key] : '';
}

function novelBooks(posts) {
  var books = {};
  posts.forEach(function (post) {
    var novel = novelOf(post);
    if (!novel) return;
    (books[novel.book] = books[novel.book] || []).push({ post: post, novel: novel });
  });
  return Object.keys(books).map(function (name) {
    // Chapter order is book-wide; parts appear in the order of their first chapter.
    var items = books[name].sort(function (a, b) {
      return a.novel.order - b.novel.order || a.post.date.valueOf() - b.post.date.valueOf() || a.post.path.localeCompare(b.post.path);
    });
    var bookId = pickFrom(items, 'id') || hashId('book-', name);
    var parts = [];
    items.forEach(function (item) {
      var part = parts.find(function (entry) { return entry.name === item.novel.part; });
      if (!part) parts.push(part = { name: item.novel.part, items: [] });
      part.items.push(item);
    });
    parts = parts.map(function (part, index) {
      return {
        name: part.name,
        id: pickFrom(part.items, 'partId') || hashId(bookId + '-', part.name || String(index)),
        synopsis: pickFrom(part.items, 'partSynopsis'),
        updated: latestDate(part.items),
        words: part.items.reduce(function (sum, item) { return sum + textLength(item.post.content); }, 0),
        chapters: part.items.map(function (item) { return item.post; })
      };
    });
    return {
      name: name,
      id: bookId,
      cover: pickFrom(items, 'cover'),
      synopsis: pickFrom(items, 'synopsis'),
      status: pickFrom(items, 'status') || (items.length === 1 ? 'short' : 'serial'),
      pinned: items.some(function (item) { return item.novel.pinned; }),
      updated: latestDate(items),
      words: parts.reduce(function (sum, part) { return sum + part.words; }, 0),
      parts: parts,
      chapters: items.map(function (item) { return item.post; })
    };
  }).sort(function (a, b) {
    return Number(b.pinned) - Number(a.pinned) || b.updated.valueOf() - a.updated.valueOf() || a.name.localeCompare(b.name);
  });
}

function novelContext(posts, post) {
  var novel = novelOf(post);
  if (!novel) return null;
  var book = novelBooks(posts).find(function (item) { return item.name === novel.book; });
  if (!book) return null;
  var index = book.chapters.findIndex(function (item) { return item.path === post.path; });
  var part = book.parts.find(function (item) { return item.chapters.some(function (chapter) { return chapter.path === post.path; }); });
  return {
    book: book,
    part: part,
    partIndex: part.chapters.findIndex(function (item) { return item.path === post.path; }),
    prev: book.chapters[index - 1] || null,
    next: book.chapters[index + 1] || null
  };
}

function novelsPath(config) {
  var value = config && config.novels_path || 'novels';
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]+\/?$/.test(value)) {
    throw new Error('reviews.novels_path must be a single directory name, e.g. novels');
  }
  return reviewPath(config) + value.replace(/\/$/, '') + '/';
}

function isCollected(post) {
  var item = post.work || post.novel;
  return Boolean(item) && typeof item === 'object';
}

function reviewPath(config) {
  var value = config && config.path || 'reviews';
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(value)) {
    throw new Error('reviews.path must be a relative directory, e.g. reviews');
  }
  return value.replace(/\/$/, '') + '/';
}

function filteredLocals(locals, Query) {
  var visible = function (post) { return !isCollected(post) || (post.work || post.novel).listed === true; };
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

module.exports = { TYPES: TYPES, novelOf: novelOf, novelBooks: novelBooks, novelContext: novelContext, novelsPath: novelsPath, isCollected: isCollected, safeUrl: safeUrl, shortMarkdown: shortMarkdown, workOf: workOf, reviewPath: reviewPath, filteredLocals: filteredLocals };
