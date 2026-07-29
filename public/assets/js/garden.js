/* garden.js - Reading Garden interactive features */
/* No em dashes. All features gated on DOMContentLoaded. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fetchJSON(url, cb) {
      fetch(url)
        .then(function (r) { return r.json(); })
        .then(cb)
        .catch(function () { cb(null); });
    }

    (function initBench() {
      var hero = document.getElementById('garden-bench-hero');
      if (!hero) return;

      var hour = new Date().getHours();
      var sky = hour < 11 ? 'morning' : hour < 17 ? 'afternoon' : 'dusk';
      hero.classList.add('garden-hero--' + sky);

      if (motionOk) {
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 600ms ease';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            hero.style.opacity = '1';
          });
        });
      }

      var lineEl = document.getElementById('garden-bench-line');
      var btn = document.getElementById('garden-bench-btn');
      if (!lineEl || !btn) return;

      fetchJSON('/data/lines.json', function (lines) {
        if (!lines || !lines.length) return;
        var idx = 0;
        btn.addEventListener('click', function () {
          var updateLine = function () {
            lineEl.textContent = lines[idx % lines.length];
            idx++;
            lineEl.classList.add('is-visible');
          };

          if (motionOk) {
            lineEl.classList.remove('is-visible');
            window.setTimeout(updateLine, 200);
          } else {
            updateLine();
          }
        });
      });
    }());

    (function initPetals() {
      var overlay = document.getElementById('garden-card-overlay');
      if (!overlay) return;

      var lineEl = document.getElementById('garden-card-line');
      var shareBtn = document.getElementById('garden-card-share');
      var copyMsg = document.getElementById('garden-card-copy-msg');
      var closeBtn = document.getElementById('garden-card-close');

      var currentLine = '';

      function openCard(line) {
        currentLine = line;
        if (lineEl) lineEl.textContent = '"' + line + '"';
        overlay.classList.add('is-open');
        if (closeBtn) closeBtn.focus();
      }

      function closeCard() {
        overlay.classList.remove('is-open');
      }

      fetchJSON('/data/lines.json', function (lines) {
        if (!lines || !lines.length) return;

        /* Flower buttons in the petal container */
        var flowerBtns = document.querySelectorAll('.garden-flower-btn');
        var idx = 0;
        Array.prototype.forEach.call(flowerBtns, function (btn) {
          btn.addEventListener('click', function () {
            openCard(lines[idx % lines.length]);
            idx++;
          });
        });

        /* Pick a Petal circular control (bottom-right) */
        var petalBtn = document.getElementById('garden-bird-toggle');
        if (petalBtn) {
          petalBtn.addEventListener('click', function () {
            openCard(lines[Math.floor(Math.random() * lines.length)]);
          });
        }
      });

      if (closeBtn) closeBtn.addEventListener('click', closeCard);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeCard();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeCard();
      });

      if (shareBtn) {
        shareBtn.addEventListener('click', function () {
          var siteUrl = 'https://iwriteyouread.org';
          var text = '"' + currentLine + '" - Alexander Afolabi, ' + siteUrl;
          if (navigator.share) {
            navigator.share({ text: text, url: siteUrl }).catch(function () {});
          } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              if (copyMsg) {
                copyMsg.textContent = 'Copied to clipboard.';
                window.setTimeout(function () { copyMsg.textContent = ''; }, 2500);
              }
            }).catch(function () {
              if (copyMsg) copyMsg.textContent = 'Could not copy. Please copy manually.';
            });
          } else if (copyMsg) {
            copyMsg.textContent = 'Sharing is not available in this browser.';
          }
        });
      }
    }());

    (function initShelf() {
      var strip = document.getElementById('garden-spine-strip');
      var noteEl = document.getElementById('garden-shelf-note');
      if (!strip || !noteEl) return;

      fetchJSON('/data/shelf.json', function (books) {
        if (!books) return;

        fetchJSON('/data/site.json', function (site) {
          var tag = (site && site.affiliateTag) ? site.affiliateTag : '';

          function buildAffiliateUrl(link) {
            if (!link || link === '') return link;
            if (!tag || tag === '') return link;
            var sep = link.indexOf('?') !== -1 ? '&' : '?';
            return link + sep + 'tag=' + encodeURIComponent(tag);
          }

          function showNote(book) {
            var noteHtml = '<p style="font-size:0.75rem;color:var(--sage);margin-bottom:0.5rem">' +
              'Note on <em>' + book.title + '</em> by ' + book.author +
              '</p><p>' + book.note + '</p>';
            var linkUrl = buildAffiliateUrl(book.link);
            if (linkUrl && linkUrl !== '') {
              noteHtml += '<a href="' + linkUrl + '" class="garden-almanac__link" target="_blank" rel="sponsored nofollow noopener">Find on Amazon UK</a>';
            }
            noteEl.innerHTML = noteHtml;
            noteEl.classList.add('is-visible');
          }

          books.forEach(function (book, i) {
            var btn = document.createElement('button');
            btn.className = 'garden-spine';
            btn.setAttribute('aria-label', book.title + ' by ' + book.author);
            btn.setAttribute('data-index', i);
            btn.style.background = book.spineColor || '#8A9C82';
            var titleEl = document.createElement('span');
            titleEl.className = 'garden-spine__title';
            titleEl.textContent = book.title;
            btn.appendChild(titleEl);

            btn.addEventListener('mouseenter', function () { showNote(book); });
            btn.addEventListener('focus', function () { showNote(book); });
            btn.addEventListener('click', function () {
              showNote(book);
              noteEl.focus();
            });
            strip.appendChild(btn);
          });
        });
      });
    }());

    (function initAlmanac() {
      var cards = document.querySelectorAll('.garden-almanac[data-src]');
      if (!cards.length) return;
      fetchJSON('/data/latest-post.json', function (post) {
        Array.prototype.forEach.call(cards, function (card) {
          if (!post) {
            card.innerHTML = '<p class="garden-almanac__label">From the blog</p>' +
              '<p class="garden-almanac__excerpt">Come and read the latest from Alexander.</p>' +
              '<a class="garden-almanac__link" href="/blog.html">Visit the blog</a>';
            return;
          }
          card.innerHTML =
            '<p class="garden-almanac__label">Latest from the blog</p>' +
            '<p class="garden-almanac__title">' + post.title + '</p>' +
            '<p class="garden-almanac__excerpt">' + post.excerpt + '</p>' +
            '<a class="garden-almanac__link" href="' + post.url + '">Read the essay</a>';
        });
      });
    }());
  });
}());

