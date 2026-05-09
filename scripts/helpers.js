'use strict';

// Generate search.json for local search
hexo.extend.generator.register('search-json', function (locals) {
  var config = hexo.config;
  var theme = hexo.theme.config;

  if (!theme.search) return;

  var posts = locals.posts.sort('-date');
  var result = posts.map(function (post) {
    return {
      title: post.title || '',
      date: post.date ? post.date.format('YYYY-MM-DD') : '',
      path: config.root + post.path,
      excerpt: post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 200) : '',
      content: post.content ? post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : ''
    };
  });

  return {
    path: 'search.json',
    data: JSON.stringify(result)
  };
});

// Helper: word count
hexo.extend.helper.register('wordcount', function (content) {
  if (!content) return 0;
  var text = content.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  return text.length;
});

// Helper: reading time
hexo.extend.helper.register('min2read', function (content) {
  var words = content ? content.replace(/<[^>]+>/g, '').replace(/\s+/g, '').length : 0;
  return Math.max(1, Math.round(words / 500));
});

// Helper: social icon SVGs
hexo.extend.helper.register('socialIcon', function (name) {
  var icons = {
    github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    twitter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
    telegram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 4.3L2.4 11.6c-.7.3-.7 1.3 0 1.6l4.6 1.5 1.7 5.5c.1.5.7.7 1.1.4l2.5-2c.3-.3.8-.4 1.2-.2l4.7 3.2c.4.3.9 0 1-.4l3.3-16c.1-.6-.5-1.1-1-.8zM5.8 11.3l13.3-5.5c.4-.2.8.2.6.6l-7.5 13.3c-.2.4-.8.3-.9-.2L9.6 14c-.1-.3 0-.7.2-.9l5.2-5.2c.3-.3 0-.8-.4-.5l-8.2 5.2c-.3.2-.7.2-1 .1l-3.2-1c-.4-.1-.5-.7-.2-1z"/></svg>',
    weibo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.7 14.5c-.6 3.2-4.4 5.3-8.5 4.7-4.1-.6-7-3.4-6.4-6.6.6-3.2 4.4-5.3 8.5-4.7 4.1.6 7 3.4 6.4 6.6z"/><path d="M15.5 12.5c-.5-1-2-.5-3.5.5-.8.4-1.4.9-1.7 1.4"/><path d="M14 10c-.8-.8-3-.3-5.3 1-1.3.7-2.3 1.7-2.7 2.5"/><path d="M12 16.5c-1.5 0-2.5-.5-2.5-.5"/></svg>',
    bilibili: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 4.5h-13A2.5 2.5 0 0 0 3 7v8a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 21 15V7a2.5 2.5 0 0 0-2.5-2.5z"/><path d="M8 4.5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.5"/><path d="M9 10.5v4"/><path d="M12 9.5v5"/><path d="M15 10.5v4"/></svg>'
  };
  return icons[name] || name;
});
