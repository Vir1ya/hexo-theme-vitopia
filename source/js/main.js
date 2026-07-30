// ===============
// Vitopia Theme — main.js
// ===============
(function () {
  'use strict';

  // ===============
  // Dark Mode
  // ===============
  const THEME_KEY = 'vitopia-theme';

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
    applyTheme(target);
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
      searchResults.innerHTML = '<div class="search-hint">Loading...</div>';
      fetch('/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          searchData = data;
          searchResults.innerHTML = '<div class="search-hint">' + (searchInput.placeholder || 'Type to search...') + '</div>';
        })
        .catch(function () {
          searchData = [];
          searchResults.innerHTML = '<div class="search-hint">No data loaded</div>';
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

      var label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang || 'code';
      header.appendChild(label);

      var dots = document.createElement('span');
      dots.className = 'code-dots';
      dots.setAttribute('aria-hidden', 'true');
      for (var d = 0; d < 3; d++) {
        dots.appendChild(document.createElement('i'));
      }
      header.appendChild(dots);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code');
      header.appendChild(btn);
      block.insertBefore(header, block.firstChild);

      btn.addEventListener('click', function () {
        var self = this;
        var parentBlock = self.closest('figure.highlight');
        var code = parentBlock.querySelector('.code pre') || parentBlock.querySelector('pre');
        var text = code ? code.textContent : '';
        navigator.clipboard.writeText(text).then(function () {
          self.textContent = 'Copied';
          self.classList.add('copied');
          setTimeout(function () {
            self.textContent = 'Copy';
            self.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          self.textContent = 'Retry';
          setTimeout(function () { self.textContent = 'Copy'; }, 2000);
        });
      });
    }
  }

  addCopyButtons();

  // ===============
  // Code Edge Fades
  // ===============
  function initCodeEdgeFades() {
    var blocks = document.querySelectorAll('figure.highlight');

    function updateEdgeFade(block) {
      var maxScroll = block.scrollWidth - block.clientWidth;
      var offset = block.scrollLeft;
      var isScrollable = maxScroll > 2;

      block.style.setProperty('--code-scroll-offset', offset + 'px');
      block.setAttribute('data-code-left', isScrollable && offset > 2 ? 'true' : 'false');
      block.setAttribute('data-code-right', isScrollable && offset < maxScroll - 2 ? 'true' : 'false');
    }

    for (var i = 0; i < blocks.length; i++) {
      (function (block) {
        updateEdgeFade(block);
        block.addEventListener('scroll', function () { updateEdgeFade(block); }, { passive: true });
        window.addEventListener('resize', function () { updateEdgeFade(block); });
      })(blocks[i]);
    }
  }

  initCodeEdgeFades();

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
  // Homepage Particle Field
  // ===============
  function initHomeField() {
    var canvas = document.getElementById('home-field');
    if (!canvas) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var points = [];
    var ripples = [];
    var dust = [];
    var sparks = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var frameId = null;
    var lastDust = 0;
    var linkDist = 112;
    var gravRadius = 165;
    var sparkChars = ['*', '+', '.'];

    function readColor(name, fallback) {
      var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    }

    function hexToRgb(value, fallback) {
      var color = value.replace('#', '').trim();
      if (color.length === 3) {
        color = color.split('').map(function (c) { return c + c; }).join('');
      }
      if (color.length !== 6) return fallback;
      var num = parseInt(color, 16);
      if (isNaN(num)) return fallback;
      return ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255);
    }

    function resizeHomeField() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedPoints();
    }

    function seedPoints() {
      var count = Math.min(108, Math.max(36, Math.floor(width * height / 15000)));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: 0.75 + Math.random() * 1.35
        });
      }
    }

    function addRipple(x, y) {
      var drops = [
        { speed: 2.1, width: 1.3, base: 0.34, gap: 0 },
        { speed: 1.65, width: 1, base: 0.24, gap: 12 },
        { speed: 1.25, width: 0.8, base: 0.16, gap: 22 }
      ];
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ripples.push({ x: x, y: y, age: -d.gap, speed: d.speed, width: d.width, base: d.base });
      }
      while (ripples.length > 12) ripples.shift();

      for (var j = 0; j < 5; j++) {
        var angle = Math.random() * Math.PI * 2;
        var sp = 0.55 + Math.random() * 1.15;
        sparks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * sp,
          vy: Math.sin(angle) * sp - 0.45,
          life: 1,
          size: 9 + Math.random() * 5,
          char: sparkChars[Math.floor(Math.random() * sparkChars.length)]
        });
      }
    }

    function drawRipple(ripple, accentRgb) {
      ripple.age += 1;
      if (ripple.age <= 0) return true;
      var radius = ripple.age * ripple.speed;
      var alpha = Math.max(0, ripple.base - ripple.age * 0.007);
      if (alpha <= 0) return false;

      ctx.strokeStyle = 'rgba(' + accentRgb + ',' + alpha + ')';
      ctx.lineWidth = ripple.width;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    }

    function drawDust(accentRgb) {
      for (var i = dust.length - 1; i >= 0; i--) {
        var d = dust[i];
        d.y -= 0.28;
        d.x += d.drift;
        d.life -= 0.022;
        if (d.life <= 0) {
          dust.splice(i, 1);
          continue;
        }
        ctx.fillStyle = 'rgba(' + accentRgb + ',' + (d.life * 0.22) + ')';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * d.life, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSparks(accentRgb) {
      for (var i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.025;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.life -= 0.018;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = s.life * 0.55;
        ctx.fillStyle = 'rgb(' + accentRgb + ')';
        ctx.font = s.size + 'px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.char, s.x, s.y);
        ctx.restore();
      }
    }

    function drawHomeField() {
      var textRgb = hexToRgb(readColor('--color-text-muted', '#999999'), '153,153,153');
      var accentRgb = hexToRgb(readColor('--color-accent', '#b83a2a'), '184,58,42');
      var lineRgb = hexToRgb(readColor('--color-border', '#d5d5d5'), '213,213,213');

      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (mouse.active) {
          var mdx = mouse.x - p.x;
          var mdy = mouse.y - p.y;
          var md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md > 4 && md < gravRadius) {
            var force = (1 - md / gravRadius) * 0.014;
            p.vx += (mdx / md) * force;
            p.vy += (mdy / md) * force;
          }
        }

        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        var maxSpeed = 0.56;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      for (var a = 0; a < points.length; a++) {
        for (var b = a + 1; b < points.length; b++) {
          var pa = points[a];
          var pb = points[b];
          var lx = pa.x - pb.x;
          var ly = pa.y - pb.y;
          var ld = Math.sqrt(lx * lx + ly * ly);
          if (ld < linkDist) {
            ctx.strokeStyle = 'rgba(' + lineRgb + ',' + (0.2 * (1 - ld / linkDist)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          var dx = points[a].x - mouse.x;
          var dy = points[a].y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gravRadius) {
            ctx.strokeStyle = 'rgba(' + accentRgb + ',' + (0.26 * (1 - dist / gravRadius)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[a].x, points[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < points.length; k++) {
        ctx.fillStyle = 'rgba(' + textRgb + ',0.34)';
        ctx.beginPath();
        ctx.arc(points[k].x, points[k].y, points[k].r, 0, Math.PI * 2);
        ctx.fill();
      }

      var liveRipples = [];
      for (var r = 0; r < ripples.length; r++) {
        if (drawRipple(ripples[r], accentRgb)) liveRipples.push(ripples[r]);
      }
      ripples = liveRipples;
      drawDust(accentRgb);
      drawSparks(accentRgb);

      frameId = requestAnimationFrame(drawHomeField);
    }

    window.addEventListener('resize', resizeHomeField);
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      var now = performance.now();
      if (now - lastDust > 70) {
        lastDust = now;
        dust.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          r: 0.8 + Math.random() * 1.4,
          life: 1,
          drift: (Math.random() - 0.5) * 0.32
        });
        if (dust.length > 36) dust.shift();
      }
    });
    window.addEventListener('mouseleave', function () {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });
    window.addEventListener('touchmove', function (e) {
      if (!e.touches || !e.touches[0]) return;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }, { passive: true });
    window.addEventListener('touchend', function () {
      mouse.active = false;
    });
    window.addEventListener('click', function (e) {
      addRipple(e.clientX, e.clientY);
    });

    resizeHomeField();
    frameId = requestAnimationFrame(drawHomeField);

    window.addEventListener('beforeunload', function () {
      if (frameId) cancelAnimationFrame(frameId);
    });
  }

  initHomeField();

  // ===============
  // Homepage Magnetic Elements
  // ===============
  function initHomeMagnetics() {
    if (!document.querySelector('.home-stage')) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var items = document.querySelectorAll('.home-magnetic');
    if (!items.length) return;

    var states = [];
    for (var i = 0; i < items.length; i++) {
      states.push({
        el: items[i],
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        strength: parseFloat(items[i].getAttribute('data-magnet-strength')) || 10,
        radius: parseFloat(items[i].getAttribute('data-magnet-radius')) || 100
      });
    }

    window.addEventListener('mousemove', function (e) {
      for (var i = 0; i < states.length; i++) {
        var st = states[i];
        var rect = st.el.getBoundingClientRect();
        // Rect includes the previous frame's translate. Remove it so the
        // target is always based on the element's resting position.
        var left = rect.left - st.x;
        var top = rect.top - st.y;
        var right = left + rect.width;
        var bottom = top + rect.height;
        var cx = left + rect.width / 2;
        var cy = top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var nearestX = Math.max(left, Math.min(e.clientX, right));
        var nearestY = Math.max(top, Math.min(e.clientY, bottom));
        var edgeX = e.clientX - nearestX;
        var edgeY = e.clientY - nearestY;
        var edgeDist = Math.sqrt(edgeX * edgeX + edgeY * edgeY);

        if (edgeDist < st.radius) {
          var proximity = 1 - edgeDist / st.radius;
          var relativeX = Math.max(-1, Math.min(1, dx / Math.max(rect.width / 2, 1)));
          var relativeY = Math.max(-1, Math.min(1, dy / Math.max(rect.height / 2, 1)));
          st.tx = relativeX * st.strength * proximity;
          st.ty = relativeY * st.strength * proximity;
        } else {
          st.tx = 0;
          st.ty = 0;
        }
      }
    });

    window.addEventListener('mouseleave', function () {
      for (var i = 0; i < states.length; i++) {
        states[i].tx = 0;
        states[i].ty = 0;
      }
    });

    function magneticFrame() {
      for (var i = 0; i < states.length; i++) {
        var st = states[i];
        st.x += (st.tx - st.x) * 0.14;
        st.y += (st.ty - st.y) * 0.14;
        st.el.style.transform = 'translate(' + st.x + 'px,' + st.y + 'px)';
      }
      requestAnimationFrame(magneticFrame);
    }

    requestAnimationFrame(magneticFrame);
  }

  initHomeMagnetics();

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
