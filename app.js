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
    if (gallery2.classList.contains("task-grid")) return;
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
  var boundMedia = /* @__PURE__ */ new WeakSet();
  function bindMedia() {
    const main3 = $("#main");
    $$("img", main3).forEach((img) => {
      if (boundMedia.has(img)) return;
      boundMedia.add(img);
      const loaded = () => {
        const cover = img.closest(".case-card .cover");
        if (cover && !cover.closest(".task-grid") && img.naturalWidth > 0)
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
      if (boundMedia.has(video)) return;
      boundMedia.add(video);
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
    $("#detail-visual").innerHTML = '<iframe src="' + safe(c.preview) + '" title="' + esc(c.title) + '交互预览" sandbox="allow-scripts allow-forms allow-downloads"></iframe>';
  }
  function toggleMotionPreview(c, button) {
    if (!c.motion_preview) return;
    const on = button.getAttribute("aria-pressed") === "true";
    $("#detail-visual").innerHTML = '<img src="' + safe(on ? c.cover : c.motion_preview) + '" alt="' + esc(on ? "作者输入图" : "官方动态输出示例") + '">';
    button.setAttribute("aria-pressed", String(!on));
    button.textContent = on ? "播放官方动态 WEBP 预览 ▶" : "停止动态预览 ■";
    bindMedia();
  }

  // src/domain/tasks.ts
  var tasks = [
    {
      id: "presentation",
      audience: "campus",
      group: "campus",
      label: "PPT 与汇报",
      short: "汇报配图",
      description: "为课程汇报与答辩寻找信息图、插画和演示素材。",
      boundary: "目前提供配图与表达方法，尚无完整可编辑 PPT 模板。",
      icon: "slides"
    },
    {
      id: "poster",
      audience: "campus",
      group: "campus",
      label: "展板与海报",
      short: "展板素材",
      description: "从信息层次与视觉风格开始，组织你的课程和毕设展示。",
      boundary: "目前为插画与信息图素材，完整展板需自行排版。",
      icon: "frame"
    },
    {
      id: "app-design",
      audience: "campus",
      group: "campus",
      label: "APP 与交互设计",
      short: "APP 设计",
      description: "界面、组件规范与可操作原型。",
      boundary: "正在筹备：完整界面、组件状态与可编辑原型。现有网页案例不作为 APP 成品。",
      icon: "phone"
    },
    {
      id: "portfolio",
      audience: "campus",
      group: "campus",
      label: "作品集与展示",
      short: "作品展示",
      description: "用有节奏的网页布局展示项目、作品与设计过程。",
      boundary: "提供独立网页示例，需要替换为你的作品与文字。",
      icon: "grid"
    },
    {
      id: "story",
      audience: "professional",
      group: "creative",
      label: "短剧与叙事",
      short: "叙事镜头",
      description: "探索角色、分镜与镜头运动，积累短片制作方法。",
      boundary: "当前为分镜、单镜头和作者短片示例，不提供完整短剧工程。",
      icon: "film"
    },
    {
      id: "advertising",
      audience: "professional",
      group: "creative",
      label: "广告与产品展示",
      short: "广告视觉",
      description: "寻找商品合成、产品场景与广告镜头的制作资料。",
      boundary: "需要自备有权使用的产品素材；完整广告成片需另行制作。",
      icon: "box"
    },
    {
      id: "brand-content",
      audience: "professional",
      group: "creative",
      label: "品牌与内容制作",
      short: "内容配图",
      description: "从文章配图、信息表达，到品牌宣传网页。",
      boundary: "按案例取得插画方法、作者资料或网页代码。",
      icon: "pen"
    },
    {
      id: "enterprise",
      audience: "professional",
      group: "enterprise",
      label: "企业协作与批量制作",
      short: "企业工作流",
      description: "面向团队的批量适配、协作与审核任务。",
      boundary: "正在筹备：需补齐真实的输入、批量处理、审核和输出案例，尚未开放企业自动化服务。",
      icon: "layers"
    }
  ];
  var taskIds = tasks.map((t) => t.id);
  var findTask = (id) => tasks.find((t) => t.id === id);
  var audienceNames = {
    all: "全部场景",
    campus: "校园创作",
    professional: "职业创作"
  };

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
    const audience = allowed("audience", ["campus", "professional"]);
    const task = allowed("task", taskIds);
    return {
      page: path.startsWith("effect/") ? "effect" : path === "discover" || path === "saved" || path === "methods" ? path : "unknown",
      id: path.split("/")[1],
      audience,
      task: audience !== "all" && findTask(task)?.audience !== audience ? "all" : task,
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
    if (changes.audience && changes.task === void 0 && findTask(state.task)?.audience !== changes.audience)
      state.task = "all";
    for (const key of [
      "media",
      "q",
      "tool",
      "access",
      "audience",
      "task"
    ])
      if (state[key] && state[key] !== "all") params.set(key, state[key]);
    return "#discover" + (params.size ? "?" + params : "");
  }

  // src/ui/icons.ts
  var paths = {
    slides: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4m-4 0h8M7 9h10M7 12h6"/>',
    frame: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 10h8M8 14h3m-3 3h8"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M7 4v4m5-4v4m5-4v4m-7 3 5 3-5 3z"/>',
    box: '<path d="m12 3 9 5v9l-9 5-9-5V8zm-9 5 9 5 9-5M12 13v9M8 5l9 5"/>',
    pen: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14zM4 14l5 5"/>',
    layers: '<path d="m12 3 10 5-10 5L2 8zm-10 9 10 5 10-5M2 17l10 5 10-5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>'
  };
  function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  }

  // src/ui/discovery.ts
  function updateDiscovery(main3, markup) {
    const template = document.createElement("template");
    template.innerHTML = markup;
    const next = template.content;
    if (!main3.querySelector(".discovery-layout")) {
      main3.replaceChildren(next);
      return;
    }
    for (const button of main3.querySelectorAll("[data-audience]")) {
      const replacement = next.querySelector(
        `[data-audience="${button.dataset.audience}"]`
      );
      button.setAttribute(
        "aria-pressed",
        replacement?.getAttribute("aria-pressed") || "false"
      );
    }
    for (const link of main3.querySelectorAll("[data-quick-task]")) {
      const updated = next.querySelector(
        `[data-quick-task="${link.dataset.quickTask}"]`
      );
      if (updated?.hasAttribute("aria-current"))
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    const sidebar = main3.querySelector(".task-sidebar");
    const nextSidebar = next.querySelector(".task-sidebar");
    const links = [
      ...sidebar.querySelectorAll(".task-option")
    ];
    const nextLinks = [
      ...nextSidebar.querySelectorAll(".task-option")
    ];
    if (links.length === nextLinks.length && links.every((link, i) => link.textContent === nextLinks[i]?.textContent)) {
      links.forEach((link, i) => {
        const updated = nextLinks[i];
        link.setAttribute("href", updated.getAttribute("href") || "#discover");
        link.className = updated.className;
        if (updated.hasAttribute("aria-current"))
          link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    } else {
      sidebar.replaceChildren(...nextSidebar.childNodes);
      sidebar.scrollLeft = 0;
      sidebar.scrollTop = 0;
    }
    for (const selector of [".result-intro", ".active-filters"]) {
      const current2 = main3.querySelector(selector);
      const replacement = next.querySelector(selector);
      if (current2.innerHTML !== replacement.innerHTML)
        current2.replaceChildren(...replacement.childNodes);
    }
    const input = main3.querySelector("input[name=q]");
    const value = next.querySelector("input[name=q]").value;
    if (input.value !== value) input.value = value;
    for (const button of main3.querySelectorAll("[data-media]")) {
      const updated = next.querySelector(
        `[data-media="${button.dataset.media}"]`
      );
      button.className = updated.className;
      button.setAttribute(
        "aria-pressed",
        updated.getAttribute("aria-pressed") || "false"
      );
    }
    const grid = main3.querySelector(".task-grid");
    const nextGrid = next.querySelector(".task-grid");
    const existing = new Map(
      [...grid.querySelectorAll("[data-case]")].map((card2) => [
        card2.dataset.case,
        card2
      ])
    );
    const wanted = [...nextGrid.children].map(
      (node) => node instanceof HTMLElement ? existing.get(node.dataset.case) || node : node
    );
    let cursor = grid.firstElementChild;
    for (const node of wanted) {
      if (node === cursor) cursor = cursor.nextElementSibling;
      else grid.insertBefore(node, cursor);
    }
    while (cursor) {
      const following = cursor.nextElementSibling;
      cursor.remove();
      cursor = following;
    }
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
      (c) => !c.archived && (route2.audience === "all" || c.task_ids.some((id) => findTask(id)?.audience === route2.audience)) && (route2.task === "all" || c.task_ids.some((id) => id === route2.task)) && (route2.media === "all" || c.media === route2.media) && (route2.tool === "all" || c.tool === route2.tool) && (route2.access === "all" || c.access === route2.access || route2.access === "skill" && c.skill_ids.length > 0) && (!route2.q || [
        c.title,
        c.english,
        c.tag,
        c.author,
        c.delivery,
        c.summary,
        names[c.media],
        ...c.task_ids.map((id) => findTask(id)?.label || ""),
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
      ["发现案例", "#discover", "all"],
      ["工具与方法", "#methods", "methods"]
    ];
    $("#nav").innerHTML = items.map(
      ([n, u, m]) => '<a href="' + u + '" ' + (route2.page === "discover" && m === "all" || route2.page === "methods" && m === "methods" ? 'class="active" aria-current="page"' : "") + ">" + n + "</a>"
    ).join("");
  }
  function card(c, index = 0) {
    return '<article class="case-card" data-case="' + c.id + '"><a class="cover" href="#effect/' + c.id + '" style="aspect-ratio:4/3"><span class="cover-fallback">原站预览暂不可用<br>点击查看来源与制作资料</span><img src="' + safe(c.cover) + '" alt="' + esc(c.title + " · " + c.cover_role) + '" loading="' + (index < 6 ? "eager" : "lazy") + '" decoding="async" referrerpolicy="no-referrer"><span class="card-type">' + names[c.media] + "</span>" + (c.video || c.motion_preview ? '<span class="video-play">▶ ' + esc(c.duration) + "</span>" : "") + '</a><button class="card-save" data-save="' + c.id + '" aria-pressed="false">+</button><div class="card-info"><a href="#effect/' + c.id + '"><span class="card-arrow">↗</span><h2>' + esc(c.title) + '</h2></a><div class="card-source">' + (c.origin === "external" ? external(c.source_url, c.author + " ↗") : esc(c.author)) + '</div><p class="delivery-label">' + esc(c.delivery) + '</p><span class="case-status">' + esc(
      {
        author_example: "作者示例 · 未复跑",
        files_complete: "资料齐备 · 未复跑",
        reproduced: "本站复跑通过",
        adapted: "已完成改编验证",
        local_example: "本站网页示例"
      }[c.verification_state]
    ) + '</span><div class="task-tags">' + c.task_ids.slice(0, 2).map(
      (id) => `<a href="#discover?task=${id}">${esc(findTask(id)?.short || id)}</a>`
    ).join("") + "</div></div></article>";
  }
  function gallery(route2) {
    const list = selectCases(cases, skills, route2).sort(
      (a, b) => Number(b.id === "campus-project") - Number(a.id === "campus-project")
    );
    const task = findTask(route2.task);
    const availableTasks = tasks.filter(
      (t) => route2.audience === "all" || t.audience === route2.audience
    );
    const countFor = (id) => cases.filter((c) => !c.archived && c.task_ids.some((t) => t === id)).length;
    const taskLink = (id) => discoverUrl(route2, {
      task: id,
      media: "all",
      q: "",
      tool: "all",
      access: "all"
    });
    const filters = ["q", "tool", "access"].filter(
      (key) => route2[key] && route2[key] !== "all"
    );
    const tools = {
      agent: "Agent / Skills",
      comfy: "ComfyUI",
      browser: "浏览器",
      reference: "仅参考"
    };
    const taskCount = task ? countFor(task.id) : cases.filter(
      (c) => route2.audience === "all" || c.task_ids.some((id) => findTask(id)?.audience === route2.audience)
    ).length;
    const markup = `
    <section class="task-hero hero-scene" aria-label="即现创作画廊介绍">
      <div class="hero-stage">
        <div class="hero-light" aria-hidden="true"></div><div class="hero-fallback" aria-hidden="true"></div>
        <canvas id="hero-ribbon" aria-hidden="true"></canvas>
        <div class="hero-message hero-message-first"><p>每一个灵感，都值得</p><h1>即刻呈现<span>。</span></h1></div>
        <div class="hero-message hero-message-next" aria-hidden="true"><p>从看见，到做出</p><div class="hero-large">成为你的作品<span>。</span></div></div>
        <div class="hero-bottom"><p>从课程汇报、毕设展板，到广告短片。<br>找到好作品，也找到它的制作资料。</p><button class="hero-explore" id="explore-gallery">探索创作案例 <span aria-hidden="true">↗</span></button></div>
        <div class="hero-scroll" aria-hidden="true"><span>向下探索</span><i></i></div>
      </div>
    </section>
    <section class="quick-tasks" aria-label="从创作任务开始"><div><span class="eyebrow">CHOOSE YOUR TASK</span><h2>今天，你想做什么？</h2><p>从真实任务出发，查看案例和可取用的资料。</p></div><div class="quick-task-list"><a data-quick-task="presentation" ${route2.task === "presentation" ? 'aria-current="page"' : ""} href="#discover?audience=campus&amp;task=presentation">${icon("slides")}<span>课程汇报</span>${icon("arrow")}</a><a data-quick-task="poster" ${route2.task === "poster" ? 'aria-current="page"' : ""} href="#discover?audience=campus&amp;task=poster">${icon("frame")}<span>展板与海报</span>${icon("arrow")}</a><a data-quick-task="advertising" ${route2.task === "advertising" ? 'aria-current="page"' : ""} href="#discover?audience=professional&amp;task=advertising">${icon("box")}<span>广告与产品</span>${icon("arrow")}</a><a data-quick-task="story" ${route2.task === "story" ? 'aria-current="page"' : ""} href="#discover?audience=professional&amp;task=story">${icon("film")}<span>短剧与叙事</span>${icon("arrow")}</a></div></section>
    <section class="scene-switch" aria-label="选择创作场景">
      <button class="scene scene-all" data-audience="all" aria-pressed="${route2.audience === "all"}">${icon("grid")}<span><strong>全部场景</strong><small>自由探索</small></span></button>
      <button class="scene scene-campus" data-audience="campus" aria-pressed="${route2.audience === "campus"}">${icon("slides")}<span><strong>校园创作</strong><small>课程作业 · 毕设 · 作品集</small></span>${icon("arrow")}</button>
      <button class="scene scene-professional" data-audience="professional" aria-pressed="${route2.audience === "professional"}">${icon("layers")}<span><strong>职业创作</strong><small>个人创作者 · 工作室 · 企业团队</small></span>${icon("arrow")}</button>
    </section>
    <section class="discovery-layout">
      <aside class="task-sidebar" aria-label="按创作任务浏览"><div class="sidebar-label">你想做什么？</div>
        <a class="task-option ${route2.task === "all" ? "selected" : ""}" href="${esc(taskLink("all"))}" ${route2.task === "all" ? 'aria-current="page"' : ""}>${icon("grid")}<span>全部任务</span></a>
        ${["campus", "creative", "enterprise"].map((group) => {
      const groupTasks = availableTasks.filter((t) => t.group === group);
      return groupTasks.length ? `<div class="task-group-label">${{ campus: "校园创作", creative: "AI 创作工作流", enterprise: "AI 企业工作流" }[group]}</div>${groupTasks.map((t) => `<a class="task-option ${route2.task === t.id ? "selected" : ""}" href="${esc(taskLink(t.id))}" ${route2.task === t.id ? 'aria-current="page"' : ""}>${icon(t.icon)}<span>${t.label}</span><small>${countFor(t.id) || "筹备"}</small></a>`).join("")}` : "";
    }).join("")}
        <div class="sidebar-note">先看成品，再看资料。<br>同一案例可适合多种任务。</div>
      </aside>
      <div class="results-area">
        <div class="result-intro">
        <div class="result-heading"><div><div class="eyebrow">${esc(audienceNames[route2.audience] || "全部场景")} / ${task ? "任务专题" : "案例精选"}</div><h2>${task ? esc(task.label) : "为下一次创作，找到起点"}</h2></div><span class="result-count">${list.length} 个案例</span></div>
        ${task ? `<p class="task-description">${esc(task.description)}</p><div class="task-boundary">${esc(task.boundary)}</div>` : '<p class="task-description">按用途挑选，按来源取用。任务标签为编辑建议，具体交付请查看详情。</p>'}
        </div><div class="discovery-controls"><form class="search" id="search-form">${icon("search")}<input aria-label="搜索案例、作者或任务" name="q" placeholder="搜索任务、效果或作者" value="${esc(route2.q)}"><button aria-label="搜索">${icon("arrow")}</button></form><button id="open-filters" class="filter-button">工具与资料筛选</button></div>
        <div class="toolbar"><div class="tabs" aria-label="按媒介筛选">${Object.entries(
      names
    ).map(
      ([key, label]) => `<button data-media="${key}" class="${route2.media === key ? "active" : ""}" aria-pressed="${route2.media === key}">${label}</button>`
    ).join("")}</div></div>
        <div class="active-filters">${filters.map((key) => `<button data-clear="${key}">${esc(key === "tool" ? tools[route2[key]] || route2[key] : key === "access" ? accessNames[route2.access] : route2[key])} ×</button>`).join("")}</div>
        <div class="gallery task-grid" aria-label="创作画廊">${list.length ? list.map(card).join("") : `<div class="empty-state"><div class="empty-icon">${icon(task?.icon || "search")}</div><h2>${taskCount === 0 ? "这项任务的案例正在准备中" : "暂时没有匹配的案例"}</h2><p>${taskCount === 0 ? esc(task?.boundary || "") : "试试其他关键词，或撤销筛选条件。"}</p><a class="secondary" href="${esc(taskCount === 0 ? discoverUrl(route2, { task: "all", media: "all", q: "", tool: "all", access: "all" }) : taskLink(route2.task))}">${taskCount === 0 ? "浏览其他任务" : "清除筛选"}</a></div>`}</div>
        <div class="lower-note"><strong>资料可追溯，取用有依据。</strong><span>作者示例与本站复跑分别标注 · 原始资料采集 ${collectedDate}</span></div>
      </div>
    </section>`;
    updateDiscovery(main, markup);
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
    main.innerHTML = '<div class="crumb"><a href="' + esc(lastDiscover2) + '">← 返回画廊</a><span>/</span><span>' + names[c.media] + "</span><span>/</span><span>" + esc(c.tag) + "</span></div>" + (c.archived ? '<p class="archive-notice">这项旧布局参考已移出精选。它没有可追溯的原始制作链，原来的画面拆解已撤下。</p>' : "") + '<section class="detail-grid"><div><div class="detail-visual" id="detail-visual">' + preview(c) + "</div>" + (c.motion_preview ? '<button id="load-motion" class="preview-open" aria-pressed="false">播放官方动态 WEBP 预览 ▶</button>' : c.preview ? '<button class="preview-open" id="launch-preview">打开网页交互预览 ↗</button>' : "") + '<div class="visual-caption"><span>' + esc(c.cover_role) + "</span><span>" + esc(c.author) + '</span></div></div><div class="detail-info"><div class="eyebrow">' + names[c.media] + " / " + esc(c.tag) + "</div><h1>" + esc(c.title) + '</h1><div class="detail-task-links">' + c.task_ids.map(
      (id) => `<a href="#discover?task=${id}">${esc(findTask(id)?.label || id)}</a>`
    ).join("") + '</div><span class="badge">' + esc(c.verification) + '</span><p class="summary">' + esc(c.summary) + '</p><dl class="specs"><div><dt>来源</dt><dd>' + (out ? external(c.source_url, c.author + " ↗") : esc(c.author)) + "</dd></div><div><dt>能取得</dt><dd>" + esc(c.delivery) + "</dd></div><div><dt>需要准备</dt><dd>" + esc(c.input) + "</dd></div>" + (out ? "<div><dt>模型 / 工具</dt><dd>" + esc(c.model) + "</dd></div>" : "") + "<div><dt>当前缺口</dt><dd>" + esc(c.completeness) + "</dd></div><div><dt>使用范围</dt><dd>" + esc(c.rights) + '</dd></div></dl><div class="detail-actions">' + action + '<button class="secondary" data-save="' + c.id + '">收藏 +</button></div><p class="action-note">' + (out ? "打开作者原始资料；当前页面不会安装 Skill 或调用生成服务。" : c.archived ? "保留旧链接，不再用拆解文字替代制作文件。" : "下载独立 HTML 后，可用浏览器打开。部分示例也支持在线预览。") + '</p></div></section><section class="detail-bottom"><div><h2 class="section-title">' + (out ? "作者实际提供的制作资料" : "本地示例文件") + "</h2>" + (out ? c.resources.map(
      (r, i) => '<div class="resource-row"><span>' + String(i + 1).padStart(2, "0") + "</span><div>" + external(r.url, r.label + " ↗") + "<small>" + esc(new URL(r.url).hostname) + " · " + esc(r.type) + "</small></div></div>"
    ).join("") : c.preview ? '<div class="resource-row"><span>01</span><div><a href="' + safe(c.preview) + '" download>独立 HTML 示例 ↓</a><small>本地界面研究，尚未验证跨项目接入</small></div></div>' : '<p class="muted">没有对应的原始工程或配方，已停止提供泛化拆解。</p>') + (!out && c.steps?.length ? '<h2 class="section-title example-steps-title">如何开始</h2>' + c.steps.map(
      (step, index) => '<div class="step"><span>' + String(index + 1).padStart(2, "0") + "</span><p>" + esc(step) + "</p></div>"
    ).join("") : "") + (c.id === "campus-project" ? '<div class="resource-row"><span>02</span><div><a href="examples/jixian-case-study.html" target="_blank" rel="noopener noreferrer">查看用即现项目内容改编的示例 ↗</a><small>由本站实际编辑并导出的 HTML，可继续编辑</small></div></div>' : "") + (out && Object.keys(c.configuration).length ? '<div class="source-configuration"><span>原配置选项</span><code>' + esc(JSON.stringify(c.configuration)) + "</code></div>" : "") + '</div><aside class="source-box"><h3>文件齐不齐，能否做同款？</h3><p class="completeness">' + esc(c.completeness) + "</p>" + (out ? "<h3>关联依据</h3><p>" + esc(c.match_evidence) + "</p>" : "") + "<details><summary>来源、版本与使用范围</summary><p>" + esc(c.source) + "</p>" + (out ? "<p>" + external(c.source_file_url, "查看原始记录 ↗") + "</p><p>采集 " + collectedDate + " · 仓库版本 " + esc(c.source_commit.slice(0, 12)) + "</p>" : "") + "<p>" + esc(c.rights) + "</p>" + (out ? "<p>" + external(c.license_url, "仓库许可证 ↗") + "</p>" : "") + "</details>" + (out ? '<button id="export-case" class="secondary">导出案例资料 ↓</button>' : "") + "</aside></section>";
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

  // src/ui/hero-ribbon.ts
  var current;
  function unmountRibbon() {
    current?.destroy();
    current = void 0;
  }
  function mountRibbon() {
    const canvas = document.querySelector("#hero-ribbon");
    const scene = canvas?.closest(".hero-scene");
    if (!canvas || !scene || current?.canvas === canvas) return;
    unmountRibbon();
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true
    });
    if (!gl) {
      scene.classList.add("hero-no-webgl");
      return;
    }
    const vertex = `
    attribute vec2 aParam;
    uniform float uTime, uProgress, uAspect;
    uniform vec2 uPointer;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vHeight;
    mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
    mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
    mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
    void main(){
      float u=aParam.x; float v=aParam.y;
      float twist=u*.5+.20*sin(u*2.+uTime*.32);
      float r=1.48+v*.48*cos(twist);
      vec3 p=vec3(r*cos(u),r*sin(u),v*.48*sin(twist));
      vec3 n=normalize(vec3(cos(u)*cos(twist),sin(u)*cos(twist),sin(twist)));
      mat3 rot=rz(-.12)*rx(.94+uPointer.y*.10)*ry(.13+uPointer.x*.18+uTime*.065);
      p=rot*p; n=rot*n;
      float zoom=mix(.60,.95,smoothstep(.7,1.2,uAspect))+uProgress*.48;
      float tall=mix(1.4,1.,smoothstep(.7,1.2,uAspect));
      gl_Position=vec4(p.x*zoom/uAspect,p.y*zoom*tall,p.z*.13,1.);
      vUv=vec2(u/6.2831853,(v+1.)*.5);vNormal=n;vHeight=p.y;
    }`;
    const fragment = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying vec2 vUv; varying vec3 vNormal; varying float vHeight;
    void main(){
      vec3 n=normalize(vNormal);
      float light=.30+.62*abs(dot(n,normalize(vec3(-.48,.62,1.))));
      float rim=pow(1.-abs(n.z),2.)*.16;
      float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
      vec3 bronze=mix(vec3(.20,.115,.074),vec3(.75,.51,.33),clamp(light+rim,0.,1.));
      bronze*=mix(.54,1.,smoothstep(-1.4,.65,vHeight));
      vec4 mark=texture2D(uTexture,vUv);
      vec3 ink=vec3(.95,.91,.79)*(.38+.62*light);
      gl_FragColor=vec4(mix(bronze,ink,mark.a*.90)+grain*.032,1.);
    }`;
    function shader(kind, source) {
      const result = gl.createShader(kind);
      if (!result) return null;
      gl.shaderSource(result, source);
      gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
        gl.deleteShader(result);
        return null;
      }
      return result;
    }
    const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      scene.classList.add("hero-no-webgl");
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      scene.classList.add("hero-no-webgl");
      return;
    }
    gl.useProgram(program);
    const points = [], indices = [], segments = 200, strips = 16;
    for (let i = 0; i <= segments; i++)
      for (let j = 0; j <= strips; j++)
        points.push(i / segments * Math.PI * 2, j / strips * 2 - 1);
    for (let i = 0; i < segments; i++)
      for (let j = 0; j < strips; j++) {
        const a = i * (strips + 1) + j, b = a + strips + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const vertices = gl.createBuffer(), elements = gl.createBuffer(), texture = gl.createTexture();
    if (!vertices || !elements || !texture) {
      scene.classList.add("hero-no-webgl");
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, "aParam");
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    const surface = document.createElement("canvas");
    surface.width = 2048;
    surface.height = 256;
    const ctx = surface.getContext("2d");
    if (!ctx) {
      scene.classList.add("hero-no-webgl");
      return;
    }
    const labels = [
      "IDEA",
      "IMAGE",
      "MOTION",
      "WEB",
      "PPT",
      "DESIGN",
      "STORY",
      "CREATE"
    ];
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    labels.forEach((label, i) => {
      const x = i * 256 + 128;
      ctx.save();
      ctx.translate(x, 105);
      ctx.beginPath();
      if (i % 4 === 0) {
        ctx.rect(-38, -38, 76, 76);
        ctx.moveTo(-18, 0);
        ctx.lineTo(18, 0);
        ctx.moveTo(0, -18);
        ctx.lineTo(0, 18);
      } else if (i % 4 === 1) {
        ctx.arc(0, 0, 43, 0, Math.PI * 2);
        ctx.moveTo(-20, 15);
        ctx.lineTo(4, -16);
        ctx.lineTo(26, 15);
      } else if (i % 4 === 2) {
        ctx.moveTo(-38, -38);
        ctx.lineTo(35, 0);
        ctx.lineTo(-38, 38);
        ctx.closePath();
      } else {
        ctx.rect(-44, -33, 88, 66);
        ctx.moveTo(-24, -10);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-24, 10);
        ctx.moveTo(4, 10);
        ctx.lineTo(25, 10);
      }
      ctx.stroke();
      ctx.font = '600 21px Arial, "Microsoft YaHei", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(label, 0, 85);
      ctx.restore();
    });
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0, 0, 0, 0);
    const timeLoc = gl.getUniformLocation(program, "uTime"), progressLoc = gl.getUniformLocation(program, "uProgress"), aspectLoc = gl.getUniformLocation(program, "uAspect"), pointerLoc = gl.getUniformLocation(program, "uPointer");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = 0, time = 0, visible = true, disposed = false, progress = 0, targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
    function resize() {
      const headerOffset = Math.max(
        0,
        Math.min(180, Math.round(scene.getBoundingClientRect().top + scrollY))
      );
      scene.style.setProperty("--hero-header-offset", headerOffset + "px");
      const rect = canvas.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(aspectLoc, rect.width / Math.max(rect.height, 1));
      requestDraw();
    }
    function updateScroll() {
      const r = scene.getBoundingClientRect(), travel = Math.max(
        1,
        scene.offsetHeight - (canvas.parentElement?.clientHeight || innerHeight)
      );
      progress = motion.matches ? 0 : Math.max(0, Math.min(1, -r.top / travel));
      scene.style.setProperty("--hero-progress", String(progress));
      requestDraw();
    }
    function draw(now) {
      frame = 0;
      if (disposed || !visible || document.hidden) {
        last = 0;
        return;
      }
      if (!motion.matches) {
        if (last) time += Math.min((now - last) / 1e3, 0.05);
        last = now;
        pointerX += (targetX - pointerX) * 0.035;
        pointerY += (targetY - pointerY) * 0.035;
      }
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(timeLoc, time);
      gl.uniform1f(progressLoc, progress);
      gl.uniform2f(pointerLoc, pointerX, pointerY);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      if (!motion.matches) frame = requestAnimationFrame(draw);
    }
    function requestDraw() {
      if (!frame && visible && !document.hidden && !disposed)
        frame = requestAnimationFrame(draw);
    }
    function move(e) {
      if (motion.matches || e.pointerType === "touch") return;
      const r = scene.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / innerHeight - 0.5) * 2;
      requestDraw();
    }
    function resetPointer() {
      targetX = 0;
      targetY = 0;
    }
    function visibility() {
      last = 0;
      requestDraw();
    }
    function motionChange() {
      last = 0;
      updateScroll();
      requestDraw();
    }
    const intersection = new IntersectionObserver(
      (entries) => {
        visible = !!entries[0]?.isIntersecting;
        last = 0;
        requestDraw();
      },
      { rootMargin: "100px" }
    );
    const ro = new ResizeObserver(resize);
    intersection.observe(scene);
    ro.observe(canvas);
    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", motionChange);
    resize();
    updateScroll();
    current = {
      canvas,
      destroy: () => {
        disposed = true;
        cancelAnimationFrame(frame);
        intersection.disconnect();
        ro.disconnect();
        scene.removeEventListener("pointermove", move);
        scene.removeEventListener("pointerleave", resetPointer);
        window.removeEventListener("scroll", updateScroll);
        document.removeEventListener("visibilitychange", visibility);
        motion.removeEventListener("change", motionChange);
        gl.deleteBuffer(vertices);
        gl.deleteBuffer(elements);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
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
  var timer;
  var releaseTimer;
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
  function updateStickyOffsets() {
    const height = (selector) => Math.ceil(
      main2.querySelector(selector)?.getBoundingClientRect().height || 0
    );
    const sceneHeight = height(".scene-switch");
    const filterTop = sceneHeight + (innerWidth <= 700 ? height(".task-sidebar") : 0);
    main2.style.setProperty("--scene-height", sceneHeight + "px");
    main2.style.setProperty("--filter-top", filterTop + "px");
    main2.style.setProperty(
      "--media-top",
      filterTop + height(".discovery-controls") + "px"
    );
  }
  function render(mode = "navigation") {
    if (priorHash === location.hash) return;
    const previousY = scrollY;
    const nextRoute = parse(location.hash);
    const filtering = !!priorHash && route.page === "discover" && nextRoute.page === "discover";
    const nextScroll = scrolls[location.hash] || 0;
    if (priorHash) {
      scrolls[priorHash] = previousY;
      if (route.page === "discover") lastDiscover = priorHash;
    }
    clearTimeout(releaseTimer);
    if (filtering) main2.style.minHeight = main2.scrollHeight + "px";
    else main2.style.minHeight = "";
    route = nextRoute;
    if (route.page !== "discover") unmountRibbon();
    if (!filtering) nav(route);
    $$("video").forEach((video) => video.pause());
    if (route.page === "discover") gallery(route);
    else if (route.page === "effect") detail(route, lastDiscover);
    else if (route.page === "saved") savedPage(saved, storageAvailable);
    else if (route.page === "methods") methods();
    else missing();
    sync();
    bindMedia();
    if (route.page === "discover") mountRibbon();
    layout();
    const scenes = main2.querySelector(".scene-switch");
    updateStickyOffsets();
    if (filtering && mode !== "history") {
      const results = main2.querySelector(".results-area");
      const mobileBar = innerWidth <= 700 ? 66 : 0;
      const target = Math.min(
        previousY,
        Math.max(
          0,
          results.getBoundingClientRect().top + scrollY - (scenes?.offsetHeight || 0) - mobileBar - 18
        )
      );
      if (Math.abs(target - scrollY) > 1)
        scrollTo({
          top: target,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
        });
      releaseTimer = window.setTimeout(() => {
        main2.style.minHeight = "";
      }, 1e3);
    } else {
      main2.style.minHeight = "";
      scrollTo({
        top: mode === "history" || route.page === "discover" ? nextScroll : 0,
        behavior: "instant"
      });
    }
    priorHash = location.hash;
    document.title = (route.page === "effect" ? cases.find((c) => c.id === route.id)?.title || "案例" : route.page === "saved" ? "我的收藏" : route.page === "methods" ? "Skills与工作流" : "有来源的创作画廊") + " · 即现";
  }
  function navigate(hash) {
    if (hash === location.hash) return;
    history.pushState(null, "", hash);
    render();
  }
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && anchor.hash !== "#main" && !anchor.target && !anchor.hasAttribute("download") && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      navigate(anchor.hash);
      return;
    }
    const button = event.target.closest("button");
    if (!button) return;
    if (button.id === "explore-gallery") {
      main2.querySelector(".quick-tasks")?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start"
      });
      return;
    }
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
      navigate(discoverUrl(route, { media: button.dataset.media }));
      return;
    }
    if (button.dataset.audience) {
      navigate(
        discoverUrl(route, {
          audience: button.dataset.audience,
          task: "all",
          media: "all",
          tool: "all",
          access: "all",
          q: ""
        })
      );
      return;
    }
    if (button.dataset.clear) {
      const key = button.dataset.clear;
      if (key === "q" || key === "tool" || key === "access")
        navigate(discoverUrl(route, { [key]: key === "q" ? "" : "all" }));
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
      navigate(
        discoverUrl(route, {
          q: String(new FormData(form).get("q") || "").trim()
        })
      );
    }
    if (form.id === "filter-form") {
      event.preventDefault();
      const data = new FormData(form);
      $("#filter-dialog").close();
      navigate(
        discoverUrl(route, {
          tool: String(data.get("tool") || "all"),
          access: String(data.get("access") || "all")
        })
      );
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
  history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => render("history"));
  window.addEventListener("hashchange", () => render("history"));
  window.addEventListener("resize", () => {
    layout();
    updateStickyOffsets();
  });
  if (!location.hash) history.replaceState(null, "", location.href + "#discover");
  setTheme(new URLSearchParams(location.search).get("theme") || "light");
  render("initial");
})();
