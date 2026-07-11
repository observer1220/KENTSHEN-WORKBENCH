(function(){
  "use strict";

  var LANG_KEY = "kentshen_lang";
  var MODE_KEY = "kentshen_mode";
  var CATEGORY_ORDER = ["extensions", "apps", "games", "services"];
  var LOCALE_PATH = "locales/";

  // ---- tiny markdown: **bold** and [text](url) only ----
  function mdToHtml(str){
    if(!str) return "";
    var escaped = str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\[(.+?)\]\((.+?)\)/g, function(_, text, url){
      var safeUrl = url.replace(/"/g, "&quot;");
      return '<a href="' + safeUrl + '" target="_blank" rel="noopener">' + text + '</a>';
    });
    return escaped;
  }

  function detectDefaultLang(){
    var saved = null;
    try { saved = window.localStorage.getItem(LANG_KEY); } catch(e){}
    if(saved === "en" || saved === "zh") return saved;
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh" : "en";
  }

  function detectDefaultMode(){
    var saved = null;
    try { saved = window.localStorage.getItem(MODE_KEY); } catch(e){}
    if(saved === "dark" || saved === "light") return saved;
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function buildEntry(product, data){
    var statusKey = product.status || "planned";
    var statusLabel = data.ui.statusLabels[statusKey] || statusKey;
    var isPlanned = statusKey === "planned";

    var article = document.createElement("article");
    article.className = "entry" + (isPlanned ? " is-planned" : "");
    article.setAttribute("data-status", statusKey);

    var meta = document.createElement("div");
    meta.className = "entry-meta";
    var dateEl = document.createElement("span");
    dateEl.textContent = product.date || "—";
    var tag = document.createElement("span");
    tag.className = "status-tag";
    tag.textContent = statusLabel;
    meta.appendChild(dateEl);
    meta.appendChild(tag);

    var h3 = document.createElement("h3");
    h3.textContent = product.title + " ";
    var kindSpan = document.createElement("span");
    kindSpan.className = "kind";
    kindSpan.textContent = product.kind;
    h3.appendChild(kindSpan);

    var desc = document.createElement("p");
    desc.className = "desc";
    desc.innerHTML = mdToHtml(product.desc);

    article.appendChild(meta);
    article.appendChild(h3);
    article.appendChild(desc);

    if(product.links && product.links.length){
      var linksDiv = document.createElement("div");
      linksDiv.className = "links";
      product.links.forEach(function(link){
        var a = document.createElement("a");
        a.href = link.url;
        var label = data.ui.linkLabels[link.label] || link.label;
        a.textContent = label;
        if(link.url && link.url !== "#"){
          a.target = "_blank";
          a.rel = "noopener";
        }
        linksDiv.appendChild(a);
      });
      article.appendChild(linksDiv);
    }

    return article;
  }

  // ---- safe DOM helpers ----
  // Getting an element that's missing (e.g. commented out while drafting
  // copy) returns null. Setting a property on null throws and stops the
  // rest of render() from running. These helpers just skip missing
  // elements instead of crashing.
  function byId(id){
    return document.getElementById(id);
  }
  function setText(id, value){
    var el = byId(id);
    if(el) el.textContent = value;
  }
  function setHTML(id, value){
    var el = byId(id);
    if(el) el.innerHTML = value;
  }
  function setAttr(id, attr, value){
    var el = byId(id);
    if(el) el.setAttribute(attr, value);
  }

  function render(data){
    setAttr("htmlRoot", "lang", data.meta.htmlLang);
    setText("pageTitle", data.meta.title);
    setAttr("pageDescription", "content", data.meta.description);

    setText("tagline", data.ui.tagline);
    setText("aboutLinkLabel", data.ui.aboutLink);

    var nav = byId("catNav");
    if(nav){
      nav.innerHTML = "";
      CATEGORY_ORDER.forEach(function(cat){
        if(!data.ui.nav[cat]) return; // category label not filled in yet
        var a = document.createElement("a");
        a.href = "#" + cat;
        a.textContent = data.ui.nav[cat];
        nav.appendChild(a);
      });
    }

    setHTML("heroStatement", mdToHtml(data.ui.hero.statement));
    setText("heroSub", data.ui.hero.sub);

    setText("labelExtensions", data.ui.sections.extensions);
    setText("labelApps", data.ui.sections.apps);
    setText("labelGames", data.ui.sections.games);
    setText("labelServices", data.ui.sections.services);

    CATEGORY_ORDER.forEach(function(cat){
      var rail = byId("rail" + cat.charAt(0).toUpperCase() + cat.slice(1));
      if(!rail) return; // whole section commented out — skip it
      rail.innerHTML = "";
      data.products
        .filter(function(p){ return p.category === cat; })
        .forEach(function(p){ rail.appendChild(buildEntry(p, data)); });
    });

    setText("aboutLabel", data.ui.about.label);
    setText("aboutBody", data.ui.about.body);

    var footLinks = byId("footLinks");
    if(footLinks){
      footLinks.innerHTML = "";
      Object.keys(data.ui.about.links).forEach(function(key){
        if(!data.ui.about.links[key]) return; // link label not filled in yet
        var a = document.createElement("a");
        a.href = "#";
        a.textContent = data.ui.about.links[key];
        footLinks.appendChild(a);
      });
    }

    setText("colophon", data.ui.colophon);

    document.body.classList.toggle("lang-zh", data.meta.htmlLang.indexOf("zh") === 0);
  }

  var cache = {};
  function loadLang(lang){
    if(cache[lang]){
      render(cache[lang]);
      return Promise.resolve();
    }
    return fetch(LOCALE_PATH + lang + ".json")
      .then(function(res){
        if(!res.ok) throw new Error("Failed to load " + lang + ".json");
        return res.json();
      })
      .then(function(data){
        cache[lang] = data;
        render(data);
      })
      .catch(function(err){
        console.error(err);
      });
  }

  var SUN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="4"></circle>' +
    '<line x1="12" y1="2" x2="12" y2="4.5"></line>' +
    '<line x1="12" y1="19.5" x2="12" y2="22"></line>' +
    '<line x1="4.2" y1="4.2" x2="6" y2="6"></line>' +
    '<line x1="18" y1="18" x2="19.8" y2="19.8"></line>' +
    '<line x1="2" y1="12" x2="4.5" y2="12"></line>' +
    '<line x1="19.5" y1="12" x2="22" y2="12"></line>' +
    '<line x1="4.2" y1="19.8" x2="6" y2="18"></line>' +
    '<line x1="18" y1="6" x2="19.8" y2="4.2"></line>' +
    '</svg>';
  var MOON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5z"></path>' +
    '</svg>';

  function paintModeIcon(mode){
    var btn = byId("modeToggle");
    if(!btn) return;
    // Icon shows the mode you'll switch TO, matching the sun/moon convention
    // used across the site: light bg shows a moon (switch to dark), dark bg shows a sun.
    btn.innerHTML = mode === "dark" ? SUN_ICON : MOON_ICON;
    btn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  var root = document.documentElement;
  var currentLang = detectDefaultLang();
  var currentMode = detectDefaultMode();
  root.setAttribute("data-mode", currentMode);
  paintModeIcon(currentMode);

  loadLang(currentLang).then(function(){
    document.body.hidden = false;
  });

  var langBtn = byId("langToggle");
  if(langBtn){
    langBtn.addEventListener("click", function(){
      currentLang = currentLang === "en" ? "zh" : "en";
      try { window.localStorage.setItem(LANG_KEY, currentLang); } catch(e){}
      loadLang(currentLang);
    });
  }

  var modeBtn = byId("modeToggle");
  if(modeBtn){
    modeBtn.addEventListener("click", function(){
      currentMode = currentMode === "dark" ? "light" : "dark";
      root.setAttribute("data-mode", currentMode);
      paintModeIcon(currentMode);
      try { window.localStorage.setItem(MODE_KEY, currentMode); } catch(e){}
    });
  }
})();
