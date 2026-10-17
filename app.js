// Generated from src/app.ts. Edit src/, then run npm run build.
"use strict";
(() => {
  // src/ui/dom.ts
  function $(selector, root = document) {
    const element = root.querySelector(selector);
    if (!element) throw new Error(`Required element missing: ${selector}`);
    return element;
  }
  function $$(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }
  var esc = (value) => String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char
  );
  var safe = (value) => {
    try {
      const url = new URL(value || "", location.href);
      return ["http:", "https:", "file:"].includes(url.protocol) ? esc(value) : "#";
    } catch {
      return "#";
    }
  };
  var external = (url, label, cls = "") => '<a class="' + esc(cls) + '" href="' + safe(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + "</a>";
  function download(name, data) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }

  // src/ui/media.ts
  function layout() {
    const gallery2 = document.querySelector(".gallery");
    if (!gallery2) return;
    const cards = $$(".case-card", gallery2);
    if (!cards.length) {
      gallery2.style.height = "auto";
      return;
    }
    const cols = innerWidth > 1e3 ? 3 : 2, gap = innerWidth <= 680 ? 14 : 24, width = (gallery2.clientWidth - (cols - 1) * gap) / cols;
    const heights = Array(cols).fill(0);
    for (const card2 of cards) {
      card2.style.width = width + "px";
      const col = heights.indexOf(Math.min(...heights));
      card2.style.left = col * (width + gap) + "px";
      card2.style.top = heights[col] + "px";
      heights[col] = (heights[col] || 0) + card2.offsetHeight;
    }
    gallery2.style.height = Math.max(...heights) + "px";
  }
  function bindMedia() {
    const main3 = $("#main");
    $$("img", main3).forEach((img) => {
      const loaded = () => {
        const cover = img.closest(".case-card .cover");
        if (cover && img.naturalWidth > 0)
          cover.style.aspectRatio = String(
            Math.max(0.5, Math.min(1.9, img.naturalWidth / img.naturalHeight))
          );
        layout();
      };
      const failed = () => {
        img.classList.add("broken");
        img.alt = "原站预览暂不可用";
      };
      img.addEventListener("error", failed);
      img.addEventListener("load", loaded);
      if (img.complete) {
        if (img.naturalWidth > 0) loaded();
        else failed();
      }
    });
    $$("video", main3).forEach((video) => {
      const failed = () => {
        const notice = document.querySelector(".video-error");
        if (notice) notice.hidden = false;
      };
      video.addEventListener("error", failed);
      video.querySelector("source")?.addEventListener("error", failed);
    });
  }
  function openWebPreview(c) {
    if (!c.preview) return;
    $("#detail-visual").innerHTML = '<iframe src="' + safe(c.preview) + '" title="' + esc(c.title) + '交互预览" sandbox="allow-scripts"></iframe>';
  }
  function toggleMotionPreview(c, button) {
    if (!c.motion_preview) return;
    const on = button.getAttribute("aria-pressed") === "true";
    $("#detail-visual").innerHTML = '<img src="' + safe(on ? c.cover : c.motion_preview) + '" alt="' + esc(on ? "作者输入图" : "官方动态输出示例") + '">';
    button.setAttribute("aria-pressed", String(!on));
    button.textContent = on ? "播放官方动态 WEBP 预览 ▶" : "停止动态预览 ■";
    bindMedia();
  }

  // src/data.ts
  var cases = window.CASES;
  var skills = window.SOURCE_SKILLS;
  var collectedDate = new Date(
    window.CATALOG_META.retrieved_at
  ).toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });

  // src/domain/catalog.ts
  var names = {
    all: "全部",
    image: "图片",
    motion: "视频·动效",
    web: "网页·交互"
  };
  var accessNames = {
    skill: "有原 Skill",
    project: "有项目文件",
    workflow: "有工作流",
    code: "有网页代码",
    reference: "仅参考"
  };
  function selectCases(cases2, skills2, route2) {
    return cases2.filter(
      (c) => !c.archived && (route2.media === "all" || c.media === route2.media) && (route2.tool === "all" || c.tool === route2.tool) && (route2.access === "all" || c.access === route2.access || route2.access === "skill" && c.skill_ids.length > 0) && (!route2.q || [
        c.title,
        c.english,
        c.tag,
        c.author,
        c.delivery,
        c.summary,
        names[c.media],
        ...c.skill_ids.map(
          (id) => skills2.find((s) => s.id === id)?.label || ""
        )
      ].join(" ").toLowerCase().includes(route2.q.toLowerCase()))
    );
  }
  function statistics(cases2, skills2) {
    const visible = cases2.filter((c) => !c.archived);
    const repositories = new Set(
      visible.flatMap(
        (c) => c.origin === "external" ? [new URL(c.source_url).pathname.split("/").slice(1, 3).join("/")] : []
      )
    );
    return {
      image: visible.filter((c) => c.media === "image").length,
      motion: visible.filter((c) => c.media === "motion").length,
      external: visible.filter((c) => c.origin === "external").length,
      repositories: repositories.size,
      skills: skills2.length,
      videos: visible.filter((c) => c.video).length,
      workflows: visible.filter((c) => c.access === "workflow").length,
      local: visible.filter((c) => c.origin === "local").length
    };
  }
  function record(c) {
    return {
      id: c.id,
      title: c.title,
      media: c.media,
      author: c.author,
      source: c.origin === "external" ? c.source_url : c.source,
      commit: c.origin === "external" ? c.source_commit : null,
      verification: c.verification,
      completeness: c.completeness,
      resources: c.resources,
      rights: c.rights
    };
  }

  // src/ui/views.ts
  var main = $("#main");
  var stats = statistics(cases, skills);
  function nav(route2) {
    const items = [
      ["发现", "#discover", "all"],
      ["图片", "#discover?media=image", "image"],
      ["视频·动效", "#discover?media=motion", "motion"],
      ["网页·交互", "#discover?media=web", "web"],
      ["Skills与工作流", "#methods", "methods"]
    ];
    $("#nav").innerHTML = items.map(
      ([n, u, m]) => '<a href="' + u + '" ' + (route2.page === "discover" && route2.media === m || route2.page === "methods" && m === "methods" ? 'class="active" aria-current="page"' : "") + ">" + n + "</a>"
    ).join("");
  }
  function card(c) {
    return '<article class="case-card" data-case="' + c.id + '"><a class="cover" href="#effect/' + c.id + '" style="aspect-ratio:' + c.ratio + '"><span class="cover-fallback">原站预览暂不可用<br>点击查看来源与制作资料</span><img src="' + safe(c.cover) + '" alt="' + esc(c.title + " · " + c.cover_role) + '" referrerpolicy="no-referrer"><span class="card-type">' + names[c.media] + "</span>" + (c.video || c.motion_preview ? '<span class="video-play">▶ ' + esc(c.duration) + "</span>" : "") + '</a><button class="card-save" data-save="' + c.id + '" aria-pressed="false">+</button><div class="card-info"><a href="#effect/' + c.id + '"><span class="card-arrow">↗</span><h2>' + esc(c.title) + '</h2></a><div class="card-source">' + (c.origin === "external" ? external(c.source_url, c.author + " ↗") : esc(c.author)) + '</div><p class="delivery-label">' + esc(c.delivery) + '</p><span class="case-status">' + esc(
      c.motion_preview ? "封面为输入图 · 官方工作流" : c.origin === "external" ? "作者示例 · 未复跑" : "本站网页示例"
    ) + "</span></div></article>";
  }
  function gallery(route2) {
    const list = selectCases(cases, skills, route2);
    main.innerHTML = '<section class="hero"><div><div class="eyebrow">GOOD WORK. TRACEABLE ORIGINS.</div><h1>找到好作品，<br><span class="line-two">也找到它的源头。</span></h1></div><div class="hero-aside"><p>图片与视频的公开案例，<br>连同原作者、Skill 和工作流一起收藏。</p><form class="search" id="search-form"><span aria-hidden="true">⌕</span><input aria-label="搜索案例、作者或Skill" name="q" placeholder="搜索效果、作者或 Skill" value="' + esc(route2.q) + '"><button aria-label="搜索">↗</button></form></div></section><div class="collection-ribbon"><span class="ribbon-index">SOURCE COLLECTION / 01</span><strong>' + stats.image + " 个图片案例 · " + stats.motion + " 个视频/动效案例 · " + stats.repositories + ' 个来源仓库</strong><div class="ribbon-tags"><span>作者来源</span><span>真实文件</span></div></div><div class="toolbar"><div class="tabs" aria-label="按媒介筛选">' + Object.entries(names).map(
      ([k, n]) => '<button data-media="' + k + '" class="' + (route2.media === k ? "active" : "") + '" aria-pressed="' + (route2.media === k) + '">' + n + "</button>"
    ).join("") + '</div><div class="toolbar-right"><span>' + list.length + ' 个案例</span><button id="open-filters" class="filter-button">筛选 ≡</button></div></div><div class="active-filters">' + (route2.q ? '<button data-clear="q">' + esc(route2.q) + " ×</button>" : "") + (route2.tool !== "all" ? '<button data-clear="tool">' + esc(route2.tool) + " ×</button>" : "") + (route2.access !== "all" ? '<button data-clear="access">' + accessNames[route2.access] + " ×</button>" : "") + '</div><div class="gallery" aria-label="创作画廊">' + (list.length ? list.map(card).join("") : '<div class="empty-state"><h2>暂时没有匹配的案例</h2><p>试试其他关键词，或撤销一项筛选。</p><a class="secondary" href="#discover">清除筛选</a></div>') + '</div><div class="lower-note"><strong>从原作到原文件，每一步都能追溯。</strong><span>外部示例未在本站复跑 · 封面随站加载 · 视频原站播放 · 收录日期 ' + collectedDate + "</span></div>";
  }
  function preview(c) {
    if (c.video)
      return '<video controls playsinline preload="metadata" poster="' + safe(c.cover) + '" aria-label="' + esc(c.title) + '视频预览"><source src="' + safe(c.video) + '" type="video/mp4"></video><p class="video-error" hidden>原站视频暂不可用。可从下方作者链接查看。</p>';
    return '<img src="' + safe(c.cover) + '" alt="' + esc(c.title + " · " + c.cover_role) + '" referrerpolicy="no-referrer">';
  }
  function detail(route2, lastDiscover2) {
    const c = cases.find((c2) => c2.id === route2.id);
    if (!c) return missing();
    const out = c.origin === "external";
    let action = c.archived ? '<a class="primary" href="#discover?media=' + c.media + '">查看有来源的新案例 ↗</a>' : out ? external(c.primary_url, c.primary_label, "primary") : '<a class="primary" href="' + safe(c.preview) + '" download="' + c.id + '-example.html">获取网页示例代码 ↓</a>';
    main.innerHTML = '<div class="crumb"><a href="' + esc(lastDiscover2) + '">← 返回画廊</a><span>/</span><span>' + names[c.media] + "</span><span>/</span><span>" + esc(c.tag) + "</span></div>" + (c.archived ? '<p class="archive-notice">这项旧布局参考已移出精选。它没有可追溯的原始制作链，原来的画面拆解已撤下。</p>' : "") + '<section class="detail-grid"><div><div class="detail-visual" id="detail-visual">' + preview(c) + "</div>" + (c.motion_preview ? '<button id="load-motion" class="preview-open" aria-pressed="false">播放官方动态 WEBP 预览 ▶</button>' : c.preview ? '<button class="preview-open" id="launch-preview">打开网页交互预览 ↗</button>' : "") + '<div class="visual-caption"><span>' + esc(c.cover_role) + "</span><span>" + esc(c.author) + '</span></div></div><div class="detail-info"><div class="eyebrow">' + names[c.media] + " / " + esc(c.tag) + "</div><h1>" + esc(c.title) + '</h1><span class="badge">' + esc(c.verification) + '</span><p class="summary">' + esc(c.summary) + '</p><dl class="specs"><div><dt>来源</dt><dd>' + (out ? external(c.source_url, c.author + " ↗") : esc(c.author)) + "</dd></div><div><dt>能取得</dt><dd>" + esc(c.delivery) + "</dd></div><div><dt>需要准备</dt><dd>" + esc(c.input) + "</dd></div>" + (out ? "<div><dt>模型 / 工具</dt><dd>" + esc(c.model) + "</dd></div>" : "") + '</dl><div class="detail-actions">' + action + '<button class="secondary" data-save="' + c.id + '">收藏 +</button></div><p class="action-note">' + (out ? "打开作者原始资料；当前页面不会安装 Skill 或调用生成服务。" : c.archived ? "保留旧链接，不再用拆解文字替代制作文件。" : "HTML/CSS 示例，可本地打开。") + '</p></div></section><section class="detail-bottom"><div><h2 class="section-title">' + (out ? "作者实际提供的制作资料" : "本地示例文件") + "</h2>" + (out ? c.resources.map(
      (r, i) => '<div class="resource-row"><span>' + String(i + 1).padStart(2, "0") + "</span><div>" + external(r.url, r.label + " ↗") + "<small>" + esc(new URL(r.url).hostname) + " · " + esc(r.type) + "</small></div></div>"
    ).join("") : c.preview ? '<div class="resource-row"><span>01</span><div><a href="' + safe(c.preview) + '" download>独立 HTML 示例 ↓</a><small>本地界面研究，尚未验证跨项目接入</small></div></div>' : '<p class="muted">没有对应的原始工程或配方，已停止提供泛化拆解。</p>') + (out && Object.keys(c.configuration).length ? '<div class="source-configuration"><span>原配置选项</span><code>' + esc(JSON.stringify(c.configuration)) + "</code></div>" : "") + '</div><aside class="source-box"><h3>文件齐不齐，能否做同款？</h3><p class="completeness">' + esc(c.completeness) + "</p>" + (out ? "<h3>关联依据</h3><p>" + esc(c.match_evidence) + "</p>" : "") + "<details><summary>来源、版本与使用范围</summary><p>" + esc(c.source) + "</p>" + (out ? "<p>" + external(c.source_file_url, "查看原始记录 ↗") + "</p><p>采集 " + collectedDate + " · 仓库版本 " + esc(c.source_commit.slice(0, 12)) + "</p>" : "") + "<p>" + esc(c.rights) + "</p>" + (out ? "<p>" + external(c.license_url, "仓库许可证 ↗") + "</p>" : "") + "</details>" + (out ? '<button id="export-case" class="secondary">导出案例资料 ↓</button>' : "") + "</aside></section>";
  }
  function savedPage(saved2, storageAvailable2) {
    const ids = Object.keys(saved2);
    main.innerHTML = '<section class="saved-top"><div><div class="eyebrow">YOUR COLLECTION, WITH ITS SOURCES</div><h1>好作品，有据可循。</h1><p>收藏会同时保留作者、原文件链接与备注。</p></div><div class="saved-controls"><a class="secondary" href="#discover">继续发现 ↗</a><button class="primary" id="export-saved" ' + (!ids.length ? "disabled" : "") + '>导出清单 ↓</button></div></section><div class="board-name"><span>我的收藏 / ' + ids.length + '</span><span>仅保存在本浏览器</span></div><section class="saved-items">' + (ids.length ? ids.map((id) => {
      const c = cases.find((c2) => c2.id === id);
      if (!c) return "";
      return '<article class="saved-item"><a href="#effect/' + id + '"><img src="' + safe(c.cover) + '" alt="' + esc(c.title) + '"></a><div><a href="#effect/' + id + '"><h2>' + esc(c.title) + " ↗</h2></a><p>" + esc(c.author + " · " + c.delivery) + '</p><textarea data-note="' + id + '" aria-label="' + esc(c.title) + '的备注" placeholder="想用在什么项目？">' + esc(saved2[id]?.note) + '</textarea><button class="remove-save" data-save="' + id + '">移出收藏</button></div></article>';
    }).join("") : '<div class="empty-state"><h2>收藏下一次想用的作品</h2><p>在画廊点“+”，把来源与文件链接一起保存。</p><a href="#discover" class="primary">去发现 ↗</a></div>') + "</section>" + (!storageAvailable2 ? "<p>浏览器未允许持久保存，请导出清单。</p>" : "");
  }
  function methods() {
    main.innerHTML = '<section class="methods-intro"><div class="eyebrow">SKILLS & WORKFLOWS</div><h1>每个工具，都连着作品。</h1><p>这里收录实际找到文件的 ' + stats.skills + " 个 Skill 与 " + stats.workflows + " 个官方工作流。查看原文件和关联案例；尚未在本站安装或复跑。</p></section>" + skills.map(
      (s) => '<div class="method-row"><div><strong>' + esc(s.label) + '</strong><small class="method-author">' + esc(s.author) + "</small></div><span>" + esc(s.description) + '</span><div class="method-links">' + external(s.url, "打开原 Skill ↗", "secondary") + '<a href="#discover?q=' + encodeURIComponent(s.label) + '">关联案例 ↗</a></div></div>'
    ).join("") + cases.filter((c) => c.access === "workflow").map(
      (c) => '<div class="method-row"><strong>' + esc(c.method_label || c.title) + "</strong><span>" + esc(c.method_summary || c.summary) + '</span><a href="#effect/' + c.id + '" class="secondary">查看工作流案例 ↗</a></div>'
    ).join("");
  }
  function missing() {
    main.innerHTML = '<div class="empty-state"><h1>这个内容暂时不可用</h1><a href="#discover" class="primary">返回画廊</a></div>';
  }

  // src/domain/router.ts
  function parse(hash) {
    const [path = "discover", query = ""] = (hash.slice(1) || "discover").split(
      "?"
    );
    const params = new URLSearchParams(query);
    const allowed = (key, values) => {
      const value = params.get(key);
      return value && values.includes(value) ? value : "all";
    };
    return {
      page: path.startsWith("effect/") ? "effect" : path === "discover" || path === "saved" || path === "methods" ? path : "unknown",
      id: path.split("/")[1],
      media: allowed("media", ["image", "motion", "web"]),
      q: params.get("q") || "",
      tool: allowed("tool", ["agent", "comfy", "browser", "reference"]),
      access: allowed("access", [
        "skill",
        "project",
        "workflow",
        "code",
        "reference"
      ])
    };
  }
  function discoverUrl(route2, changes = {}) {
    const state = { ...route2, ...changes }, params = new URLSearchParams();
    for (const key of ["media", "q", "tool", "access"])
      if (state[key] && state[key] !== "all") params.set(key, state[key]);
    return "#discover" + (params.size ? "?" + params : "");
  }

  // src/domain/collection.ts
  var COLLECTION_KEY = "jixian-visual-saved";
  function loadCollection(storage, validIds) {
    const saved2 = /* @__PURE__ */ Object.create(null), ids = new Set(validIds);
    try {
      const raw = JSON.parse(storage.getItem(COLLECTION_KEY) || "{}");
      if (!raw || typeof raw !== "object" || Array.isArray(raw))
        return { saved: saved2, available: false };
      for (const [id, value] of Object.entries(raw))
        if (ids.has(id) && value && typeof value === "object" && !Array.isArray(value)) {
          const entry = value;
          saved2[id] = {
            note: typeof entry.note === "string" ? entry.note : "",
            savedAt: typeof entry.savedAt === "string" ? entry.savedAt : ""
          };
        }
      return { saved: saved2, available: true };
    } catch {
      return { saved: saved2, available: false };
    }
  }
  function saveCollection(storage, saved2) {
    try {
      storage.setItem(COLLECTION_KEY, JSON.stringify(saved2));
      return true;
    } catch {
      return false;
    }
  }
  var browserStorage = {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value)
  };

  // src/app.ts
  var main2 = $("#main");
  var initial = loadCollection(
    browserStorage,
    cases.map((c) => c.id)
  );
  var saved = initial.saved;
  var storageAvailable = initial.available;
  var route = parse(location.hash);
  var priorHash = "";
  var lastDiscover = "#discover";
  var observer;
  var timer;
  var scrolls = {};
  function notify(text) {
    $("#toast").textContent = text;
    $("#toast").classList.add("show");
    clearTimeout(timer);
    timer = window.setTimeout(() => $("#toast").classList.remove("show"), 2600);
  }
  function persist() {
    storageAvailable = saveCollection(browserStorage, saved);
    if (!storageAvailable) notify("无法保存到浏览器，请导出清单");
  }
  function sync() {
    $("#save-count").textContent = String(Object.keys(saved).length);
    $$("[data-save]").forEach((button) => {
      const c = cases.find((c2) => c2.id === button.dataset.save);
      if (!c) return;
      const on = !!saved[c.id];
      button.setAttribute("aria-pressed", String(on));
      button.textContent = button.classList.contains("card-save") ? on ? "✓" : "+" : button.classList.contains("remove-save") ? "移出收藏" : on ? "已收藏 ✓" : "收藏 +";
      button.setAttribute("aria-label", (on ? "取消收藏：" : "收藏：") + c.title);
    });
  }
  function setTheme(value) {
    const theme = ["light", "dark"].includes(value) ? value : "light";
    document.documentElement.dataset.theme = theme;
    $$("[data-theme-choice]").forEach(
      (button) => button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === theme)
      )
    );
    const url = new URL(location.href);
    url.searchParams.set("theme", theme);
    history.replaceState(null, "", url);
    requestAnimationFrame(layout);
  }
  function render() {
    if (priorHash) {
      scrolls[priorHash] = scrollY;
      if (route.page === "discover") lastDiscover = priorHash;
    }
    route = parse(location.hash);
    nav(route);
    observer?.disconnect();
    $$("video").forEach((video) => video.pause());
    if (route.page === "discover") gallery(route);
    else if (route.page === "effect") detail(route, lastDiscover);
    else if (route.page === "saved") savedPage(saved, storageAvailable);
    else if (route.page === "methods") methods();
    else missing();
    sync();
    bindMedia();
    requestAnimationFrame(() => {
      layout();
      scrollTo(0, scrolls[location.hash] || 0);
    });
    let width = 0;
    observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w !== void 0 && Math.abs(w - width) > 0.5) {
        width = w;
        requestAnimationFrame(layout);
      }
    });
    observer.observe(main2);
    priorHash = location.hash;
    document.title = (route.page === "effect" ? cases.find((c) => c.id === route.id)?.title || "案例" : route.page === "saved" ? "我的收藏" : route.page === "methods" ? "Skills与工作流" : "有来源的创作画廊") + " · 即现";
  }
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.themeChoice) {
      setTheme(button.dataset.themeChoice);
      return;
    }
    if (button.dataset.save) {
      const id = button.dataset.save;
      if (!cases.some((c2) => c2.id === id)) return;
      if (saved[id]) {
        delete saved[id];
        notify("已移出收藏");
      } else {
        saved[id] = { note: "", savedAt: (/* @__PURE__ */ new Date()).toISOString() };
        notify("已收藏作品与来源");
      }
      persist();
      if (route.page === "saved") {
        savedPage(saved, storageAvailable);
        bindMedia();
      }
      sync();
      return;
    }
    if (button.dataset.media) {
      location.hash = discoverUrl(route, { media: button.dataset.media });
      return;
    }
    if (button.dataset.clear) {
      const key = button.dataset.clear;
      if (key === "q" || key === "tool" || key === "access")
        location.hash = discoverUrl(route, { [key]: key === "q" ? "" : "all" });
      return;
    }
    if (button.hasAttribute("data-close-dialog")) {
      button.closest("dialog")?.close();
      return;
    }
    if (["about-demo", "footer-about"].includes(button.id)) {
      $("#info-dialog").showModal();
      return;
    }
    if (button.id === "open-filters") {
      const form = $("#filter-form");
      $("[name=tool]", form).value = route.tool;
      $("[name=access]", form).value = route.access;
      $("#filter-dialog").showModal();
      return;
    }
    if (button.id === "clear-advanced") {
      $("#filter-form").reset();
      return;
    }
    const c = cases.find((c2) => c2.id === route.id);
    if (button.id === "launch-preview" && c) {
      openWebPreview(c);
      button.textContent = "重新加载预览 ↗";
      return;
    }
    if (button.id === "load-motion" && c) {
      toggleMotionPreview(c, button);
      return;
    }
    if (button.id === "export-case" && c) {
      download("jixian-" + c.id + ".json", {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        ...record(c)
      });
      return;
    }
    if (button.id === "export-saved") {
      download("jixian-collection.json", {
        name: "即现 · 我的收藏",
        scope: "仅含来源、文件链接与备注；不包含素材再分发授权",
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        items: Object.entries(saved).flatMap(([id, value]) => {
          const item = cases.find((c2) => c2.id === id);
          return item ? [{ ...record(item), ...value }] : [];
        })
      });
      notify("已导出来源与备注");
    }
  });
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id === "search-form") {
      event.preventDefault();
      location.hash = discoverUrl(route, {
        q: String(new FormData(form).get("q") || "").trim()
      });
    }
    if (form.id === "filter-form") {
      event.preventDefault();
      const data = new FormData(form);
      $("#filter-dialog").close();
      location.hash = discoverUrl(route, {
        tool: String(data.get("tool") || "all"),
        access: String(data.get("access") || "all")
      });
    }
  });
  document.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLTextAreaElement)) return;
    const id = input.dataset.note;
    const entry = id ? saved[id] : void 0;
    if (entry) {
      entry.note = input.value;
      persist();
    }
  });
  document.addEventListener(
    "play",
    (event) => {
      if (event.target instanceof HTMLVideoElement)
        $$("video").forEach((video) => {
          if (video !== event.target) video.pause();
        });
    },
    true
  );
  var stats2 = statistics(cases, skills);
  $("#collection-description").textContent = `本轮收录${stats2.image}个图片样张、${stats2.videos}段MP4视频和${stats2.workflows}个图生视频工作流，来自${stats2.repositories}个公开来源仓库。另保留${stats2.local}项本站网页示例。`;
  window.addEventListener("hashchange", render);
  window.addEventListener("resize", layout);
  if (!location.hash) history.replaceState(null, "", location.href + "#discover");
  setTheme(new URLSearchParams(location.search).get("theme") || "light");
  render();
})();
