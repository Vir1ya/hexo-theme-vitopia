'use strict';

function renderMarkdown(hexo, text) {
  if (!text.trim()) return '';
  var renderer = hexo.extend.renderer.get('md', true);
  if (!renderer || !hexo.config.marked) {
    throw new Error('Gallery author text requires hexo-renderer-marked.');
  }
  // Use the site's Markdown renderer with sanitization scoped to gallery text.
  // Leave article rendering and the site's Markdown configuration unchanged.
  var context = Object.create(hexo);
  var options = Object.assign({}, hexo.config.marked, {
    headerIds: false,
    sanitizeUrl: true,
    dompurify: {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['style'],
      ALLOW_DATA_ATTR: false
    }
  });
  context.config = Object.assign({}, hexo.config, { marked: options });
  return renderer.call(context, { text: text }, options);
}

module.exports = { renderMarkdown: renderMarkdown };
