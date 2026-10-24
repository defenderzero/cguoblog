(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  var root = body.getAttribute('data-root') || '/';

  /* ---------------- 深色模式 ---------------- */
  function syncGiscusTheme() {
    var iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage({
      giscus: {
        setConfig: {
          theme: doc.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        }
      }
    }, 'https://giscus.app');
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      syncGiscusTheme();
    });
  }

  window.addEventListener('load', function () {
    setTimeout(syncGiscusTheme, 1200);
    setTimeout(syncGiscusTheme, 3000);
  });

  /* ---------------- 顶栏 / 进度条 / 返回顶部 ---------------- */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('readingProgress');
  var backTop = document.getElementById('backToTop');

  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop || 0;
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
    }
    if (progress) {
      var max = doc.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
    }
    if (backTop) {
      backTop.classList.toggle('is-visible', y > 600);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- 移动端菜单 ---------------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- 侧栏 Tab ---------------- */
  document.querySelectorAll('.widget-tabs').forEach(function (tabs) {
    var widget = tabs.closest('.widget');
    if (!widget) return;
    var buttons = tabs.querySelectorAll('[data-tab]');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');

        widget.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.classList.remove('active');
        });
        var target = widget.querySelector('[data-panel="' + button.getAttribute('data-tab') + '"]');
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---------------- 文章目录 ---------------- */
  var tocNav = document.getElementById('tocNav');
  var tocWidget = document.getElementById('tocWidget');
  var mobileToc = document.getElementById('mobileToc');
  var mobileTocNav = document.getElementById('mobileTocNav');

  if (tocNav || mobileTocNav) {
    var headings = Array.prototype.slice.call(
      document.querySelectorAll('.post-content h2, .post-content h3')
    );

    if (!headings.length) {
      if (tocWidget) tocWidget.style.display = 'none';
      if (mobileToc) mobileToc.style.display = 'none';
    } else {
      var tocLinks = [];

      headings.forEach(function (heading, index) {
        if (!heading.id) heading.id = 'heading-' + index;

        var item = { heading: heading, links: [] };

        [tocNav, mobileTocNav].forEach(function (nav) {
          if (!nav) return;

          var link = document.createElement('a');
          link.href = '#' + heading.id;
          link.textContent = heading.textContent;
          link.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
          link.addEventListener('click', function (event) {
            event.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.replaceState) history.replaceState(null, '', '#' + heading.id);
            if (mobileToc) mobileToc.removeAttribute('open');
          });

          nav.appendChild(link);
          item.links.push(link);
        });

        tocLinks.push(item);
      });

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            tocLinks.forEach(function (item) {
              item.links.forEach(function (link) {
                link.classList.toggle('active', item.heading === entry.target);
              });
            });
          });
        }, { rootMargin: '-84px 0px -70% 0px', threshold: 0 });

        headings.forEach(function (heading) {
          observer.observe(heading);
        });
      }
    }
  }

  /* ---------------- 图片灯箱 ---------------- */
  var lightbox = document.getElementById('lightbox');

  if (lightbox) {
    var lightboxImage = lightbox.querySelector('img');

    document.querySelectorAll('.post-content img').forEach(function (image) {
      image.addEventListener('click', function () {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || '';
        lightbox.classList.add('is-open');
        body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      body.style.overflow = '';
    }

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /* ---------------- Toast ---------------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
  }

  /* ---------------- 复制链接 ---------------- */
  document.querySelectorAll('[data-copy-link]').forEach(function (button) {
    button.addEventListener('click', function () {
      var url = button.getAttribute('data-copy-link') || window.location.href;

      function done() {
        showToast('链接已复制');
      }

      function fallback() {
        var input = document.createElement('textarea');
        input.value = url;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand('copy');
          done();
        } catch (error) {
          showToast('复制失败，请手动复制');
        }
        document.body.removeChild(input);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------------- 打赏弹窗 ---------------- */
  var donateModal = document.getElementById('donateModal');

  if (donateModal) {
    document.querySelectorAll('[data-donate-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        donateModal.classList.add('is-open');
        body.style.overflow = 'hidden';
      });
    });

    donateModal.querySelectorAll('[data-donate-close]').forEach(function (element) {
      element.addEventListener('click', function () {
        donateModal.classList.remove('is-open');
        body.style.overflow = '';
      });
    });

    donateModal.querySelectorAll('[data-donate-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-donate-tab');

        donateModal.querySelectorAll('[data-donate-tab]').forEach(function (item) {
          item.classList.remove('active');
        });
        tab.classList.add('active');

        donateModal.querySelectorAll('[data-donate-panel]').forEach(function (panel) {
          panel.classList.remove('active');
        });
        var target = donateModal.querySelector('[data-donate-panel="' + name + '"]');
        if (target) target.classList.add('active');
      });
    });
  }

  /* ---------------- 代码复制 ---------------- */
  document.querySelectorAll('.post-content .highlight').forEach(function (block) {
    if (block.querySelector('.code-copy')) return;

    var code = block.querySelector('.code pre') || block.querySelector('pre');
    if (!code) return;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');

    button.addEventListener('click', function () {
      var text = code.innerText;

      function done() {
        button.textContent = '已复制';
        setTimeout(function () {
          button.textContent = '复制';
        }, 1500);
      }

      function fallback() {
        var input = document.createElement('textarea');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand('copy');
          done();
        } catch (error) {
          showToast('复制失败');
        }
        document.body.removeChild(input);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });

    block.appendChild(button);
  });

  /* ---------------- 站内搜索 ---------------- */
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchCache = null;

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function loadSearchIndex() {
    if (searchCache) return Promise.resolve(searchCache);

    return fetch(root + 'search.xml')
      .then(function (response) {
        if (!response.ok) throw new Error('search index not found');
        return response.text();
      })
      .then(function (text) {
        var xml = new DOMParser().parseFromString(text, 'text/xml');
        var entries = Array.prototype.slice.call(xml.querySelectorAll('entry'));

        searchCache = entries.map(function (entry) {
          return {
            title: entry.querySelector('title') ? entry.querySelector('title').textContent : '',
            url: entry.querySelector('url') ? entry.querySelector('url').textContent : '',
            content: entry.querySelector('content') ? entry.querySelector('content').textContent : ''
          };
        });

        return searchCache;
      });
  }

  function normalizeUrl(url) {
    if (!url) return root;
    if (url.indexOf('http') === 0) return url;
    if (url.charAt(0) === '/') return url;
    return root + url;
  }

  function renderResults(items, query, container) {
    if (!container) return;

    if (!query) {
      container.innerHTML = '<p class="search-hint">输入关键词，搜索全站文章</p>';
      return;
    }

    if (!items.length) {
      container.innerHTML = '<p class="search-hint">没有找到与「' + escapeHtml(query) + '」相关的文章</p>';
      return;
    }

    container.innerHTML = '';

    items.slice(0, 12).forEach(function (item) {
      var plain = String(item.content || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      var index = plain.toLowerCase().indexOf(query.toLowerCase());
      var snippet = index >= 0
        ? plain.slice(Math.max(0, index - 40), index + 120)
        : plain.slice(0, 130);

      var link = document.createElement('a');
      link.className = 'search-result';
      link.href = normalizeUrl(item.url);
      link.innerHTML = '<strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(snippet) + '…</span>';
      container.appendChild(link);
    });
  }

  function runSearch(query, container) {
    if (!container) return;

    loadSearchIndex()
      .then(function (index) {
        var keyword = query.trim().toLowerCase();
        if (!keyword) {
          renderResults([], '', container);
          return;
        }

        var matches = index.filter(function (item) {
          return (item.title + ' ' + item.content).toLowerCase().indexOf(keyword) !== -1;
        });

        renderResults(matches, query.trim(), container);
      })
      .catch(function () {
        container.innerHTML = '<p class="search-hint">搜索索引加载失败，请确认已执行 hexo generate 后重试。</p>';
      });
  }

  if (searchOverlay) {
    var searchOpen = document.getElementById('searchOpen');
    var searchClose = document.getElementById('searchClose');

    function openSearch() {
      searchOverlay.classList.add('is-open');
      body.style.overflow = 'hidden';
      setTimeout(function () {
        if (searchInput) searchInput.focus();
      }, 50);
    }

    function closeSearch() {
      searchOverlay.classList.remove('is-open');
      body.style.overflow = '';
    }

    if (searchOpen) searchOpen.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', function (event) {
      if (event.target === searchOverlay) closeSearch();
    });

    if (searchInput) {
      var searchTimer = null;
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimer);
        var value = searchInput.value;
        searchTimer = setTimeout(function () {
          runSearch(value, searchResults);
        }, 180);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeSearch();
      var tag = document.activeElement && document.activeElement.tagName;
      if (event.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        openSearch();
      }
    });
  }

  /* ---------------- 搜索页 ---------------- */
  var searchPageInput = document.getElementById('searchPageInput');

  if (searchPageInput) {
    var pageResults = document.getElementById('searchPageResults');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery) {
      searchPageInput.value = initialQuery;
      runSearch(initialQuery, pageResults);
    }

    var pageTimer = null;
    searchPageInput.addEventListener('input', function () {
      clearTimeout(pageTimer);
      var value = searchPageInput.value;
      pageTimer = setTimeout(function () {
        runSearch(value, pageResults);
      }, 180);
    });
  }
})();
