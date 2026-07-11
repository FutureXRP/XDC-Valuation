/* ============================================================
   XDC Valuation Framework — main.js
   Feed rendering (series / field notes / manifest) + live ticker.
   All content cards are JSON-feed driven. Nothing is hardcoded.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Utilities ---------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* Render a title with its optional emphasized fragment in the
     accent style (italic + manila), per the family convention. */
  function renderTitle(title, emphasis) {
    var safeTitle = escapeHtml(title || "");
    if (emphasis) {
      var safeEmphasis = escapeHtml(emphasis);
      if (safeTitle.indexOf(safeEmphasis) !== -1) {
        safeTitle = safeTitle.replace(safeEmphasis, "<em>" + safeEmphasis + "</em>");
      }
    }
    return safeTitle;
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length !== 3) return escapeHtml(iso);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = parseInt(parts[1], 10);
    if (!m || m < 1 || m > 12) return escapeHtml(iso);
    return months[m - 1] + " " + parseInt(parts[2], 10) + ", " + parts[0];
  }

  function fetchFeed(url) {
    return fetch(url, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  /* ---------- Card rendering (one function for all three feeds) ---------- */

  function stampClassFor(section) {
    return section === "series" ? "stamp-manila" : "stamp-carbon";
  }

  function renderCard(post) {
    var coming = post.status !== "published";
    var card = document.createElement("article");
    card.className = "card" + (coming ? " card-coming" : "");

    var html = "";

    html += '<div class="stamp-row">';
    html += '<span class="stamp ' + stampClassFor(post.section) + '">' + escapeHtml(post.number || "") + "</span>";
    if (coming) {
      html += '<span class="stamp stamp-seal">Forthcoming</span>';
    }
    html += "</div>";

    if (post.kicker) {
      html += '<p class="card-kicker">' + escapeHtml(post.kicker) + "</p>";
    }

    var titleHtml = renderTitle(post.title, post.titleEmphasis);
    if (!coming && post.url) {
      html += "<h3><a href=\"" + escapeHtml(post.url) + '">' + titleHtml + "</a></h3>";
    } else {
      html += "<h3>" + titleHtml + "</h3>";
    }

    if (post.summary) {
      html += '<p class="card-summary">' + escapeHtml(post.summary) + "</p>";
    }

    if (post.inside && post.inside.length) {
      html += '<ul class="card-inside">';
      post.inside.forEach(function (item) {
        html += "<li>" + escapeHtml(item) + "</li>";
      });
      html += "</ul>";
    }

    html += '<div class="card-meta">';
    if (post.tags && post.tags.length) {
      html += '<span class="card-tags">';
      post.tags.forEach(function (tag) {
        html += '<span class="card-tag">' + escapeHtml(tag) + "</span>";
      });
      html += "</span>";
    }
    html += '<span class="card-date">' + (coming ? "Forthcoming" : formatDate(post.date)) + "</span>";
    html += "</div>";

    card.innerHTML = html;
    return card;
  }

  function renderCards(container, posts, emptyMessage) {
    container.innerHTML = "";
    if (!posts.length) {
      var empty = document.createElement("p");
      empty.className = "feed-empty";
      empty.textContent = emptyMessage;
      container.appendChild(empty);
      return;
    }
    posts.forEach(function (post) {
      container.appendChild(renderCard(post));
    });
  }

  function renderFeedError(container) {
    if (!container) return;
    container.innerHTML = "";
    var err = document.createElement("p");
    err.className = "feed-error";
    err.textContent = "Feed unavailable.";
    container.appendChild(err);
  }

  /* ---------- Contents list (compact: number, title, one-liner) ---------- */

  function firstSentence(text) {
    if (!text) return "";
    var match = String(text).match(/^.*?[.!?](?=\s|$)/);
    return match ? match[0] : text;
  }

  function renderContents(container, posts) {
    container.innerHTML = "";
    posts.forEach(function (post) {
      var li = document.createElement("li");
      var coming = post.status !== "published";
      var titleHtml = renderTitle(post.title, post.titleEmphasis);
      var html = "";
      html += '<span class="contents-number">' + escapeHtml(post.number || "") + "</span>";
      if (!coming && post.url) {
        html += '<span class="contents-title"><a href="' + escapeHtml(post.url) + '">' + titleHtml + "</a></span>";
      } else {
        html += '<span class="contents-title">' + titleHtml + "</span>";
      }
      html += '<p class="contents-line">' + escapeHtml(firstSentence(post.summary)) + "</p>";
      if (coming) {
        html += '<span class="contents-status">Forthcoming</span>';
      }
      li.innerHTML = html;
      container.appendChild(li);
    });
  }

  /* ---------- Feed wiring ---------- */

  function byNewest(a, b) {
    return String(b.date || "").localeCompare(String(a.date || ""));
  }

  function initFeeds() {
    var contentsList = document.getElementById("contents-list");
    var seriesCards = document.getElementById("series-cards");
    var fieldnotesCards = document.getElementById("fieldnotes-cards");
    var manifestCards = document.getElementById("manifest-cards");

    if (contentsList || seriesCards) {
      fetchFeed("/feeds/series.json").then(function (feed) {
        var posts = (feed.posts || []).slice(); // feed order = series order
        if (contentsList) renderContents(contentsList, posts);
        if (seriesCards) renderCards(seriesCards, posts, "The series is forthcoming.");
      }).catch(function () {
        renderFeedError(contentsList);
        renderFeedError(seriesCards);
      });
    }

    if (fieldnotesCards) {
      fetchFeed("/feeds/fieldnotes.json").then(function (feed) {
        var posts = (feed.posts || []).slice().sort(byNewest);
        renderCards(fieldnotesCards, posts, "First entries forthcoming.");
      }).catch(function () {
        renderFeedError(fieldnotesCards);
      });
    }

    if (manifestCards) {
      fetchFeed("/feeds/manifest.json").then(function (feed) {
        var posts = (feed.posts || []).slice().sort(byNewest);
        renderCards(manifestCards, posts, "First entries forthcoming.");
      }).catch(function () {
        renderFeedError(manifestCards);
      });
    }
  }

  /* ---------- Live ticker (CoinGecko, no API key) ---------- */

  var TICKER_URL = "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=xdce-crowd-sale&vs_currencies=usd&include_24hr_vol=true&include_market_cap=true";

  function formatPrice(value) {
    if (typeof value !== "number" || !isFinite(value)) return "—";
    var decimals = value >= 1 ? 3 : 4;
    return "$" + value.toFixed(decimals);
  }

  function formatCompact(value) {
    if (typeof value !== "number" || !isFinite(value)) return "—";
    if (value >= 1e12) return "$" + (value / 1e12).toFixed(2) + "T";
    if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
    if (value >= 1e6) return "$" + (value / 1e6).toFixed(1) + "M";
    if (value >= 1e3) return "$" + (value / 1e3).toFixed(1) + "K";
    return "$" + value.toFixed(0);
  }

  function setTicker(field, text) {
    var el = document.querySelector('[data-ticker="' + field + '"]');
    if (el) el.textContent = text;
  }

  function updateTicker() {
    fetch(TICKER_URL).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      var xdc = data["xdce-crowd-sale"];
      if (!xdc) throw new Error("Missing id in response");
      setTicker("price", formatPrice(xdc.usd));
      setTicker("volume", formatCompact(xdc.usd_24h_vol));
      setTicker("mcap", formatCompact(xdc.usd_market_cap));
    }).catch(function () {
      setTicker("price", "—");
      setTicker("volume", "—");
      setTicker("mcap", "—");
    });
  }

  function initTicker() {
    if (!document.getElementById("ticker")) return;
    updateTicker();
    window.setInterval(updateTicker, 60000);
  }

  /* ---------- Init ---------- */

  function init() {
    initFeeds();
    initTicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
