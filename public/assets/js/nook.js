/* nook.js - The Reading Nook quiz */
(function () {
  'use strict';

  var scores = { soothed: 0, provoked: 0, understood: 0 };
  var currentQ = 0;
  var questions = [];
  var profiles = {};

  function fetchJSON(url, cb) {
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(cb)
      .catch(function () { cb(null); });
  }

  function getProfile() {
    var max = 0;
    var winner = 'soothed';
    ['soothed', 'provoked', 'understood'].forEach(function (k) {
      if (scores[k] > max) {
        max = scores[k];
        winner = k;
      }
    });
    return winner;
  }

  function updatePips() {
    var pips = document.querySelectorAll('.garden-nook__pip');
    Array.prototype.forEach.call(pips, function (pip, i) {
      pip.classList.remove('is-active', 'is-done');
      if (i < currentQ) pip.classList.add('is-done');
      if (i === currentQ) pip.classList.add('is-active');
    });
  }

  function showQuestion() {
    var panel = document.getElementById('garden-nook-panel');
    if (!panel) return;
    var q = questions[currentQ];
    var qEl = panel.querySelector('.garden-nook__question');
    var list = panel.querySelector('.garden-nook__answers');
    if (qEl) qEl.textContent = q.text;
    if (list) {
      list.innerHTML = '';
      q.answers.forEach(function (ans) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.className = 'garden-nook__answer';
        btn.textContent = ans.text;
        btn.addEventListener('click', function () {
          scores[ans.profile]++;
          currentQ++;
          if (currentQ < questions.length) {
            updatePips();
            showQuestion();
          } else {
            var profile = getProfile();
            window.location.hash = profile;
            showResult(profile);
          }
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
    }
    updatePips();
  }

  function buildAffiliateUrl(link, tag) {
    if (!link || link === '') return link;
    if (!tag || tag === '') return link;
    var sep = link.indexOf('?') !== -1 ? '&' : '?';
    return link + sep + 'tag=' + encodeURIComponent(tag);
  }

  function showResult(profileKey) {
    var panel = document.getElementById('garden-nook-panel');
    var resultEl = document.getElementById('garden-nook-result');
    if (!panel || !resultEl) return;
    panel.style.display = 'none';
    resultEl.classList.add('is-visible');

    var p = profiles[profileKey];
    if (!p) return;

    fetchJSON('/data/site.json', function (site) {
      var tag = (site && site.affiliateTag) ? site.affiliateTag : '';
      var html = '<p class="garden-nook__result-name">' + p.name + '</p>' +
        '<p style="margin-bottom:1.5rem;line-height:1.6">' + p.description + '</p>';
      p.books.forEach(function (book) {
        var linkUrl = buildAffiliateUrl(book.link, tag);
        html += '<div class="garden-nook__book">' +
          '<p class="garden-nook__book-title">' + book.title + '</p>' +
          '<p class="garden-nook__book-author">' + book.author + '</p>' +
          '<p class="garden-nook__book-reason">' + book.reason + '</p>';
        if (linkUrl && linkUrl !== '') {
          html += '<a class="garden-nook__book-link" href="' + linkUrl + '" target="_blank" rel="sponsored nofollow noopener">Find on Amazon UK</a>';
        }
        html += '</div>';
      });
      resultEl.innerHTML = html;

      var restartBtn = document.createElement('button');
      restartBtn.className = 'garden-nook__restart';
      restartBtn.textContent = 'Start again';
      restartBtn.addEventListener('click', function () {
        scores = { soothed: 0, provoked: 0, understood: 0 };
        currentQ = 0;
        resultEl.classList.remove('is-visible');
        resultEl.innerHTML = '';
        window.location.hash = '';
        panel.style.display = '';
        showQuestion();
      });
      resultEl.appendChild(restartBtn);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchJSON('/data/nook.json', function (data) {
      if (!data) return;
      questions = data.questions;
      profiles = data.profiles;

      var hash = window.location.hash.replace('#', '');
      if (hash && profiles[hash]) {
        showResult(hash);
        return;
      }

      showQuestion();
    });
  });
}());
