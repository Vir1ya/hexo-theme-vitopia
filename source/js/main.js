// ===============
// Vitopia Theme — main.js
// ===============
(function () {
  'use strict';

  // ===============
  // Dark Mode
  // ===============
  const THEME_KEY = 'vitopia-theme';
  const PIXEL_KEY = 'vitopia-pixel';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var target = current === 'dark' ? 'light' : 'dark';

    // If banner exists, animate color wash inside it
    var banner = document.querySelector('.home-banner-bg');
    if (banner) {
      // Read target gradient by temporarily switching
      applyTheme(target);
      var targetGradient = getComputedStyle(banner).background;
      applyTheme(current);

      // Create wash layer that slides down inside the banner
      var wash = document.createElement('div');
      wash.className = 'banner-wash-layer';
      wash.style.background = targetGradient;
      banner.appendChild(wash);

      wash.addEventListener('animationend', function () {
        applyTheme(target);
        wash.remove();
      });
    } else {
      applyTheme(target);
    }
  }

  applyTheme(getPreferredTheme());

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Watch for system preference changes (instant, no animation needed for auto-switch)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ===============
  // Search
  // ===============
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchBtn = document.getElementById('search-btn');
  var searchClose = document.getElementById('search-close');
  var searchData = null;
  var selectedIndex = -1;

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    searchInput.value = '';
    searchInput.focus();
    selectedIndex = -1;
    searchResults.innerHTML = '<div class="search-hint">' + (searchInput.placeholder || 'Type to search...') + '</div>';

    if (!searchData) {
      fetch('/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          searchData = data;
        })
        .catch(function () {
          searchData = [];
        });
    }
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    selectedIndex = -1;
  }

  function doSearch(query) {
    if (!searchData || !searchData.length) {
      searchResults.innerHTML = '<div class="search-hint">No data loaded</div>';
      return;
    }

    var q = query.toLowerCase().trim();
    if (!q) {
      searchResults.innerHTML = '<div class="search-hint">' + (searchInput.placeholder || 'Type to search...') + '</div>';
      selectedIndex = -1;
      return;
    }

    var results = [];
    for (var i = 0; i < searchData.length; i++) {
      var item = searchData[i];
      if (item.title.toLowerCase().indexOf(q) !== -1 ||
          (item.excerpt && item.excerpt.toLowerCase().indexOf(q) !== -1) ||
          (item.content && item.content.toLowerCase().indexOf(q) !== -1)) {
        results.push(item);
        if (results.length >= 10) break;
      }
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-hint">No results found</div>';
      selectedIndex = -1;
      return;
    }

    selectedIndex = -1;
    var html = '';
    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      html += '<a class="search-result-item" href="' + r.path + '">' +
        '<div class="search-result-title">' + escapeHTML(r.title) + '</div>' +
        '<div class="search-result-date">' + (r.date || '') + '</div>' +
        '</a>';
    }
    searchResults.innerHTML = html;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        doSearch(searchInput.value);
      }, 150);
    });
  }

  // Search keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!searchOverlay || !searchOverlay.classList.contains('active')) return;

    var items = searchResults.querySelectorAll('.search-result-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length === 0) return;
      if (selectedIndex >= 0) items[selectedIndex].classList.remove('selected');
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length === 0) return;
      if (selectedIndex >= 0) items[selectedIndex].classList.remove('selected');
      selectedIndex = Math.max(selectedIndex - 1, 0);
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].focus();
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      var sel = items[selectedIndex];
      if (sel) sel.click();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // ===============
  // Konami Code
  // ===============
  var konamiSeq = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  var konamiIdx = 0;

  document.addEventListener('keydown', function (e) {
    if (e.key === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        togglePixelMode();
      }
    } else {
      konamiIdx = 0;
    }
  });

  function togglePixelMode() {
    var current = document.documentElement.getAttribute('data-pixel');
    var enable = current !== 'true';
    document.documentElement.setAttribute('data-pixel', enable ? 'true' : null);
    localStorage.setItem(PIXEL_KEY, enable ? '1' : '0');

    // Swap author name when pixel mode toggles
    var authorLink = document.querySelector('.home-author-link');
    var pixelName = authorLink ? authorLink.dataset.pixelName : '';
    if (authorLink && pixelName) {
      if (!authorLink.dataset.originalText) {
        authorLink.dataset.originalText = authorLink.textContent;
      }
      authorLink.textContent = enable ? pixelName : authorLink.dataset.originalText;
    }

    if (enable) {
      var toast = document.createElement('div');
      toast.textContent = 'PIXEL MODE ACTIVATED';
      toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);' +
        'padding:0.75rem 1.5rem;background:#0f380f;color:#9bbc0f;' +
        'font-family:"Press Start 2P",monospace;font-size:12px;border:4px solid #9bbc0f;' +
        'z-index:9999;animation:fadeIn 0.3s ease;box-shadow:4px 4px 0 #306230;';
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 1s';
        setTimeout(function () { document.body.removeChild(toast); }, 1000);
      }, 2000);
    }
  }

  // Restore pixel mode + author name on load
  if (localStorage.getItem(PIXEL_KEY) === '1') {
    document.documentElement.setAttribute('data-pixel', 'true');
    var authorLink = document.querySelector('.home-author-link');
    var pixelName = authorLink ? authorLink.dataset.pixelName : '';
    if (authorLink && pixelName) {
      if (!authorLink.dataset.originalText) {
        authorLink.dataset.originalText = authorLink.textContent;
      }
      authorLink.textContent = pixelName;
    }
  }

  // ===============
  // Code Copy Buttons
  // ===============
  function addCopyButtons() {
    var blocks = document.querySelectorAll('figure.highlight');
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.querySelector('.copy-btn')) continue;

      // Detect language from class (e.g. "highlight bash" → "bash")
      var lang = '';
      var cls = block.className || '';
      var match = cls.match(/highlight\s+(\w+)/);
      if (match && match[1]) lang = match[1];

      var header = document.createElement('div');
      header.className = 'code-header';

      if (lang) {
        var langSpan = document.createElement('span');
        langSpan.className = 'code-lang';
        langSpan.textContent = lang;
        header.appendChild(langSpan);
      }

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      header.appendChild(btn);
      block.insertBefore(header, block.firstChild);

      btn.addEventListener('click', function () {
        var code = block.querySelector('.code pre') || block.querySelector('pre');
        var text = code ? code.textContent : '';
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          btn.textContent = 'Failed';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        });
      });
    }
  }

  addCopyButtons();

  // ===============
  // Convert <p><img><br><img>...</p> into .image-row flex containers
  // ===============
  function wrapImageGroups() {
    var bodies = document.querySelectorAll('.post-body');
    for (var b = 0; b < bodies.length; b++) {
      var paras = bodies[b].querySelectorAll('p');
      for (var i = 0; i < paras.length; i++) {
        var p = paras[i];
        // Check if paragraph contains only <img> and <br> (no text)
        var hasOnlyImages = true;
        var imgs = [];
        for (var c = 0; c < p.childNodes.length; c++) {
          var node = p.childNodes[c];
          if (node.nodeType === 1) { // Element
            if (node.tagName === 'IMG') {
              imgs.push(node);
            } else if (node.tagName !== 'BR') {
              hasOnlyImages = false;
              break;
            }
          } else if (node.nodeType === 3) { // Text node
            if (node.textContent.trim() !== '') {
              hasOnlyImages = false;
              break;
            }
          }
        }
        // Only convert if 2+ images (single images stay as-is, centered by CSS)
        if (hasOnlyImages && imgs.length >= 2) {
          var row = document.createElement('div');
          row.className = 'image-row';
          p.parentNode.insertBefore(row, p);
          for (var j = 0; j < imgs.length; j++) {
            var wrap = document.createElement('p');
            wrap.appendChild(imgs[j]);
            row.appendChild(wrap);
          }
          p.remove();
        }
      }
    }
  }
  wrapImageGroups();

  // ===============
  // Back to Top Button
  // ===============
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    var scrollThreshold = 400;
    var ticking = false;

    function updateBackToTop() {
      var visible = window.scrollY > scrollThreshold;
      if (visible) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateBackToTop);
        ticking = true;
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
