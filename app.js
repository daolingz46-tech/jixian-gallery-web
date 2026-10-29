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
      boundary: "现有为开源 App 的官方界面截图与可编译工程，覆盖阅读、电商、社交、数据可视化、响应式与折叠屏适配；尚未提供配套设计稿（Figma / Sketch）与逐屏交互标注。",
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
      boundary: "现有为可自部署的开源产品截图（BI 看板、流程自动化、LLM 编排、低代码内部工具、监控告警），覆盖流程编排与看板搭建；本站不代跑企业批量交付，具体配置需自行搭建。",
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
        <div class="hero-controls"><button id="hero-pause" type="button" aria-pressed="false" aria-label="暂停环面动画"><span aria-hidden="true">Ⅱ</span> 暂停画面</button><details><summary>环面作品来源</summary><div><a href="#effect/source-watercolor">水彩叙事插画</a><a href="#effect/source-wan">图生视频</a><a href="#effect/source-editorial">杂志式信息图</a><a href="#effect/source-flux3-i2v">产品图动画</a><a href="#effect/source-cinematic">电影感画面</a><a href="#effect/source-claymation">黏土风格</a><a href="#effect/campus-project">课程项目展示</a><a href="#effect/source-elegant">优雅风格插画</a></div></details></div>
        <div class="hero-bottom"><p>从课程汇报、毕设展板，到广告短片。<br>找到好作品，也找到它的制作资料。</p><button class="hero-explore" id="explore-gallery">探索创作案例 <span aria-hidden="true">↗</span></button></div>
        <div class="hero-scroll" aria-hidden="true"><span>向下探索</span><i></i></div>
      </div>
    </section>
    <section class="curated" aria-label="热门创作资源推荐">
      <div class="curated-heading"><div><span class="eyebrow">CURATED FOR MAKERS / 01</span><h2>值得动手试的创作工具</h2><p>从灵感到作品，精选社区关注度高、用途明确的公开项目。</p></div><span class="curated-note">GitHub 星标采集于 2026.10.28<br>收录参考资料 · 尚未逐一复跑</span></div>
      <div class="curated-grid">
        <article class="curated-card curated-image"><div class="curated-index"><span>01 / IMAGE & MOTION</span><span>✳</span></div><h3>图片与动效</h3><p>从静态画面到动态影像，探索生成与节点工作流。</p><div class="curated-links"><a href="https://github.com/Comfy-Org/ComfyUI" target="_blank" rel="noopener noreferrer"><strong>ComfyUI</strong><span>143.5k ★ · 可视化生成工作流 ↗</span></a><a href="https://github.com/guoyww/AnimateDiff" target="_blank" rel="noopener noreferrer"><strong>AnimateDiff</strong><span>12.3k ★ · 图像动画研究工具 ↗</span></a></div><small>需安装模型；硬件与模型许可依方案而定。</small></article>
        <article class="curated-card curated-web"><div class="curated-index"><span>02 / WEB INTERACTION</span><span>↗</span></div><h3>网页交互</h3><p>让滚动、切换与视觉反馈自然衔接。</p><div class="curated-links"><a href="https://github.com/motiondivision/motion" target="_blank" rel="noopener noreferrer"><strong>Motion</strong><span>34.6k ★ · JavaScript / React 动画 ↗</span></a><a href="https://github.com/greensock/GSAP" target="_blank" rel="noopener noreferrer"><strong>GSAP</strong><span>29.8k ★ · 时间轴与滚动动画 ↗</span></a></div><small>面向开发者；请查看各项目的最新许可。</small></article>
        <article class="curated-card curated-slides"><div class="curated-index"><span>03 / PRESENTATION</span><span>▦</span></div><h3>课程与汇报</h3><p>把资料整理成有结构、可表达的演示内容。</p><div class="curated-links"><a href="https://github.com/hugohe3/ppt-master" target="_blank" rel="noopener noreferrer"><strong>PPT Master</strong><span>69.6k ★ · AI 辅助制作 PPT ↗</span></a><a href="https://github.com/slidevjs/slidev" target="_blank" rel="noopener noreferrer"><strong>Slidev</strong><span>49.2k ★ · Markdown 幻灯片 ↗</span></a></div><small>需搭建或使用开发工具；输出与 AI 服务依项目配置。</small></article>
        <article class="curated-card curated-story"><div class="curated-index"><span>04 / SHORT VIDEO</span><span>▶</span></div><h3>短剧与短视频</h3><p>了解剧本、分镜、生成与剪辑如何组成流程。</p><div class="curated-links"><a href="https://github.com/chatfire-AI/huobao-drama" target="_blank" rel="noopener noreferrer"><strong>火宝短剧</strong><span>16.7k ★ · 短剧生产流程 ↗</span></a><a href="https://github.com/harry0703/MoneyPrinterTurbo" target="_blank" rel="noopener noreferrer"><strong>MoneyPrinterTurbo</strong><span>135.8k ★ · 短视频工作流 ↗</span></a></div><small>通常需要模型或 API；火宝短剧标注非商业许可，商用前须核实授权。</small></article>
      </div><p class="curated-foot">星标反映社区关注，不代表本站已复现或保证收益。功能、费用与许可请以原项目为准。 <a href="creative-resources.html">查看选用说明与入门路径 ↗</a></p>
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

  // src/ui/ribbon-atlas.ts
  var ribbonAtlas = "data:image/webp;base64,UklGRrJFAQBXRUJQVlA4WAoAAAAgAAAA/wcA/wAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggxEMBAHAPBJ0BKgAIAAE+YSqRRiQioaMpNHyggAwJTdqcUWQv6n67Km47RUHquaY4PaD/m9eXJPwz+Z/n/3g9sLknwI+Yfkf238af9/u3+C/7Pmk+v/z//o/zn5qfMX/of+7/ce87+pf7v2DP5//iPVT/6/Xn5pP7B/vP3W93r/vfuF77P7J6hn89/0P/3/6Pvlf+z//+7r+9PsRfuP///Xx/dn4f/7p/4P3H9rP/3ewB///bn6M/tf/qv756pfln8D/o/8X+3HnT5fPiX79/nf+x/kPczyX9oX2B6nfz38gfyv8b7Tv6j/xf6X8pP2A9u/l9/u/532C/y/+sf8D/B+w1+d+4HgYb7/vP/T/vfYR93fuP/X/zH74/7X4cPsP/L/p/WX9z/1X/f/z/wBf0r+7f9T/I+5X/T8Sz8v/yP/d/pvgE/on+K/7f+h/0f7cfTx/nf/L/d/739x/dt9c//L/df7j5Dv6J/gP/J/mP9X78//590f7sf/r/nfCz+0n/s/2x5kG61yVhElXviphPz5qf/EdaqqlAUAnPiwzaZ3hHIT3GQaHCgXFNPHsXoM3WO11PY1Ds/QzO7uki/gUsC2obdM8G+VM2L51JZIvn3ns8xrAjZIAhvIddbaTXw6ohkEJpnLx40GZp77eCbhqlGXYU/JM5Dnx1hKOLtrvWMp4wO/CKjADZ02r/k5Cxkk812jukRAntHuXNYv3o08H7join/t2aHf+TwntXfudSQbGmHfm2nmMvPNljucrV3ZD1McfoT/kocjJgpYOL6iUcH/BXB7aaqDqeVXzKvQYZ80NN2oHT99Wv3z+uiGKg2QpPZfy4chV1KDpBTSI84fKtDqMMq2aOPPb7fP0kl0KJQP/dLDWnBsLhBnnzANHcquWCcx2VkW9zThTtE6qgaxd+np1Qg5eGtHFJpPcI0+NOwZtdXGF85wRFtTMZCgPgNf8gau0RfQ1wKjGY4zMzasamNBl2rciapagCFbksFSyyLX4KfaYPnBUYzHH2ioVrf/40x4d6w45c/SAkRQwArVi3wIf7BTH3n9hnCCQuhTvp9yHjzxKxrza4rorSJDI14rBxvtEMawEJ8EqMvWLfvn50pMjsM8vR9s8gUyceH6Q18ayYF34gwZ3p+pFLW10ro1kYhVTFWOorbpcTfHTjRo1i7BHtmaJO3Wv0oAzrSz4nt4V0IxsnVXv3CGLatmtj90rzvwhX9cSatNrh72ApKnLLPhBMDQK8zNPgv0iW95NZUU/hFxZmuu2GdNnA314EK16/eSjei7SQm+y2PBIDGYxMGb7hZi2vipqbpqRwMeH/SSflI+muyd751dsrJuNg0ZWwvGhCaZ+imWTLLe5VqtSGHT+bJPg38E6OQWJDCfgEOgXORTxCf/Q+VcjezSbr8vHrvR6xcWUsKlvMrOLQdMFNv0bUe6kZMq7AChGnegRineR27LpgxqY2o4zXah6g/mCRPxG6k84Ybrh9NmGkDh8k+H63iwx53gsmyL2hR7Biwsp2mYJBmJyD3Gy9rAKKlqnq36K+tQJm9ITdtDKJIixbpVOcIhbjvHoa6l9U8ZKeb+mjzCZdAjF4KMNaezT1MyAAG0U/+iY+0T8/L9/HO9MadtfgbYb9jfgl+8PFuuGM/0NndHC/Di9NwZFg8/sUvuUcnBhhgEx6ld79bIq/uhWBdVuNRXm7hakQ+h9fxV+Vqko/ZeoCU/GSH414o/AWCzxLac3cjQ6stiMFpBU8AxeaHQTJfPPNi4ESc8X2W2ayEH+s2hanwP0AEymPA2DLRyQWKqpFymBY0HKfyKzbt+yXdCtbglMiNAXjcLPTLc9h2qoLNrUe+zeU55UpC1eYfLXZ5FHPgTL54IeZQWAnjWee3pDgV+ueKqpGWJAkFYrcJSbFFz5fcZftE0AKoXkKCtTLtXD9OhZQJJicqyeURjKCC/MCArvSL3sSyF8+EHeu5rnu6sRWy+Q/kr0YgrR2QcHAEAGLn7IerHMhxHsV+grUp6DkK0pub7gBkjcHOWoNlwsou9r32/oByC+7ICJDC+Bvqfeu66PmRaKksSMpBM9yxYC9DKosbQ/DpeuiTViSw9e/wqY+zk+qYCQ9SNNGDDCxg0V35Oz9A/BrCWzPd2wRoKJ9fJV15RMscdk8fvRWSUvZhK0pw575qbhTXv0zpphuJRAT/1A4+0U/Hpx+Nn5N//72xmOgE5bTMbHPV6UjnG7aHCIdbpvbd4Eeg4iTq9RgweO3+e0Z4AqlKUhAMjAH9kfxOCHbmgoDEHDmevMjm2kC9+FiYB9LWK2eggVZmLFXd1kA9hM/rIqE1Ur6rEjOP3xvFAoEvwJBfkej2fehA+mgrwTk1N0XhSNmqEnjyeGGh9qmmLzpTQk3+5APGJdjNNXf7euCDJpUu6gnAUb8Jy6mF0d/aiKgVGBfsLam8efF6mw+FyEhYYsWdDUipQrz4pzkLxAOV+eZoDLtnzu6+E4QWPg0qqPR5+rix2l61zDNEhVH760XHKp+B7/plHcRtQL5SWNJssBM0Rr+aRlCOpcgZ5VRQuOsZxqNq0CRgFNQ1YE1J7lcWmSenKcKqbZvuoj+zaQp8Tb0UN3hQ4SXS8WBuDCFB3kGMAwWF0BaFs/cdtlpLjmAG2jvarhMXYXpWSvJUJLM/fbRWmyQWMsYZLyWGfKMrxYVssiG7+6GBCmmxWvNn591mDUI5Y9kWkUBYHWH525RGxrL9EzBBuBPSq+sOriV8yUnhpvti8CMsNrFisBPlL6JSatcoldBqw6g63Je/1mOQDfMwNmPUecsnyzn1tKhZ5eLOFy7fH6tEymsYvBVBcTIhHlDrCNUErSIQsts+gPhmPo04IhpgKpmHV+esmMn20eZg1AhIrKZ6AT/NSACeBD1lNN8KrUZkyUwR03TayNwWNDbKKe3i/MzZVfRkJ1n7FcNddjGLYRQOIOJstkq4FNIcGiA8g/5SDv8XP/R/gfDft1MQsV2QBCxAmap7JkZmsMEFHX10JmOY5DcnNk7zXuma0ldUG7Nf/RDVV1mhMNZcIQNVw/1qvY5CssPG/uMZAODz7E64vQ2rSYoBa0/7fuSJzGVbXLAkxS2N1BkFud75ODI9BbZmPkruYrZfBDSdFnzbhKNSv85WAA9RJXWtB0l0EP/aAgCaFrsG3Q6gZWbfGWj2uuP8RHGWzGeGoEP3xDfab8lQ9uCX+dUo6cbgXuziLBW/ZJva+O+2OfPN4TKMAT9X6lfK0QBUs9Bac+EIDSgSbCMLcQFFbX0oDx7blfcVmLdN7Gz5WgGG1yunGhMpJgPOAyaUrnpy/FOoytor8CreMRfKNfS4G4M6iAzBo/D3H1fECw6hOayDCvDZHHrMjnKjxy9J6e016/x0OO6UZioaGuON2bdt5io7iZK8Khttax1VZkAIABoMBrPZNwWiy/sS0NEqMANn4qmk/acdH/Yjtkx2GP5C/uP5AOVXLlM2bmSR/KSCg8NTKBMddymJMNdCbg/KfuLD0xofN9dLRnQP6WziVucl2RwhAvWU3cjWmfYkEEe1QZZX8zgsu33EOEGOduHbgt3TKKNE2JdZ4n1EFYJ7CaVPBf/8h9TvMa2v5s69BFuYhcGuRKGOcArHTxQli0CPt1FesK1H5lcSA2qV/k3vhqDfKo4CR12/oHrHO9iRxkheeabLticMwgl4nWeFrpgwVf9eKgSXSBtNzsG+6Xh7MrlziBCb+POjg37qX0VIxOAiIZrBD9xwkJdaGezSicyq8m3Kfuopli0aaGvq1eTeBT1i70foGZGLMEipXrSfSvT6VrlFriJ0v/nH1yJaauyROQIigExAkYKI+K2HyTAzpa87GK24Rf1H0vMnQPjMKRYaNn9B/w3U9d/g4al+gDLEocWWppP+l6JEErgOfN9tojoE387at7dvhDZ9ZKwVfSMDI2PFIdbAJyBol+Lz9/ISVKk7ufT+Dz/EetGz4O+9ASyLElsYVNonCNAI8UtwbAECFjVApvOfcectHM5tFVf+AYmfvn94B7lz4Z0tO0yRMbrVoYDarPY/5j3fPLGmidXbfc3POFUtPn3RzqCOWxUsE1J168ENIRQg9wyGiXn2v9QwpisgfTuk87kRQYLxouXQYX20xIpmRMIJ+6EVTxAAKwRqOsnL8UcjXGR86F5PlDSTOW+8/lopmfn+aoGKJNKoMZrJ8VYXexWkGlQs7kBZEBk7lwfTVJgiFcOAt/kMiZ5Z0d0y4dMh5Tj513m2d2/ZK+nUjGk/H+3hWliJD5dGsKHJNM8miGtQsvIuF3v7qSgeHna0jXDZ7zdZrlfDxHb/wmv1bF3OumJOY4FkiYuZwfBMzwt/TIYcDYTSfSHaJ+abQjFw+1cWTShOHvBlwPs0qZ8ddBD3yiLN5FlZnkiEm8I1xcUbHNYrtn9anQWuSfFrpCjaBfPpJ0MRE8G8lB1y6iu4LSX4D07v3K64YKLM1lhCPpFkVr2uKBWn0o+Tl8RyJ8mer1UB23Q83F8Bjue205wa+7c6ncdPmWW9HHRA096VowheLmSkr66HVPO1Wt6sxB40HZVFnFbhrVbD7gS3+v6QtS25zvZJrit+mm+gD9wevKrpzUugYzzjkGcLhlA6eSFq/UoxQgG9jcKcHjt3ubrJR8KoIc19XMCZs9VK+BS6dRumGrHKqU0Hd4HBMnuiKWU5qMIT4aEC0n+G3vC5yj+NE8uCndqvgyxbgU11BSOhgjwP+aIxrTwoTO/u/8XaWx9aiqH0d4Hh89UPvhGAh51EnQJh7P198M36KdWGLmXHp+UCN3tg8iTDTqTL8uZ7TK/1tRqC6OAy8xHCT+QmkjW65c6Zyavk3vk6siOxNR5SuxfAA7GOp4BBueaj1pv4E84rMndsIm5Cuv+STaCnBk7o33vqcunX8FvVupm0f0+w+9ciyHGg9brBaunqcMrNNYWoO7mqXTbl+JKDgvmNbT4RSd5GWY4uxZAy/E3+amFqsB3LpbUDeUxN1lNo1/acM1WwBJbKvbzxAO8g4JAieiKcZOaulEDjAV6rcPT4V4sr9gBQZRj0JOkt/xhzj2ae22DrxgE6VMHNQpuHhPIlhOQapq8+4gsfCT3Kxq59gjHAQtulWKLfDT3/F9HNlkGon90/lQm+RkagUKF1t0iaYbU+gW8SLSaQNWtWiQk3SnMq0ebJTlcC2NNWb5iwy/q+tRgA2OhnXXGrrpPC6YxdZUlSjFouPkncbkd6cUDrKcuABoevEcHE1UnansHJUeMUIpUXX/Dco2FlyiscnCRQ3/pm/9EhS9ksBt66pX/h3nNdCzVkmkfmbArHuseJ0/0kgUC0Kz0VheOREGrOQFkrMvO9sEslok5UST87aBtFV0xST5548zUmvMzoOzL6RQdBjf8YcR/3/e57Yql6EUQRJ+JnUciDQfmFMro0b8UNn1VYEC7JA8OKbDukntPv/f8l1iGzyGTAhOkQSfM4QnLrsEWt+VbCO7TGGLqzLC/oCi0lTysnmwpiGTY+iGqrbtfMHk5V4JTfOYRE5DPJF51NEr/3KfzeKWDBN0KN3TXYA3H3v0ueCRV2b5/09BlrV8elLO+gYyQuDWxbwZ/SO0GXJcm02IyZW/Rx+YXJN9Av5ELKlL37QXSuooC4tcNH5516KPx+JN7aJRBHHcE0qKPIN7AFyiEVasjlnVpeEt5wWXkEAYsCUtpFV8GWkUv8FDCTK0t1TCBRcvxkwky89SxHz9Y9Cewq2xHQwg6VgA7YWrV6YhoTRJfDaPGkQ0F+WAAtQT2lfXAjVqti7LQO9Bn84vGRIQOFm/sCSMh+NaKAUcBXwbQvg1WX9ZpAaqA7wD9Rb6PjuH34hmgI4cHpw4ZFHmgG4IM3enmweGBaN6t0gRbpr/Tao0xUFZ314xQUyQK6kaNo3R900Ig0SZDdUaaAQ0+wxioJf1uwY8D2Y9UUYF7SNvCWKdBc4qcgaIszc9ds4nOESBpNtTdwkQ9PE+qrnf+WwyZoI7NNaaBqs71alLxJKf98IMPSEFGwzIkuvwvkwWX2jUFgWOgjSI03234e5q4Fu/6hFTNjU/j6RtVseA2QSvwEunkI2gvAc1TK7oRypYapXhGLN1P/d8IJCx8I6tQYZLsCJCvEHebiAvWOb8IFLhyCo3+WUF+v9VpcB1wPp/gf/xZ+A/9GDNw/Sr9JqQzgvdnbgB/q4Y1xamPAOitHxjqmUtAyMuD17J7xEokBMQxACQ2zb/3HL8UACwJFAOXMU6FEen5DfTAPAY9yW3/rPstimYVml28DFsgfHqWlY5ZvvAu+iXOSjSYrhVK7QVCgzqCIPQWU3m6gbjuVZ4xVmGqljj0WW/tWcCbUYjxbeEDZpoTGvI0F11jo3e0fq0Wvnz6JQGdgR25k78wU36dg8Nv14hmm16qhtWxH9aUbxmCE0eAeurchLv+T1x08mHvzTfOY5SIg93fnz0n6/4XaLtLg13aKIc9wKkz2LwA028jYSyC52ukPeofXWsZe3TnUDEZpogxu1z6RmVaygdnY7xpQYd5BstELgs0VUtDzW998oZgM5Fsqwa/0ck6Xu5hZ7m22exrEOJAJ/P0wqEJx0783uqZr75GOISGiOflE7KFKY4Sqk0g++iPfe7dXL7CQhMupzQdzskV+gwjx7qOLe3yykQ+3klhrNiL2PNalQUqIXJKmWmRxh2kGyfi0KzkbE1KWSrX/BBIK6PJ/M3EIvFY3p58YdYqki6eCkV/KDe7lzpjoQde1T+dtNIYgJKPOzoUYp3j11Tf65hm/17dH1ck2pobC7G70/skror2kcdvs10owUoc2psVgbJUvuGzhrHKH2tBeKHav8PQrRmV6QJugL5Zsnmekk6SNj4gAqkgx53wVwaHknxdtGXTfppNKrHKQCTEHb0szQVZSi1uCLZXJ8CZ4SgbE/TxAlTp/unxM10btbpSa2PyZ/tekiiooS1M+U9xdd4fN3ne5O3ihQZgq2nVPTN/X66s2aw5twS9E9xJhwsC4s7SYQrfTwwn8Qd964mz1TgHLFrhETvLdpj0/tKSssHcZMI6fHVPWkOUSEme1FQBVETbjaLSWQYgO0e9/H4mVR+bfKtOiHFMDscnL7wDsB3r4fvsJICKYGAnpdY5xx6HVmF60L7WuBSAZb2S9XozuyY2IjV9PMcb1f3kXqIROLXYrj00NuqP6Y/iseOLzBDnRXUzxn+fewLSfNTyBswQc9UiJZEHhpa8amsAiCAL/EImjkwsojv2UkuaXgS8fT1XYvYpUGrdTWEn0hz0g9hgsgp/TadFE5bHAL3S4wtM31Tw5APVAeJIkUZIQvZyQo3YG3JqWp/ESoA1CSpmA82NWb/DRY0f+tMH/w3Bf/4SbyUtpOC/Yejf/RZ+6Gu5m9rMwPk2/93+Rj4tbyX9WOHbvBohmarlJCbVgPOkQP+fCecWmhXU+j16rIxekvkhA/t6VsF5/yJw/tLMODRZPnsS59AEuZqiYrIlP3VNanKCPJ5ORtxy73AfG5iYMquVRUdP2Qyq+dNeCt/F9E1hdEKwam/i+qHi5dxaeP6/fsMY4G+qALFBqC942e0UbElfI3ocFHHXDYbRnBEZWGGPVE/hue1UOA1MPWkqJcmnQFmraDLtsHLgo8dpUxKNNy7dqX8tJ+iW8pSZWGKWnAaaEMrMrpZTw92E2cZtlXay0Yc/FbUKinTEywikIv4DFMHrHe6HqzA0z7I5Rm6uXJ95B2dd22wxI/zTnNM4MMygtWuW1uK8mt9iSMxLJhjX8ebdIed0GdkK+qGv3xC20BUs3T3WamIP5GDmHcwZnf1RyGweSka9MrG53eiMv0zarbJE+kLhKas7CoivSBhlOYLYVULpRTFb/2k/YvgPWZ9gkGoNMYwSDUmIcx9gzTkKwRGLi1+02ZkzZUEJvykPUMKd3fc5AMz1NrLwJbs0u5vJQ/hTfOUAKnOKEvii/8kN+NSzpSAcD/Jds4qnsi5G65a+rW/RKZ630G+dr29DUB+hLQUwxdxycljrsHPEwUGsvgIufUNnxfwNG+tHyGykZ32e8sV/ltwQti47+6Ld3kfwyPtk3RRcTLecOyoNJ9rAFY0EHTUPNeifJ4jUb2RUXLNUcCv8VbE6QkS2ejlG40IHdWYmDT9sQP4Q151GfiDWZvoguc2W66bQY4aZgRzOXzIeIoRAZEe9zSVWRPml++3bzDy57hKmGnZVsKfLiJo3C95arjq147ZY7daQWGXKpBLpA60fL/LFM57/Wb5epm4MBVcGaZQdz+iIjPQ/OQstkpoINtvVdlu096k4Hc4S8ldNJJ0O4opC2Lghe+DeZY6XJzZQySZo1tzb0tRzyY7/zmyuoi8g4czO5SOnlErIqcUsU1voR7+Ww0jVXZ8ll0MVBsIKDf5eHxg3HWW/LCaF6nWmNw/oYZjd5tQYeNDzQ7oyvuEzfs5tx459Ed9RPSrEDm3jwWiqUaQ39cqZ2IONs7MqT1ObFRJ+EPP10UDDLet7n4NlKp/g+u1kbSaqzCVzlGl5UWHOvLoEYszyzn5py+jGHQazUx8VAFNwRFyGU1USNWJujWnTr/XghM3BmLK5nW53Huhrk+Ej96zTtjneRMJ7i1BgpUttoPmcJzb+triBoi2cDGARnVuTGDfXG+UsM/3UxV5B5wu0a9zY0B4AE3ro6B+z6GLdZOBp5CugLsAo/SjaSeXcwVa7TtyNToOafGe+LtIwkJWHscEY2vDybVaFcBe0PbbilTj8W+vYKwK/0n3kEriGHslrN0D9hwI5PRJuEgCdYqZR3Ph4vUdMnVE0wnDmLU38GaSzK8jwhR8j5wcEK0cJv3M3I9fx0zht0azS8rYp0FOnANrc0p0OTN7HU2W/FZmkidEiHxcY0nodGp191j1U94/X1P98RgKLkSCO2lzpQ6uiPx/CUVogs/b/h/dx2i+aPp7DVF5jQZnJxBcBKvKryUi4OzdgRCh3FNUxaaUEB3RvVpu1hTU1zCqWRX2WEQVI49WZedO2L/by3M3Ca+yB0RdmXvxbNDWBsoiqX2ytZKwefIUHr7X9yB/RsxpLpBDu1yp/ObSfrXqh1DNGG/sjpu1vup4JiGh8fnnuDmvjYtcJzPMgIv/cU2qtIQB2gHmDet6yfwQUBwjxu8/Zr1Se50OQeE//uCtFMi0T+QenvB3/lA/28YBvEL40Azh3Eet4KRln6Ma1WvlGrIYu7eG3EHwZFtXTeYXf+VSuSBvrJ4/IYRRbL3GKVNbC3OBSUncVMsA0hlr9oALpgx9+IktmBUiGfJGZrkP5Fyn1ThWGYhI/OPwrMF0abx0ajlolFuqk+pMVrRNFOyTlUhX8/Pc+sDH/FtvR6En4f9ruif/2Xfr55UtCQDqtoAvAqH1D+k/QH3mR+CAwgwBFnB43sHp6MRDR/gUDb4Z0zIQpwvEF5bKTJUtbvE5yosV1Qdhsf5aoP8mhS2nZ/YRQ8zxd/x/pt0SFX5Z+z2jcA8LkFc+QX+6l8VzC6tYRBRTvGF8dEo6hH2cTTizzWYJMv6izBLPn/uq6kvcLnxuRSJQPyIB8tAJvkabfIgKqsRK5CpUEH5rUaWj/jo8p4Slz+qwWE6/oQ0hUuiQv6Wtf85dU3pKANnEv/Uu7G9ubuaiUijRzWc60wiCQl2DgDP6R6H0Z0UDjaNixZSyzupjVvlZz6BZZXW6vCBbF1D/e4dvVr9McvJfDOQE8ZA7To1VV82Jy4XAw21sfuaEyKxO3ujjY6SM9UQjUrj7iJLqGx52r0i2TyzLbXvnr+97USxFyOQ/3xcLE3bx41nZolfVEdj2mhuZdUw1rsm/CwP3HnaRykBdCyuDdcBZndhRyUregFY8j6ygG96DR9BXYy9QrSL5VG5/8s3hJKRAKC7QawWO3EvEwMzP96tHq55izsXdif/Vo9vyuWkMcwRQ5L4uEoyQPs+ER8Ha6VGW4TwY8U5cl76o8tFop1vvfmD/524F3wFMVoQa2CgaSDe5sPv6WElSGzWQo8meJpW0h0kHmvMXghgzCqSgh2H9QB+HejE4zLczWbUPaIHX12ZscYa7MSNDHmrzd+vn5PoN0DOkkaeiMQREhxoEJP4eBeQbo32rGp9GxuieLQB9626PLzs8ggZftbpF3k5ypSrHBCgFdDlqu1v6ln1v953sUXhy19+v2LQm9hGuRfv7F5oxQziTkk77vsuR6cUTxQ1fA4K3lZXrDc/qQ2mcifxRH+fApuyrkZ2TSPGGfRLkYYPLwTbzucnztyb8Bi5myl97qL+IGQGnanAcwiutkdu+75+0e2bkLLWU3l3Uqv/148itc+QKY45MPp1n9KF4snSyoytL0MDrygrV7+CiJHKnkyyQzXAMZx1Jd+8yAZCmufo+Q/h6Cpvt8N4ijZYYzcyRnhn8PkDxghO1zlqSPkzTI12j0wD/vfJTTdtcRrAcA6nJH3dMc02v0j7aqEtwiXv0Z/w8y689DDticHGz54C0qWKq59J655me7Ti/8MxyVYioctil+Nf3sSaT8/va0y3UE8DLJX/li6wkJRpkasvhZr3QPaU09uVkHbkWO/9Q8FDrs0txP0LWJnnNcBuu/hzNJQRxUN8Sxr23Gcr9AEJB0OsQlczSL327jqwu2UxG5UYVu4XoiAJxqCU+1rgTt8rtP+AN3tKUtRUAANo3ACMXgepAchip1AGgoS6WLN3myKMPw+BEiZMOCdH7EYXqA1g0fJnclSpeotWW2sk4ygi+s/3nH9TpuNpfl0FAcgL1GZt2QZqXbeoM4vZREko261hW1FkFEo8Z2m+W6PsyC9os8UnC18HNBoE0n4Ydh0X+ib7hGNa57qVEXvqZDZ7K6lqUnCL6UyQlVDRWfSb8bWtNSSmB09UzodwhbGGxgzOnYpXqoL9tVD59dEbxuROzof3PFvtkn9pLL+LJW7bh/TEGmbNDBpFfwytyZkKSVmacjv0SbrPhH1D88o+BHsYUrufWqOPUxe4UiI9tOkdgIZ7+IXLJAppx9gqjFJYgNdSKqypQ7XAfBz+xkx1x1tPOearGV7OR0tlNgaapS+uujpytkNfsltjfjjCoPwRP7x/S9EpbttxPv9I3BmOaV0ZIFIjQ0EawJb8Uq9Nft6GSwDF2uJs2a/bzxRyaaFvIAAP762BSIS/l6G1IY6MGPFrwCri105mh9a6BrPhHcqHWZoMPkRqGS4f5QrBGqTavaPCuHWJ4k81mmwYXIbvGpQ2xmt3b/7m/6rh3Rg4+nc0YeK37f41LXtZuj2LXeaNVAcGC5XR1g7mWdsmybotEr4FQ3QQ6xDHPLarfCglBfeG9da385uEOLMkk2/sw3KDOC/gsP/S2skRw1uiP/jdy+YlLjKXDXReS37bVXL02aKV/CluycFyE7S+Tly5qU6rPLyHr8oMss055irmYbyQmOqOL8JUV2d/YjZBhcNKtlDpoLs+/cTR5cR/MleaD6CR3AvnfbGyFMtMo6wnRAkOYci1dwKiIVSVP5Gnyed6fKO11inMep4SHW5MUdfo0hjHBHFFcQymEuy4m4dEPQrHLS/BRQuGCsf02Pk08i2GGG0la5J60p/0qGoy/3401+zyFztARgFkhvNevhjuJxS9iLd+3Zd9WgoomSwdaSQZAigHvcGVTZVs0kW63hSzsDCJfvo8jUA62g93DEsJXf1N7IU+IaM3TSsC9L3P8gsh7y2JK+ZQtpU4XCVQvX6fpd6AKooTBubTcPP26bMjQ8Nqo8VWIIrX0XVjxQFt7Z09YywkBB5dwy1b7+0ii17iqVErrLONBDb6ePUeMlq3CoeD0uQRcSO4n3/5tSqiTg4DA6m82Sffcdrl8UDLEB131GDPXoBis0yZD+oS6uz9Un68QrVy6NQz6BZYZvVSEEaZyyvC1q6aPi0GeaSDpXfQOHFbWqmkc3HfPDx3hik6l50z+QOAJP1czc3NgXFR+DnMLchXX2rNwg2Dc/3zeGYbYrW1Mkk5FtswVnDK3a+eA5vk6BpLp5GnfCE2EnQYASpe7KoZiLrHCoOUvNfBszh60x5z1Z02VpfCuty4N+vhjJZJdGTrYeaGuR59PGp6sVuCSUdSza0PHv7okSQbFosf+cAFXuyAESRR+agJeld1xN9rFvVHMgTHYSo5Zz5m4OokFitxIhSefL1QkSQREwMmwFIZm14HIcLhiHX7sBDrM1BQHSYN//HT9/b6UyQnkObV2nPjWlDJyzn0DwQn2lUHZ86v3lgT9/+rHz8gA/3AZ/j/mNC/J5BPR5slngy46oe8BA3BXoGxn5HHD63hIrZScvdoIGbeJtLHlFjuXAXbGklIg6iGPtiMdEUm5I3EMXhClHZBsUCbxtZ65E7y/Wnj1P1jLog6o8Y8z9L3c8bhyS+FVh83OmsKjBXKeTcbx0r657T+MUyKuB1X9f6jk9FVQIoK3mrm/j+YFKECg6Zy20/kskc/eVh/Ky3R+aIjWlu7aSxhU8VdV+1jGfX43GRYyCTd+vSVYspBLq1kiRdhg/HcxqjgLk3d8S9HPV+aD8aa7KhxuykrZ0EQUDxFrKGib+3yyag7kYUj6P5HN4ZBr9eTwIXC8NaIAeHzvSllPPSzfWQMFEwLOaHMLNQUrFINeiZIbDMnxMnaxZxt+nFiCnsjflDy7kqjDCuz4KbCu/M9NSv+Gk+3yGuo2Xg4mvDJV6h5Li2IiNFNSbeYJaoDXAagLJEAqzDXBNv0HonXpvNlwBvWNNt8zKQSQY0KlpjGhi4pzTnDPTe7k6pguKoo2WA2kSVUpRZ6apx6Jur0KX7girbY1dDsz3QhI7izP2emgK5LMpqdhRIOwbOvAoqbQ2PQr5QnyMbmhXL8CwTdSSrA7bGPJCOOuJqngQC6xaPGBsHABSLvLspGNsT0Uf29+iQrWi6mu+6QHTWbtbX5x3QHKwdcLrUuCFOSoDFeYqoYIkR85aNtfwA4r4aJSHldp+ux+waltvUxfquFYD7FiWGFbkEtc7AcJByCfi4ZPvLG7/DLFTDD2PsvL/7bW8UY4dtwoJVC3qyBLuq2n7WLQq57uMCQpvs0cIObur9W3AcvPYhbUWE9plhbExpLLCW41yVc0OOjLtJbvYexbR/d/jeWdIJvIDGEZzZbquVYA2Qky0ixHfBu9l//6vfyeMhBZbCjHrfGxGOCMjv7QtoBPeIIqug/Z6TENSvnK+iVWligsaaOlWNEJnfJ7HPr6qAjc882s32d6+jcLpuv0gGAgcsRwVTAzNQvpp9Xen2sBL0ZnqbxEMpRqJ+enr9NtZRVKFGwKc3zg34bFBJy+ZDIOmrWzMo7XmGj00p+x35mW4a+N2Mk8ByPHuK7h4PYD/lzUhatIKysX4XgvNAdQW4VdUUus6PY3SS0XQnzp3BXLvnqTsm7nhtfKCBz4p/uVa1MJIToBpM5SrbphLu13r68kzKD8j+8KHHT90gfxe1PUG24b8xTw8KeBS1mAyDhDqsFqfX/TwSWcr9IjWbO9xG4ExTAA+ZNAtB/XNI9WNi99NYKp+irrQc1q8MNkLw8h6trxK2Kd1ApYOupTy4lpLnx/g7OeLjXLmzAJbWOZclccjgGzmDUOPivQPYJUr7X2NzyL63e2kxgKcBdSZXciOintI6+bCwzX+/57PRbd0zNvz2VKoqYfH5UboJkiIaCuLYWnnzV+kDv+RhQ2ww5ThgXdPDcyQ0pGlim+ZFSnNc0H0WTgRCpdi2x3GrTcPbPHkj5A1IFn32z+imh5fC1yCPT3QPGWGSFLQMuBgSyf3Aw4yImnoyBdMhQ3I4W/ViOgIHtTigVYQ/6tXz68g9hFVFGHTOcQyF/BPQXFdncMxIl0q+AAvQh0RMZ7IfoEECj1GfEE4YELfUD04mkGuaeK5vtlzZsD0YQtv3axMNE3l1zYx8cQd1qqnpVZWyLadvZBlDxWWgWL6+BQHr2jy/oP6fJeUgletiCqrdDtK3xKFRi/AOuyjyyVsibFlDuJcVC9NW8uK41dOj/CErj27NllflFYVT3q27uQvPA4BJ9fx2LGsQdqj5fxt7uLLEUKhSWx03kC/quIitevpQeSXiozQyg17Mm/k8iDwHISJBVUGhtU5IErLjZ7xsBL3dgJsAeNv8Jh7mnMWcqftjAsqsj4xY4zwFkUbnteYfN60D2kypIRA0Tp7Xa7+oo95UtM4+Xtft+JL614uy6IYIr2lx6rsRp5r63ovwC0nuzyo0i7DNFM4feWd6suLUj2pMVL0wdWtfW8Q/J7hOx0WCYSwyFW8KGWbt5pAolV8nb9DWazxUo/JCvTur7LmGIvR1GNBt76U2NtzCNifK9l40VknRHr3U7SDq4prfuTwUsl4FPTkP1/hmCc7/RacauNQ30BckCYXZqBZhnhaE4RrtZB9V6zUhm2sYuxIARo2q5E9qdFA/ivlgckZ8t4SeOmOMHhHp0Azr2nfkl4aE9vDnO80dtz7itfQIaghdjycM2vO3TQjcc2aem78PHQnBvIEG+0AdiwAO2DH7B+oY7jwaVOdvrWLKw+xS7lqxDIdiI1fnnLJf4P/h1jInnzbgaA6e8zC0exKxdIu6waSadkOt5LJTlft+CQd6ZXIih/gjSVDVS8nw5NJpjVcXVskXKmdAzHXxVmLLQi4noeGV1aHKhIxD42VEnlUkbm/hi/KGvwWmOq1c/GrfFgzvgjmFxvQ4BdTNoQyPdOpJ3tzG7YrlgoTqM3g7/283wGbo/V2JnyP48Nxrxoow2FIxJwmzSd9T1bAP5nvt8/BBODOls7hk6cGp6k+ZzQ/Y47Lf6JaishamvuJ5bMaC/XXA27DcXtFK77YPaLrKOno4qYVjwnhOomD6L5pH/MYViX3O4PcYSioGcjJP95SV6VYABS4pO12ygc1VNDSaXbrW9FqdIB6LcqZbL9FeyfC7NK7FDGNG9XQHJkFvn5SYaUT0xCDQNenMAJ24VvuiteTrDG6czW5tKzW8Ig755pfzAzbsiK5GDDLlKJiEjxXFHR7d/+XDYf/osxHfgQwmLIpTeT2ERjndo5R5mMLY2WeWDYKKEl+Fcj/YhBbPBrXNllx/3FA/niRhyzMDireXyVXFpZ3rdhxEdhYAkwl1KB2Fswrls/jSpUDwBGfLKrjOJzYyY6lBNL3N7xx8rGtD+Uqw3XicRyja06lDtDoOYpTLYrqpiXqlDikJSZ94eMi2/ENV0ToaiQ4dwczGGB+8TQC1ok/+Sg0pMrjPPlF8iqxitFOu4BEux1KnX+ie1IGT5zlUvl5t35AdeuBf83F+oYiM93f/PA9BFB+2NrLQJUp40ROb9OI1l/4KJ2DydhLUrKgVAlHzS9/d+65lol2dvyGnzIOD0IktUOFSHoTdagCDlIuIAAH8V7oqs1V/Z6ClZXvfOA/nmqazxrF+vqJVu1dAF4I4f1M9v4mttxRuLNRCp1FRXPZBgYry8tFKj807KphSxVhrtO9uGnVfY3t1zsAqvZKBqM1mNAY8MHcNGilyY4SzGNgrLrdcGPo5JuEEumlOINBV3L/4PGJPhVxCfPeUilklK6PA5vhYyyZ3aeJp6rkek3yEODZrBY7JnIOuaRY3kaz7Lfx9fB019FlehfyLd+HtGAkbuu/7oAAAAAJ/FIYgONSNyRQOGSVSv9N626COMqtnXz6XNgLHk3tBk8EPH3MXl99v4ejtvMGfMM2P9OWaHrNjy1M7cl/lkGp56pZk1NO0EkNTlXUXdg8btcizNvBJwoyNCl22wq8N/WUvPPfUvkLlcm0z8hVA3N3t3AWdFEH1V+38NlFbPII1QWuWOJrp7V9V4sVoFaIJE6km5L5pUYZQBhP4Bla7gu9VhO5z1/pSETTqk+ltIXx54Q7t7ZKw2M2SfP+MT+eMyR7T9HrOvBVXCWmzyn82Ws2Z6erHplj+cWagHDyt0ZE6Jiv6EPKBmwWijFLPGwcce/Frf6FDEUjLL6hQKDgqweH565HldBup+VtkLHqB3ABj+zGOPOKskHiVpUCS7kaAllsbuAkEWCKxJvDVnCm7r/DArl3em4QAiKlLZQez5m64jN5RumKOi5vKvSe6o1Gwo9IuVBsTxYg6KcUpsqPsL8wSPnhTSY0F7xBOGz0IwaRSjMeuhLRljxkVo8Iv4o6HIM2nJv7GWhO7fEK+HGgJPsy9SLDmxH4WuyF1uWMILVAveJ6YIqrb0U91szPbtD5k2VG0H3laztL3PvU4yF3PZb+kyKTmnukOmoLPKQ/Qvk506fr2xEl5bp1Ezr+9+4ONlEIzDOrVCoDDX9AIyO66USJcyDgZ2G0p4OKl+0V+4lckB86UAzf2ymBZECn3+nUMoUelVDaE/B3xpwNkb4cHyaXGVAdAchkiLEJaTD87L6rtWuAcFMN31VcS0bz7MZhcQlGVt/Z9Y0+Ju+rOgxQnnbFF7StAEAJWwILZ/j8vN4V/Nz4U4JkQdMN2caLFkri5ERfQqOwHD0jZKj+Hf/jyr01CUYf75oerM7B+R+8nt/oYYskA9yBWvFTXNLueI1G+MiNwqfaUU1rTTK0YxnuvPBNe/Lfwg6qx/rKbtkK0JOeuVFVbQStK5e7XqtVvViwsE1jwCZ7Slm0/Igaz9zcqB2mMDfJT7OLWSx5mZAFBKu2SVJNpWb7/HGSo2Vp1TsFJKFmpBxFJ1ELbbV63jfg1ScRnH8BhozzIzU58c6Pn6Iqb8MTzndo+fsMzdVC28RKJFQU/JbsXMTLenT+Ctoxe1z60apRFqtuIReDXYq1Y7d4o8I7kt6fmXIsk8b6pWACLzMRy9KnPUAdUNVhycswOgQE0bwupvOhbnU2lXuQTHtdTP0f0x8UVpF9MB4PfxelTiSbdR0XvAsHTAPkfaw9kk0WKvIMD+HF9XgrOapjeWFdJUb66moK3CBknEfy9j/U8LQk3oXYmEgcUoJtEuMMxz7vt0qiOevwbuxDexXxmdaPGUBZbClJ0hvn4JpMapALonmxMhvOyqo5sU4spyb0gm8yDzupqQ/KX3CzB67tLcBYighxZTV6CMGecUMfkG2hDw5mgg2Kt+SyPqato8UeZfkmxJoZRhGldunHaT4WBeQjtJ/pKNdRJJDwxsQWp4YHQWunV/gfA0aEvRjbVtgqa8hbQSRFBn+d8QHDRfqoiuP7Hc/BhIG4NieQ9HtcJ8m7ouZQBycbLt3jzEWPCSy556RA8YR2QA2RfnFP29Xiu/lvaKeNfat9FWX5JIrXFnQmpvHyA3JUws27v5Y6QXNGtcw81MJB/5BC41pJpbthhjd7te7rq6PzawImPHb1F1UHN4oHLHbPCqKPHst5prtDEEaOSMPzVuBLlvFsyTumue1JV/YPQIetZX/Nkensdoprs3sl7w8J1hA9KCkvPexSnrRz/KlU2VEul50SgRFXfIPZGUrfMOLY45ZsPMf/Od3r/7wGVqAIDPKU3yHagXNqDqKd18RHflTeXwyQpxcpkYiGBDo4J+pfF51JyecFstQL1JMV5Z385QJIsric9JEOANghpnxYCBd7rt6OviNnIyKbSY59KLo/QFpsAhN16tx+VT+8PUrfk/3T4WPZrEA55D/m+hxZck0ZQkUTkBP9+UYoC0Oi/4On03L3BUpSsLj3GTPgRcFvd+tUfgq6mHU1Ioa3jaWofNXVWlyl3jZfYiK/oFaLceEvOkd7WGdEVFRdTDRibCWpX9DzbdZvruMsZuO/xKvUmCPN2FDOu9LsVABkBwgn6eLubAblv1yj+DcDZX85tGA4JoQMhe2pfQWbvxTTqhK4Jf8xeWrfwnt4KPLE1Ayj+gpnQoGsPr293epAtx2r0VYdM1/fKS9nNBplr+Ys2ricwcaFELxqkzZUkPKGe1urRznD/to7B0SQMGXd9QiaA6tFv+desQHhyTTBZkuvYcIBBdGe3D8/qaAj/q5ZLUG30mOhF+KSkYXQhpXOSLjLZ+/2MVywSb48M81YexZ+VNVVVM/R8n3QURryrLk3h+K5ArTYHzIITmA2862tAnQP+PTiRISrWi3vjkwezIbItkmVU26zDOEm5Q6rV8qTvqomb4uOjmeh8vpH1138AUa8Y6hsyiIzPE0bijUa9/AqIQzfk/hy/2ADygX1ZjkrSFrDKLiEpFwWhyEk+b69vPYSw8avWYKc3GRSvGOSXFkYQuV/cSJQ2mxbqjCg6gQybgMoPcAAXH/TaZ/NIUml3AgDyqVCpzWJKY+6MuZ/5fmR3+z/f577yZqufUkx+3JCcoPMxbF5K7B85fL7TM/A88zhoPf7YJ7O62dVIKAh/a8/jUJWx4qNG8vrBE9xVPCqIvTAJrmMDke9lSr+PclvXViD5NVW597om29ZTzNYgc9siUSK4xBKrs8Hf9wZVLyRslkSClyNCOH3yc2U2FCqwedQcpFFB279drwEkuJgty0KHcBSF0WoKeLd66ZX5WL++/mXS+v0uGY+jaQhYwQs0gzQ1XFYoB4/O3PqTIDOlSyomlJG7wAHnjscMZ7EL8dXfG04sOMEr3ZJpGs2kWN85n9fQrTZLOU9JfMKXH4ZzpSNG7K8C/U5RGvEPYSn3o773VbTX/IVDX2w2fi4ETt7TZi8s3oSy4QOJh+oKBCBWnbUdq9Mgz+NMCpK89pZryaLqf1UD+3uo4SNQcBwVRAeetlQoWAyf9xQWbYhFflVDd3oYmwxvpx87BFbwlarDnMREi/curW6NueDYQwf0j7utyZWjelnJ7HIbPsJbpnOzFKEtTRGSNsPFEEXJqQfyaA7sJIQhyktE52BubFAUL0MPPTRCe1D6yxVHnsRgSKjmAaQeY4KythM98cDf2swBt2xYguMavWinNWHgc7nMHfczfqZf5Dy6KB5ZGjSnOvcwXu8+4wv9O7IlX/ugKHV6TCLqKdCsjuMz+eUdJDZKlSvYQSfbzjJKVMfnEhSAEa+CZUWfSQHa8LrNlDXmNLwp9ITHncy8Wd9WH9hCEiv7oujgRGXaUqrxSHBX28OPLRvbvwJrWwZECasHAHUhQnRked25voBuoSDVcQXTmRR2AP5dQjDdml9iUF11zWvdX7rXVx4xUOkROsqysYACLUFwsizcNsOu8I9Y9I+6D+rVW2B3u8qTgKBTIej/Pbw2I+Vi4q0NTo2z9S5yFvq923oPUhblRtA46zfvHft6NPuqwGB7FrzFfe9AkdEQO1IXNuHwT50aOGOMqphutZLn1ePQwXWLgaB+Xr00V1y4hmYHwS2+YouAEtOSAegaMSkFRJMIMNVOwo1KSoJKHXPCa3Z4JWsM7fisJYjV0CGiA3YEX5T9TzN1WAxT1z7oMf44XOhEpqTs9mWelKuhGTu930/qSQqSF2tOpMcL+m8YT3jikm21rgzJ3S2CnQnZRpQWYvBTTD33DpXwszKUDHLM9/c11UdSK7AIp996cD7gqLotTzKKc7rMovX5TwR1R7kgOUGE4u/hgFHaaGzuRUXxjorFhQ0fWhGEPkxPFkiuVmCgEyato4M7UjlNicFsMxx8WpA6OyjqPKVWxF3baf7hOkGdfeWBMA7GilZYzvd4bBowMz5d+hYadWV17hWvnErk2dNXX6y4SiuDsq4fAlBrOSnio0GC3Hac8iR/Z9lv6cyUe3eDwCWID/xDZ3K2Dvg/Zm7gsS4JUiOxBFXUOyZKuycoD3WXujwOYF5BdFiKP2IbesRwJg0e7mL9sk14XsNAyKxQTOBwWOCkt5gkuawcUgAOkiMb/gUcQa8Eeae48qhOlzjgbKlyYNdpdWBIPz/OeQvDyU9BumtzxujB0d/h3qmvO+7OxmfEViozpeE8W57xQDxtCTI1nxBwC89ChMlr6HNygz6HXVZQTezRx/5mP+I9mx1h1TbOmlPL+uQe41HzUVW3UNObC4bZmOOPXNCOjzJETiaXZhcNNPKL34AIVt8uqZPCjLvNeq5mPi0vXZQJpBk0ETke4Ge3x+b7TlPyYl+i8vG3G/1XfDmxppxv97eICvDhOn0JbgWKa5IeDkSXJcwOUl2RcNYeudTkti/r1NDqV7++tYqfL9meyfz+HPGqJ/5jnPePJ6MgQ8nJGHlCvZO6UvlGRmIEBmdNcICmSJAGaRogviCJKm8yLBj7okzn0tL61LtElD6Pb1nS6aCnyptdN4hDuskwUEr0MEUFqOp9B/k4OhwbcZxRpVvqDzv0qeDKMF7RaUu4zs75JdUs2x5F0N3YpoHZGZmdFvslKOqY7QwbDPGDterH1CnbKdn+i4aGPogwjknl81QzDUHyNUW+Ia/F4fzA822GXbKCpD+C9o9Xm2FinwrFPhHEdFIdlAWkcQBQ5TIhIEnQgGiVgQUZjTX5Pqi2/clQjl6jkVAYmO5f1bcT833ZDAmeHVJCbztvijdOam+H50MZZxKaYRwgYyRdLc1sa0ekJxYdqn4PyVo5na9s+3dlq0+KGv/4C9CxQehJbsDmuFc8Mnp66qxptHPNc43Q6fSyD66ouLuOGkrgsHfRcmUAE7umHR4lyrH6fU2mv6L54HwUJAo5ML+tEkiSP/Kz3RY6jcyYMboVPIXrA1Cnu9J4D05zhF1EFPi/f1//+zWeZTZ6kCqxlAlED+tyFF5IvDYRw2Q5TdeOZrdjm4wAilMdZ9IOflcQGVMt21cqml9lNZtmmtnZbJSH7ZF35JNwAy3CPeyGh3s3gYqAYfJcvNgBcmGnr4xpHhLygkeS74LfJAOtaCeqXydjYHbmPKDexNbbCRzLnKqWn0NxSwwMfs2+JCdx4LElaU4IZ0RG9QOB3htVbLwqaCh+cOGhNAqqmkfxrrzR0Fpo+SKM7NY4ACM/tw+yaS47Qorw2/DIK9pImzEZ5JTzsWC2ET6KdKSTyNBCJhr75aQaceImoByOmy7mO4XEvkmJBy0/ZfA5UnT8OMjKlSsN2hwnAC8vxBbloPJGbsGUumRmJL4k+Z256HZAZr3syfAlrJ7kiNqLLiwFRwI3N2S+4JhgrARZz/L0KMLb7aKxqwxelPXOOHe5WFn+3aDSEiE4AuS8T/NyNqypusbUXWpzfj19+ck1zJX9cfH2DOCGvKco+ew77WNtWnAgxDN0Adj7awUv4Y4PgtjT1coINcuNvy4btvyca45NIvW6OO+t++QtnuJQ6cB6OJF302t23/wborWQ+oZkYVaLdWhubT6ov3z5nqsN6GGiSAZWx8Z7C9IpaUcRY9OvUf2Pw+pmoC/UrE+GcXSIq9gewgzZiJRM+lVyvS4+xcjBljP6g1bJH/Ewmt3NG0274g/k+o9edPoDh3wfgSz+cecZ4pdsNSZhFI2Bez6WqQkd9Uqx1QW/XwDBPXnJfGCLkcvYgjjyFFL8oWBXzbMVderNKoErVkSjKNKf3Rnq1adL/QyRk2dNt400kcMz/nE8KBBRcwAgiYYlTRqBaXm1dXeimYqJ/CxRIYmphZ8Gp+su0IE2qj3+4qVz868zfZI7jqSZkSi++VxdTpqfEyQxj60WqQaDtKL8X47EyunDS6yc+w7dMH7pA36vWvCmrdHVYcgF4oGGkAPjaMVO3K6c5uGfvQElIENyeJXn1oTsbtvZ0V8YPYgP7TVKAQlA0k6b3Vf9Wm1S06h7ZAxCtRdLr0dWLuX7VLlQlUvkwJc1m0dnLX0u/mjmbq843B1qzWxO1v0M1V7jztf2+lP/B1ImKRiuRn1OoHJf/1Q/rMIMClfdBwb895CVuYNIAixO31mEzrsZMYy6xeH+I+mh9sc4zs6MWYPTZ78v77nN+wG+qgCLu8MH9Tesvr6mRnhkpvRc4oy7UWBDmPcMQV5vxOl5g8PAwtXh/V06AzeSKgc2nabtcugbK9gUi0hFIgDjK8drMEHd9Ibtf7Dkv8RPNBoavQTbP7WX6lrHtIgxMR0//KhF2MP1Al1ymDulvot94p/i/NL3pcefAJq74vVghrcYOHiLxHWLxSg5wiwLN52ktLNml+ss8/VhbUowO8/La39410oYjVgwSANG/N22bQWYrHfyDGpgCa6zpYMZ1xfqEtvSa/Td9qYWpArnmkvK2gW/jDs7MberwkJe1FpKPNm4H+2Sc30COFh9yQOnIz5YeAFWnKfzMtGD1kZXc+ELbdAA3WqkFGb/Kivk8MQscJRtbL2Hq75o1h6mZ6eOl+WO0akCTp3eC8EOJOqcec6G3s6v4tt7X0zsRtcAW/FaIFbW10h4QRN+17SXH4WpcKGQmtWOCvyqMU+fFq5oxvag+l0WsUpspBkec6AeDFTLvgNQIMdr4c2qtZfUl8zRGSwsLG7vfMfbUoz08Bzejb0PTl2ZLR86U7dg/rxXYo+ifxeZuFSGvVMH0XcwOFKa0mKLf72eRHN/l1ST8Ud+ARoMg/s4Ums6toCmki1qyWmgxP+d+F7/h/+QAf+w6xd36rwckBSfxb636nrJK9Roqccogy8wlKxcNK6JZY7bg6z5mPCqPLdB/GHw6gIrXyNft/uwC2ot+8DVbmMkTIJhigP05qoFOkUhEeDHr47fwS14ACD2oLKYpw/VYKCYe81wCwYa9Oa+oXORtAfWCvSAzg4DTpKfb1KReylRHuAZX+XbOUn8gPSFbTtQLhBQgOHSKBVVfJ1Dt4Jtj5kz0cG8kA+EhLnWYvygB4EXLJgOlsirxMS7z12GfN+8jWoy6PcWwaBz+X5Reee/JnVyEY/ZoOVB/DqTgCoFQEAhQoIzsJkquq4jM/FwXW3hzC2Ld+WGNn2XhnVSH1+aNhRZif5z5l3jNYsSAKSnDC2wxmSQspnUwutmOmrsctS5qOxTvaNH0mbrpre4U9IYlbCSQ82dj2viu/IfhtjsQWTO06ptaAXQXiceiPQT0duSeuVFIt8jgPgiElSklF+L5ndJ+bOFKtrN1je5SJLdhYcj6p4z45AEcHZXV54zXsNFKWIbem9LbBYdWuJQuLUIgl59ObKxZiEQo9ImUvwScrIZpAcWWU0rx5Gtphpvif8+I42nD/iNjO0mLv/hXiLAdaTJVukxGeenFgvkKrvJCNGNcavdxrEP+nfx7JCJpIGR6DsoZWqkbJDqkEu39BuC+NKrS6HQTTxv4HhLPaWeKKT+WHVgLSEIUUPGAYcJKW+adjrYmP86yBwbWXSxSyOwJn6Ka5d+p/9u+7jWzuctFrFGcWjR5GGgqPGhx+RXULEEpcC4yROzURxmwZx/lvKzSli9o7O65ZudaX2M6XCrfa08+MvSllDqUkfsJqGEsIKRqFSFCButqVjV1iErm9rE/7EEMV6l8s9V5lpyaAEbP67z7AUKotjq62aEVhQgbQ51ccm5fsPGie7F8i6pkSrIOFm4Z2Qp2C3c8pM4dKDqWJI1mhFq4xJ8siLqss++LYvB2R4/3FZOsqyx4qA9LRF6GWLwWHEDcJWVtPlG2GZK64XnJEXbToE8w6xyqoqF9teNtnl01+8syyepzXgWYb+pqI77Bl52+orPoQ6A3uBWj6uFfPbfjaPvrYxMpelcrE9qsuAEv63p0zZfEGx8kKLxTk/SsrlIryVw8+8pt95R9i20SmIK29G7EiJynqcp/iGMit3RpJLQxDbyiYWCN1HKIdfmKkt/wOmafnCXM3Y926NlC6EOFtKl6Uqx5EW1IVlcrWkNDsuWYxdA2QUaq+hWla/1ycbct62Q6t9a4vBEINs87VA6dHqZrSXpNPtXTzinBuFgE/PWaBZETSswzNEEiwdO2GEu2U0cdH3v85DVF5DI9fTw06Oy2jrvhJlK9es75rKT2taqUFC+ZAj7MIlIV5+SkRc1wISvyN1MCjUKT/JZTq4Bi0rCCOMEmDiyaslCokhtNDGUQbGY9dUQ0TPGSn66JQxQJW1j3+XCDLPqiMinA2dB7u/961lk9i2MNzFwvVPJbzYz2IQYvkMLAirx9AwGXf7JlgjbiFJIkzT7miw/gwDCLmBsM1nTACyeLP2d62F2etRMmGerz1rnxGHaKsGUtYwS53wXSxvY1/jxGo/yLVnNjpoV/pSiYgbv6TpVepNOT9dGJ5UzVKs8XCzAj1iZGTdCvl4sGCNEQw263FBVm8b//qahcg4Tf98/WHewU5fxKSsSq/TEB67B0KCv3ETqtIV73CDrp+Df6AkEoXIA21FfFav8i5VJkW5UqBqR/LCJ53brwAdaXCZIRE7o+ZCX4u/oxAHFsFQtg0rYDfeqLYZsDu2/bLsyd/7+LF2uBBiKquztYLu1oRWx1yZxvGJG5X/525h8vNmaUzRBRpdI8KrPsPA0RZn/tckDp3n3aYa9t0vq7+b7u9ojYh7YxqUk5wBcR93CXnESjLfXDOUPN0kXvmf4im1k83PoTl8Igww/bq+2kZCGr3OeLMhjW6G+f0VXKoTiXCaTH9ckQEvOT6e7l3gTbXVV9Xb4t83TRYaQBPTcBqnZx2WN/MbcqKeae7YfWtI/h+cpA+ny6kcYTSu5xSoNwP3h3DRsTH2WakOuzuZEEjR235xDnhLJedInXCqm5Gj8Thifoqyh8VeI8SO+BtX3g1XCSLfapvEPJuXB+bG7I+Y56MokdS7NEhgCq0k7Q2Wj5rhhNLZY6aVaCI9GikDnARsxyJy1aOmsjhcWisarJG+LOgcSu61W6dtJwomrsRXZ/VQhVV3igtR2g2t6cp0nmSVbrNBERZ/mkMtqGBzHBCETCeTPZasXLKUgbUbCxMZ7G5K02Dvv/zPy/WAY7dv3APEZdn4XzgHmpElWFRIUTC0s+yTpIHsSPWapYwdLNIhMIZP4W/eaA3tGCm8TrweAwmzXvNCu0Bt7Q01s2angTv6q6HEBFPox4kkX2l77xQW+rDznvMpdPDx+UEVZTY4wzxcJ+b1j8ZK9u3L72jfpSaUSJzRTgHii2+wyF3WUhoI2+QwyMAygMQZzJ4iapacpuRzundyM7huVi2iR3SjEbXpkCue7OCTF8lmmFdkBznCNXbXzrbcEkMrbDGtx9FQ15AXW/ej/QDGJKpD94muB96LriKmI0ZFwKhUxN9teuHeq6I2qJr+pkTSHxp1mOviUJl8XcSl5/bFMf9hBpmDL3fGopNNTM2+C6zaIzEzxlOL5bCgjHQIRSRzEV74a023ZQF+LjKP8kqgPwaHnZZAqwuP5mNh+5ntbTiFd9Ej5ZQLhRvgcj8UrTCak0TmGqw/HjspTAADHfGO5hZjpJDMwUmZqrpnRbdpeZfrhu5yn3SfcYzzCxh+JeBx/NdCg8qepPBgYYk/cAayBm1h4wAaA4p28oAGh8/b7PUkG4GGqdA+Xcxz/c0E2lT2nJhKv1zkURTUIdmg9hsUOmCL65YjdjhBCvsShrwu8zssHNJ7aL6lDJr1AUCgX9s+Xfpr1LgmihuDnYAMlEt+2Z0EyIXjhhBHUT3pCR6kaX6xkFBZhcBPpQlL1eUfQlW6VlSS0jcl9AbWZS1u3eaW8LlKXq1Co3FHv9x4fVGDBTHutEzmM3mXIUx0aaSHRL4p4alBKb+pSDruXqnPJv5jtXcGsLgIEbbigOAKXMQnjXnwchbA8aIdhlIKF1RpaJBFFwZRCmAJ9moftT0Dr2yW1OjZYWQGjCeAHxCD1Y+JHp7K1uzsXtmmXFWxr0PQIVS+HgtiyWMLruZK58QbdGA+ZeyWai50u5l/VVWDk2re/Y8HerM4Vlrn8lU5rs7+9F0TZcakXn6PNNLdgyjBZVfLGbL0vYxvKZeEdQb1w67nBuDDhl9rhkSaLBT/tdF5+IRuo4ou0eSvjy4LNd3V2wyCQ4IWHfrP4sZvSjmE8qRHZ/zje7HJucxUnvyKhNovxunvjD0o3RYA4GxGKJrQDPE/n/ck9YHRh9SLv67jyo9UvzTHonU9nJLuENBbs7QNBnSWWXPY3pmOwMLvJY8c9doGnXi01pacaj+fAhGVzPjxKwEy9w81RgUnw0fMaCqeo0VHOSK25R97tgrWqgFiMWp4k5DGqjxnGcFxba/T5lk3WEAuYAADicPbQipY8tHPu9Xm+mQV5t2VwjmlH8IgLkfp1J2cRKK7+hlOxdcZMPufTDKYMH0iiacdrfDPt5cYQGix2of1WfMuhWcHKKpRrCKm3WBK1Db32xAua4FVO5QBI6zJ29Kgl85PDEpU1HQefYZEo9DjFcSkUjdRpEAViFgsEbhlwHnRg1rixJkaCflOhkIJooZZsv8t+Lmyu4aru3Ftzn9Ipp+Idm6H+As6B9+6wR23686nelasqH7dkPemOxlFZ+D1q7fObvC1ASVo2aNJbBnJgufcG8+mWAV3bltv8ZCZG2ChR+bQS24QA+5t9rmO5UpUqvdMW8vIvHai8rrSP8tq7i1MgSD1FglW83Yzz4PPtDoXCkezE1F4b83jn/7DZcMp/QsFKfBRivX9ZXACyY+DC4XkBglbXy9ZMdOOccZICVqg6gVUuOEvI2YXIDi6SjQEUBE90DQ1SaexUGvhd6Qg9N9yIAyzH0Nu0fKzt5XD/QDZSS2G1pOWGHLzvwc5lK/X/Y29H6T8/KugurVedJbqiA8jhgsZSMZb+F8jwbh6AiZzynleycuSuNmxVied0vFDHpZQeOWqHqEeOsTsjNZCV9YpkZCw5bsZ0HGOpWoZOeUYk7jrkezqfqO/XaURqZjExW8jOFO16DzlBREriwfYfKE/AUTIU6wWSuV7bWn+0LoSuusv1dOerg+8LNmKICsQbibmEQdhOKWsgiQvC2Ea2PsqeIYpxAHZ8zUxMBF9TVhs2GynR5Y0qW3d/dAEsIrDf5IpYmqgfdJ0gxiRx7pFLH5SJKaZqW4svIrc7vINbyxKz4l0r0nPA6Q+fCHKnAAqM3R+OkU4w91HVB85l7qnO07o3RGUKpJslwid3opJ4Grk123YWz65y6WGE5xyntULlb2vEtMvX/W6S2SsNYNuQE2ESteBAo91HHTVkS4PoeppEVvzi66Lo3jaGOuz7K5vfcO9iPQ8iWgDyFRGnM+g0fVHFwIAZtrzSpsHQuD+slsT+yuudwoLIuuVe4hPtIB2j7Sb1qDkpBR7M+QmWxA19NjlIL4STGcbW6Wv1O/FSqF5JNlREVrAfSvi7Hfg7I/p3uY4zVHW2o003+9e8s4sEhVwmNdaP63Q3YsvQg0RClOUcQfh13zc49iPwnCofpXxiR03j8avOssgRi+A6g65WBODfnGuEHXiEbkhNGWOAvyyz3I3hQL7cNwCzxv/uLPdEkZuqwZ6fVuzLl/mHTbWheGOCmCOY+hRRsYndJm5APc5vUVv8l5oJw8veJGPVF3BRI4/xuLqETH6dqzT8/uKfwff4epcNhEJX7hDxz4yVDMK30+FQpxabWbM9A/FzPfoOcIvvmJzWs1M88Ux6Kt36dWc3TW8sgal7iVb7a7f1vRzGg+g6K2VE4xcaUvtBl5gwix20/29lQMCFGDORQEG6L3mHOTzdx9Wkg9QyLiSFwitD6RdpqlwKmFFAiDyDSnfPs3v1ptcDgKHNsJli0OvrIU8+xjefRMvG/K5WRQbk2QAydfVofwXSVQysTPIDm8R6BXz9Rgw1ldnufBPfPcrEb94C1tpHgwf+96NcE+KSXeUHP+11tpECHDGRuIGEUr8pofdL0Q8W802HokGL+KvmpHkSWGNb96WoqNz98+tST8eKiuCp3APd7595kRj/TJ0g82Krk7QfULvNJnCSwXQTEdRVx3BP4DPfGZ3lMU4g5+BrYrAylTXpdDuisuYWS1NszFzCIAkZKlOe9UFUslJOX9fe+CYCy9A0TDQvdClg3f6ymkbortjoqUWNlqz5TiY1GUTYmj2yjBbUGthsVf0SDBaEY0/G3aId7cMHfzLhElKlv5Rt4TuVULcDXnPJrCk0XYVJ2z+L5Lhj43HCA1OwjUUKvfHL3REzfDX3b+9H9r5X0wV4HZQZMCe2Qye1BfZiacaFhf+JblIZstvujO5FdoUlj1BUGPFXSX0rk9KM2kqhWmiVRyIniJAOpAtGkJxbZFgnfD0IEClS1/GtXhXNYklHdGtkb+bru6ckzNmagpfErTS7Fm7bhYsmPIosOAH72tv9bTlnc5Zof9SXBlf/NQz9bFIOplFy/1464hP3ZB/nescvUTdBAyZZ6qFXfi1p9OWKs+tuvlnHIWKIE1ukbWlEoQl9KGK+XuM4relpkaDpixp99N1v0S2+lJc+NZunBplUkuE4qLfSvfeH/uOrVJbUN729tkAPsx8n+/Aqe2POhizqw2ypVOXiRXJ77ChLXw5DjVHIJ263yrB46nWR6AWgN8mTAtcNIstuKNQIfrL59dysl4EJrb5kMyJpxcRQ+qTLYKeww5m4t/xztU7ekXK/ik0eQN2/G207/ezY3GVYHSERYRaxnoC/qjG/QFok4ZxT25WnRpilh302w/9W5ShYe25N+/4k/vogsDhqhsw/xg8ydV7tC/XvDAyYtzVVA00PRABZCTq4Xag1OMpVjH3UiylyPUb17kSBA8ac3hbTl9nKU5jNwFqLD99SZgjFdBBDZAPN00qbKbVjAf8C92FSMfRpAN6DgwrfkYrybP2agq7YTINzxwsNbwuy6otLDFBrdreO3JPg1yBgmzJbP2WydasYsSR9xh9Gei0lKE4WCgIJQ8ziTdIGPlbosSKFn0/Gdcbbu0Tm804lDTpWUpoyQDtF7GZ707PUBa9H2uetLE3XWmBhjnO+nzS3D9YUoYYKbMeKA9soMks+mdUj6PvXTzUKxi97j9xcWzyjl1/IwicF9v3Gk7ikOcdsXhYnlO5hihUJagoYss2h5KC9krtqVGUAbgh0bZor4zPUn8yC/8/itHHArnNkNDDFO8gGHr8n/ZpQEZPkBRS7OESG4u1ILyhb2+4dsjVTqVin/BMKc+xhHjnbFlS+PSz11hEN5vaSOeJkLDIKomdfUOmaXZymYBYxeImD7SKtkL82cYyWrhVxWuBhybC2A+MfDm/h3ztoPnGCYDbOvxaftsb959tYMF++ps/GJA1Qqyl29jZdVpXE8LxFe7umvKOJo4LCH/u0a0jwjk5I/pWGwBY6rlw1/ZB00US0dMJsGhSAOGt5179XEx+i6gNJtfJHaOx51ChBnvi4qRKrz/OhMPFViTVvM0lSDQy/NgD9ugZtGOIvNS9R/xf44xGYow96cDgQuk+X/g/o8006vc/All8aVrKqcnIjuCVs9/8pCmnbCqjWVwiwZdGgnbBXt3ka4KJqQu0TP1pkIVilV9jJtJLU1nXOAmckeyCZHwRSvAT+6YpDV1OeRyKP2UR6gCH3e5YtnfDKEmLPkPTMAGDTe2ELdgSadX2zg8c4UU/yFzwBM8siDXutJrliDyrPy8mKvRf0T5jK46g7MFgS87QQzOD1ibYf9McAjtYZWrSm29gjnXkvX9chQ84ZZ7FoCA6r5HCjXB6QV8bQC6vSOIyINPbiaicQE1VzObcjEDJozwdJ4YQEBkmEqjYvXDlxPaoKxJezjGu6W+fE2Q57Yqj+PuCHSlXSPBphiXNU4e/gN0R+ZiFik1O64dfyqBSm2BXhxvZ3/eTrIYeisCUU6JViiRL0iHxdr+Rg04O6DwU4ZRQZW0yo3xqbDNV3M8/VxCubEAY3xVkVQRWZ+kJTzWBlTomlrbg6iz2Bw2e+wfX+ILRcCSpbHajeOPR+Hh7tbXEqQ5STWvkFCCllnc4s7WntA6z3Ku5ySn0Uw0PiRjOUKaeHi0Cv/gsx3G1EtXDbXNto89F1R8szyH6ZkekA1NvUzQejMbGR1qTjMPC5Fy7eK1+8teMQvzLCYDIjJ2MQtBw+qaDRBd9sm33AzKOtFwMpGZy/AEq1VPaWM6YYcR44jiOXy84E5qsYbrOWYFiVAAfQDdx23gWWEsLv3onMt11vubT5cmMTVECTCuPTwnCOEPVM37CP6jlvKjH4TcBAP5iwAPtjF7X5xL+sA6guFNKIMcDxGcFQ1+9uKL0AUetNC7ySbc0iFF0wFMwBPWV2zO72e3BiGa02QAmEDqJ1DUmWbkS1XbMz5CAxil3qm6YApjpjCenNDt436SSHKf4xE7Pff9/tdMacZ/XxcNRwy+uNKMSGCCuEOVDfZ+AhN0Lrc9QW3XJvj8/o9SPTcOaJSTHy2FOTrreG+Gc/vxa0uRUDnFYqrMQhhLeV1ZYfQmU9eeNnhhkABUCsBU8hlJRI2XRhlL2lPwP+BA2MAc7MrImjUEbmVsomf3+7AutSrGdFyhNq6m8/5giXAgGNH+Yf1YPQWcAT+ku5GJH/gCqWD9pDBUTBYI2O74L7aisYbrfOC9E6ih6LSyCs+OX3QNIhizAwL+74LRpgAP0sWRnuzp4cwInIt9y0HPJwUK9sYkN8gfheB7izZq88TbUIZRvQeysAGn+Mg75bKJybo/K14vIaE5E/qTeZHnKCYVJMZeRqBwH+O+RUli7c6SjWpbHy00FijiIiIU1nQpeuoEviXtvuSOCsHWsEk4vx7m0Yj1t5QMURJ+8tyhNv/eTsAoCDHx1D4in58WoGx81p2VukpYd0b+RTK6uAb2muaTuFJNuIXJIow57WECeClK2TVVf/slkW5fR/TUUd/UYjD1kwioKWLNVkG7dnKvzSvY2FctO1pcdLjkQdKI/V+6CopgRrycb+AYmjAXcPehaYsQ/7oRmMGTh8WGTRPB/JXQoC6hn8X03oTyo5EMdVCaIpQX2iVdAuI6tG43EtNsoJtz8ziNHoPjMYWtlRGsSkZsGrnc2dCT1U7COiC+RTEsJa66r3T5PADq9Ba7rIdoL0JmqrIS640kzHazTutJoxBawppiOyA5WO0dUyfSBZfCo1Qaq7ul+CNK184104EBBqCSAgmhuagKw/HR4fYLc/Q7hopPbe6cCU6xVNmq5y6W4/m05oofuA0ENsaxi/kWg6D7Q+ZOJbOxoECwrkaq+xj9FY6uJbf9o3mwNeF5pcFbsgpPcFwOJlQY4JF7BUD5OODueiM9l0Wz8ekl4vo2LHZKYUiCF2IZiTKTVMWxIa3EKU4f1FrluSbyBiHsKARj65Dxbvu22RM5uZVlTvWV1dtaPxN99v0B0uBqTyVKS6t4U1FKHmGJ2Fyq8aZAPtfYanzdtrC8g5Cz+LVtIEryEAmT/hWi41xa6tkF+CGH5Nvl0eB4LNyQEAZlbDeDzfncxT8VuYQvOfp05jIQZImD9M7+jQJwzQqpc2URuMksA9oFCV38tDO6U4luvtVv4pKeoomE36Nr1oXd6kj5krgNM7AjtsHoPDMYupQcA8a2OxQfBiu/4RcV4WEVxRUyLEB+ZGYShAufTzAufOqd2rFfx644C53XkgIzNUsfPQAowwIJnGv08+HLYkADUdoQR+25U+liFHuY6suz2uoMZem6aIdAWIJZXNndBsswjE+WLuwFTJPrt89P2vENURMwNiksmkGyrbvb0RSJ7D5dRkdo19S9E7Iif1NOLXQwS7B4PzeGPbiCNMASRbweT6kBpMqRIq9IPCFpt1+vESBU/LuTdjJTjlTutPGd0PG9cfUrR2neYy+nKjmLiil8QH7QrBMV5ztMZZgoNv6kviO0wKwD0GKXvhgg88AMlAefxFsEFo3iFdm6gakWyhvLox4ALjjgRzwAAKn/Qp9k/3E2x1xQbPG0UIptj20nCJgVwGuOdR10n1ghpQM/6LeALzZQJ6P2C/Sl7vCNN5Uqa2dv2F7RtW53NJ0s6bpspc4pxDMgKDrYNIptOuuhpQjoFTMayGj6pLpK0T/sbB9DgR1AGj/+d/UJ+W96RuZ2ajOv2hQ1AZbMasR4UVsBO7gtxE0ibdWOxV3LGs85gLIrti5KcaTY+cQVOENG+VFLGhqXmo7K7RjjG+TkMx1IydOYVEmKMz3Xb1BpcrlTS14CfqkBF8lyUKMur8bql4aT2MnULDepdDhODkpGp2pVcdORWhH8stRiwHswyWYzS9FZC2DuZ5uv99+PiFCDMGLTq0DNulioQ1uWix4ho+nzAB98ruF6y/gJmtIw1SUjuUrK0l2sdndTXhN8tby9Zk51m2tmnnl9CFNK0ls1d/FT/khU/S2IM42yG0+in5mklxcCBZCD3mt4t8UkCtbx1Qqyi540H0r/Yd1JiNidLmI3MPIZT6v9M2iCNUEmmIBxt4UK8u5o7UteWZHYNcSXxCQn724/hGVwNanced68PaCDDPFw/zbVo3YhUAaBPv6RPHZ46m8Og2buhPy/LACgO0cXAtMYkwfG+f/y5XRjhd/PLzkox2bnNfEJBwlxHvkhakjmRD7N9kLcpe6squ2yGVp8RR1QJRrC6QE5KmdJy6AqVyS0xrQL4b7E2hs+Ti0UNIIlrUDurKnKsjiQQjqYp076j27dPaPF3Hw33L07hDfs0gwMZGl83GOa8dIzWyFChWVyl1GXS1hYzN+BsAeFxJE93DkE2b9Ld5sFBTyTANnLIIwAOp0LL7LkY2YijF5fVUaMz1naMbvu6q2HU3hUtI2fBQfjzmZ9NcpBjk4ubxxwKQYZ8/lKjWl+I5XkK5giOsPL/yaO6wU+kzw40OXJNV+uLNXetL8ROHfiRqrUo+OutQYuyOkGcjWq5SUAeyUTH1jQc9ma84yhcNL0IPzgGLnZLMP0x/riolcTnMiSzGwflRz5UzmHZRVSP7hBI59W4Ta056LmnDV/TkpAPF+EWudyyTi+BlQmOCYLWDuScVpKAXna+Y3wc4mGFb8KYcM+LZvp0w/9Pd70k8GkJeeDBRdBDt2eHX1KZ5rxcOKpeIa+SnR02pgWOVnYhXUOMFErv9rDkqx0AigRoTVKVLjERG3cUN1sOUXBpbmThBhIYVs9VhgMSJy0xnIenrp2mDe+qItxI6BvWVgwhAmUpwCHKtFJUJhd8aadYJ/PeD5h00p5waHKixAjj74SBAmv3EbPPGhgI2Ie/q5dL+xb+kp5U8TylhuIXPoZCD5FjfJbsaH0aCZG2hpOl1pOk5lP5Gcd2nXTxzOrEIDQUsWv+nVuYj4ROw1hUkCiV2LJTd11P/m7JfTboDbSpyVSAFD2zFBtblXemYMws0MaPbQ5QnQSgCbN9fZgJmwTS1WzYz+FASuqtBgItdCBzqWKyaJladdtFKD/t4j03yKG1pWDaxWfAeHrR4elqkBChy640oa5BN4p671Bb7Gu1QDOuRTNZYYG0cKtCwmajsewl2PuOsN2LmjtooZqJwTFK82hPpwaPdV2GvO1wSsdE5yCBVFMYadV7hnAWrSu59CeYW54dHyt/oAGOANP4DwDaVOESB8e7Ewxn18JL2+G2wcC9rKA73e9p+wIARvrQ0R/0eEMRMacNIZcmnLvFj73oKyaSOwJBbXF2KJ90wzdxCCA0zNBpFK8EBvOgSgBeGgLTciJT43RsZOOGo6D86utWYRhNVZPwEuAezk2ooXurYu7bprrb9u8xPvJOXkQtARogwdZfqckLhdMZr/bialjiDoe/jxIKEm6NBbjBCh9cdSrPZI22bgvmFOfYkA8XNvRLTm94YSPnE/pgZwvHfsdcA+Nd34doUziV+tv8Ajc9+J9XCHTuhIOAbFeD6NZEjgC9IaOytcgciMzyBbcOH+mRCklExSho5kQ0iNO/Vphw66ooDU/y/nOSa2IQ2+8u/Q1mCcs6ydEmRdCAXQg17UB5Df989AU3m3EqBScQK2julQkNhMAnC0OXgQCXVYS90z5k2JJLwf3vWk+4GDlxth28puPiAGrrt+pRYalCk16AZkdDujSe75zZD1YD+hqh7jS6GzN77fH0mM4bGljxal48FSilcoL7GGXFHVyEK9dWM4AFT4/IUBqB4pelPb+YGAZCJzYxRFgb9bjV7ZvVpHQDuFOuP4+mL7FGpQ6aJnZdFMdxtEvwTAjzohseqV4xmvcV7VUiRW5ZGxl0T+FNav6XkxcwJDIOH7nmNX3IdvLBAePCdNmZ9ZW3eq5tg4pcVy9wt+yH0pJSVjGKNRjkgQNXoAohatSnHuwrW8dhYwuylSfRCIRkFPsA6bYvojfxiRgysgvWOEFITPYpBJvXF8byKeO1ow0pb/hZ6nv6kC0fUsvtcuKxhdcOjEqdVfwK+VMnvMm6FOT1mwakgKjL7pzx0qHWbpyrcvElPzYdT/vQcWR9pAXRgsabF9AbfEZeuizdKKOQFsetFJqr4r5FIZMdxqXRRzALqO/7kUTm0xinL7Hlrl2GPaIV+0dbx1AJwYJYh5A9+DYCRTDFVi5ZAIWZ2Gy9pEEjuCGHVUVVMKgLmTHZM01s/MFixqxS/tatdlNwgTvRoneLuzfk9BRnFaAFP+V5S9ayKtXKCMriVPZQ3R6nLEfAmzky4Hj84yhxhrGnHecsqUq713BcfnP9CgaUpF6THdgEYfxrrZb194tcVAsxz6GAfEzitrp8zyjQGuQroQBxQNbgfuCiJAFQS178aMquFBJGMcwVH5hJdKnc1LqE092tU7TAPh/u9a/gTjmgRc0WNKWnrH52BVOesBuXjWd+xIsrCTUNNZm7HER30ygJVMfi87bU9XStmDzT3LTz5WvvavSltGaOB64g7E5XknqGrzgJhNldbc7Hzy61b1AuLxqCsSlb0FOnT+6rbIEfoKmIFwrtPA0aRj3pCBbj1luwgTrVH1xPLDw+F2DfQ+9JS8YCSEyQ3eRFLpr0nOCPAguHFcHo+Yp6urDXVafYwW2GZVGvbrwJiHxDDpaMAfvXkd8LjR0UQsTvs8bckBtfEwjrLSY6869EwAgcoJmZBKtDc4XecWANI385KfYm+m2VzsSmU9mBurxmf3TVYZtyROmTrMDy05gFYLyNGEqQD1bSjhbXLQ9tLTSKrQU3cwENF4SAS4INjOrVzRhMvMvtOAnFNZmRKhkKMywtVtOTcsdx5Quz3z/g+hsXyr3NTcEbY8KwOb84/KKABT5FeKL/yRmzI734WACl+fNAAwWNIPXoX/lIjWkloirliVpyrzuujzdxvDLVFpMvzCtrbIWjc0jzoEc/ppep3aCx9b/zSLKZoHD1VvsQLSXtRAc7z/wLM6DdnoxYZGPWUsZni/GotiqwH6xGLK6gq8CCNAi7kdkJY5i2LJh0Am0e1Yw94BKDC1+vJaQY8gE254BuMMdCElM+ff6Mr4hpEpmq9u8OarDrEoNH0IUZPPg84wmMUEzD1JVTrr0GhWTbjyxY5auf0haq7YK5HRLxDxlN4bzs/k96N6kV+nt40OAnf/aNqT8HuvaRRDsk2dFujpVwhYnR1+zPzCh4016oyec57YdcGjHtO9OiCqm1xuKCVFZSWB/Jqt8VO3WG+djJkMt8qN9dkh189BBlvnmddWpTHgdFpqngxRAfC4LycNndZtLW2Rvy5kz4bwuC1tZIqXQ9HmKTIBTpUBrNT3Li35IBUw1TRmKRXtR/WOZqLJ1vf0cLPrmvIOxz5awVO8tFT/PseTog+O3mTBgNhzw4MODmVz/Xdm/7qVJdr6tlti2FgvQHxpZQke87VawM9Ka7gxyaV018XIKOAy/K6YpY3JssdwpAli2i77qm9BJe4uK1Ps/38e8qf9WUrU3zEoYDLTxmDqOgJas2FLcMIEg3OwTnhsBl0EftyZ6AxGK5ZCPQq4wfN+eqyx0HzVi977zisXRZN8KpFgQm++JdIKiLhMzObeP9gMGviUjEGCd0QnzONhSrmIuzlfuRDJVHz11kiFKt8fzDxTHQcDakL+Ok4aAtt0Tcn/hdp60xWvr+LufNBw6yEa/1ro833atOr9IkgCD7ByX2MfZuZ3i5mkp1cBBwxvAnSQFsHlM38/tJDhFMFiDWGryw4ROhA1rpezpKbM+WApzkFIP7HfVMlgRkmSKitiEZYo9B1bJHVqTNhYgTTBKqJAWzhGLqfQsCnvzLIA5W6lrGIskU9Q6xh/hK/U7BhV+/esIZYD+HXcSRLpS++kDUHhDxbLzfMTckkUJkmpIJ0QyE0YcunpdH+YzVdVRclZPmRyasomF8AeUGBVtkON4bXvfPODyzdTeTujOuigrJraxF23DjQBC5PRIuNNKEPug4f1f/3L3kapJbCHBAf5ZdFZXqRnWxSy+VZEX6r5SKYLPFNGx/+e7vhbgfwe6NMzBw4+v2j4Y6g2tTGNAbugbOpfbHvi5aM2xxye0tdL9IVfQR+S4BT8+JdIc2szBCfLRydCQODqcA7s/Ta14xI07VL9cM0S4ngpxdI50naqZjntza15gARbiPSdUvy9npxgb9VMfd2xwPjuIiUcOkuteRMRzGo1buJRvhaQ12ZhWOvVsHepxgabEi4jG4zfhArSdofBt9RArLdu+c5ynH6cttcnTasV1nrY24AkkpCOnyEU3F6Zg2Ihi6Sn1GeS45jFuP6dLzhi7yla/5N6gjbm+5r/sdvHl0fkdgnS97D3WlJtv0c+sQDV6DmZwth1uy13awhFaF+SYF5bcYoDn256SNqC86fWNo38NsaqkGj9XYbS78UsdqNOZS08IHd2pXXfaNrSh0sQL1ixPudRtwKp+vi3V0WFUgBBcM6i9qJwsAEUwQKOM9TufyfME5M/RIWg6UN8WGBM/UW6mbo8XTQyTMtk/7BayIM5j/4NjZHwApimC13ko9Fyr7fG6qSVZQ73F0rb1xXD6ALtDhJAJtNIljGNRgE6hByCirP09jAy+pWD2sP/kSIGpmk3To09X3qhboI/aanbH714YwcI+9yxhx2ku0MKZZZamGQHk6j+myCBKObeHvotoZDgjXSuyjJaVeIPfO1/zrqPkC2TYww4myMLHJbGrOkpbZIjv6IYayI7hEOe4austz1ZBtG06UFCjTrtzerJx87+Oki4GykPtKpSGXXeA+5kv4xZiketnldeOR8yXbXVXarhR39YdLfmWc5oKd+prIz02UBSVwdMxVTJ5jcjEoCIr1zSkxN/zV2EmYNGL9V8z7/nuJhuoqhydC2L3eYI7hCwNTd5c+yAf9LbdIucdYiILrDfUJ7Jexmzms8H20QDW4rhHWZn1GgWgTTMG6BXjv8T0z95c6KtuIkDniNI97b+0HBWy18FK90B2czPsKjjRS8XXGm1m6Qg3WkKh4KjLTpbLIP3P3iTv/a/9u3O3aVUjDANyHy583AbdNlQ4+kae/tz/INmtyzFf0xbeznMRDGqfnREb9Q3j560SosCvuqd3CjI8vDmTnoG606bLAWqhLBcMctgfURRkPsYIvfSHsX0FKbTiGi9jNs07nwrXcotciuWhnvo6QYL8mrGKuqGyO7yYyagVpZezM7eC8J0YXB1zjU/HiTRJ0sL88OgvAD7XuwHJX+Q3hR680kG/n328ImMyG6QpKvlesKdvF1kSVtQl9vo/q8Wi8xiBIAhPcuXtGRArnKKUk65GL3IGd6p5qL3chLGJxEs2pAqfFEXwbuqzzjxjGFvkfjLvBE+RVPuGvYsxvt/Wbb/KvHvnC+6nX/eR2pZoRzh3tPSxwU7uy2l7kBu42G888iac3o8MD0E6Q0kspCsH+dwhJdunHzZzARfDBfv9KEs0bsnFGu96lyo0Xrs9sNucP+yxUhSKuAc694xo34PKJwQvSd+dNwi039a9o1gMlhNrORfvwbsF2c7s/EnkfDd3uhEfNSBX+3MnibwciQNGTozD/VZFXCu8Eb1wQ90PetmyHQAd1uEtuvcoTFa82E5ytV1w8915kxU3yvYVOx1iYIF065IInExW/1v3p6ILETNl+rHwa/8GvqoNmfmy7PhftXnTdoqh/hrfy1nf+zvgDsnuHsD11EscZPL8uK+ihtnh4h+CO8M6qC7VN4ujoNN22WOfmZ+0kZVl7rM6pEs9r9RCS2Uk2JLcqkdRyt5c4vAxmtrQvfRe630a/4acAbVHAUZkc7PivtHazmnEffWNThV8GvtXZcR86eeBX+I/T2BRujqt6NznysK40lzruO3Y4HS+JIc1vfdDYl8a6Ggm6KoooitTs+Er/63+kiNaXVIKDj+8DjXTOsCpbI6VSucoL51DDn1r8wHYvxb1g0JnQOOjcy8XfPDcGd3RRM5VKM4Zos/SEU57V84EABXH+Xr4DoiiHBrS6FyScpAD22/TiZdPTzTnAIkJ7DPnLMAM7/q5b+g/PeYaJza/y8ZfBlV3URzT6ihUWwSZvF4s4IM8JXpV2S4NZmy+y3p0FguyO/cff5vsWempNAPnShZz0YwB5o6urCANfVtD/XR7vbxHSJoytk5XnjLnDApwviYLFRWrfFDfEvkrldDauGM4qDmpeglAPWXKwawz0HtHrojsBUPbeMUuz54GP4QPhYYDj+kVIeu2gwxo5of7IdlCoZz6ff8MQyhpgMFnEd+N2lviLPXOyZtKRVPtOpdJTiE+VdhVTYp6g+mFwakWI2G7g++ifsC7Il0Y7cg01eALhlT42Uz8ap15D/eynUszoouOIGQ31PwrQNU+dnq0o+uS2EVQuAuZEVWPu7GNYu4epPo2Ev5jO8N7wwFgnbgu9kAxqcFHKowEwic5VlZyycagQ30MgXCA6Td23F1iImaPjjprr2RzT7eH2Otfb/flLPsrft8CIpJCy52wJW7A5Fky5V7XmMKIJyFBb+aESwjqRyuuOTUZuQdPoRd5ohAg4m1xJlj8PRCs/4QkchGDBcZpE9ab+1a1O3kofznR3zyTTm8MXVsNxgwGOdLmotT/ennuV0TupC2tAIsFE8C+ydh6wLlb9dR+9iul5GoY+GgVaZPAQ9ER67/R70OTvmBU1Hi/Syc9yJqnRbqnUJb5Zz2suMOrH+OMCIMak+2dfKCootewVIQGpX9QFi7xdkUfYb7DyXfZOSB08uZuFSYk3+LdBwWeYJcN4Y3F0A6PSHJaOy2cqqgSLvCBlMqrRQp5LqJiNkcRdMPnGHrzPNVSouF0riJwvlXLxNxRWGnTYWIQyw9uCRSW+Wn+daeBJXCFsQ6040oArnffdpymoYt4dyZcUZgzCIk890N+HYXCP6kYJvSCzBfSndzliAE0e+gob9uSsumGd9BXsyO8Ham44KzoKrH/20P3qZJ+h5xSRRR4eRJ3+y9c8mbOeECabGG758si1D1lYKstPR+aE9M8AszpOGBJdET9YW+Hs2RwPKeXApUgS2eNxV+AQ4piPRYFWiXXUzJ0SaxlnV6T3OmmxM6Lzy5LKNrqpg0o0fBcazoBEyUNcbOzibtYlMZwBaZs+XJSmmSIru6V1oIiyrpBDpoGm7Xs2kiYkAtbmzh/w4QsBOO2cKyGedZotAyYD1gko0r9XOP3SVEOV6GfgEeKHSOod20cZ1V8x0QtFYEpIhIU4+2F7N7WiPm2IB4TaSeIv4ejWraQybRDf/0EUZgjgZmyyc32HWjkHFoT40yQIg/d6xrDtGHjqBTwYJ3ieW2oRnPmjFIhKzAftZ1QHHBEBcGf+XHc6g8qIQr5T+InMDsnobVyKxhU84NXOcIo7fvisaFkWHtYHOWniTP4t8V6IV31tbgVDKFMlaZL4ZgMRa5nC4OJNpwOm9l/1/dMJwujYKc2ITAbUKUIXrMwW+cJYo4dMbuUXMIrhLOjevHi60jD9Il17GY0ZmISowXgN8tjpHJT8IZ5ZiJPsT01mx8aKJ6zEz1w7NGv5YmzenEe1/KmRlLzImXFLRFUbdgUaNCaKidQvWhs0ZjZdRszjQJlbFDjm5cNrs5zV/O7IjygUOXT03p4CLVQnZbghJr8fcetuauZTPzXcTUhv31Kmh2EGg4lvFEuPoXxf62n3zrtUNS23FcTaE87MNe5ZoqttIw3605L0WlaD8Ah9iqWbaXBVDtUW2cbV8orb4c7q91zwAaGoBKxhTkyJwLFQmlwaiWfhhYkh0lGxKDv/Qkwc4TGK14hptXpzE0dAYYGWFQjf4T6kqz9P8uNnvqwyeKyWHT2kRfw6RawDeFSMpE71FPrWHWenaX+uGUy6y4TSSR+Cd4dei97QTjfmKRT7eSHlAS5ogtSRd0OQEQExQ91Q3VSlLKrMyjPSJb2XIScky3YfxvLhyF8SjTiI7lXIRx93v3u1d+BX9X3nZ001dyq5qGbCNhj72V6Zijbm1NpumdYJNKitSEUKWlX6Hfl52NWjkF6+kGCQry8anKKbtCEYEXj4+uiLWX2qzLb/2ub170J4NzusVxbaKvVzz9R3v6WshRa9Pgkt6XxYBVdCbvqQ9AO5kP4K4HBAs6lU44u3CH6z3RAjEAsxfRoGVXUdQjxof6DEHqoSdoEwlenMVjk+vRmjwR8Pbt3oeJnf0ZxrG5lIJ++i8p+4RrePvZXnqZFrVdtiNkeJ4xElkz/HF1PHdLn99KhTdfZpyEgMC6wt99fZCMEi7820/j/W+OvwOuY1axl/CcykgdKafZMPrCsbwR+949igRIFYapPnJ1B1LxmQJsKJF73/NuCxnrMgcOI4uYnnH0fiVmsyzCpvR43RTb85+afisHlpwyAp/Ndf+MBtAERld9+MorWaMI0yG5mvsfpss6mpshDTECxb/yWer9ffu1hxFl8lBANqvwhSBHnle/njgPFwOn40UTwf5gxwYw1TL+rWOw7fGn1Ig4QO6eJw51BbVYXeDBgkyRqesn9sw23CQIeC4EztsstqExAvedK9Y2YmyWWahNfq5ZzyfInsBX9UKEtembsJgPvCz2AJ7elk8hFg9WbM/oU1McrGR6t8GtHBJgcTWObRPBES2qYZUEMe08a68QXPb+dFAFM5FOB/2OVGXH0C2lnp7JV22W2PgrrNDsjjwabkaQVBkiH5JtBxhKcPJTvZOIO6yclClY5YyPcujVnUbcu9kDYDSTmks4deHDKgID5NeGZuu56x075JhZ6BxA4R1FhY09XdP1NhspmxrsyuYmVh2p4vBVIpSzYl9nmH415cvZYkRbRjbwfl8XFdTRtr51gF94wAJrMM+nG9j7O3zJW47pZDhd0SaXHZSZoPqq2QbAuRgV4wsey4QzWxGdYbmuYEuaBPkds+FF4jhz0QuRL96WkoiDolAEUaSl2Z8lk1GIEeYmSWKyIaikCeU3kAk8MoMc9SGdUz9VJmSXVx8YCf9iDI8P6MOBCPE8IxozDwwzRMsyWVyGzLQsXkZN5VzbsSowuHWGpo3pT96FaInhVubnC95AwqjUXDOccfAs9jMYN0zmEeCm8yyryNz6UkJzWYRb/2BHNG7srKtL+QgoHoeyNuQ8fqclP+h36p1qPO7X6Ahc+ErufictfJh17/R/dLDxkQ24zMby5KwpxXvp96ARK/2IGBcI3SmgXq4MdAOys5VrMTIyj8csfmjTsbSe4REwFD2/YOeMspk3PqvyevwArpalR5s1yukPhEa37IQhX9Kv2auC13pl6v8ciZQrMbfTWlgYsl3sHJ796KQEP/T4VEU5TUF7/yYzVvUK+KagJKV9sqJ11HZYFiP3A6cjpC6aISfirRfX+/uCjupcuuWBymcEeVfmKoJQAxMW6qNQsTYgQh49vac2UzxKXkXYqYJigeNNLplohaVexHaJeeGjnZFnSoVIblwZq5HqGgPGK9YWuThjR+uhVjdsu00V5k/DTd243DnUPWJlWsHMZkGgKfr/ObP1h58D1LGBkJMmJpB/082oHwpSkRvga9dWlLmzKOKjUrP3DIeJ7CD8qR9R0LzBx7WLzcRMN/gBvRaPb10san1ZSKOTWir12jgOb9UPdmPkdcKdAPgtXUAjQ+z+ICnGgL+RKdm9h/Ogc937QZfSWNA9XVGDvLJeqG4/FHt6yKJ+PUflZF75G5wbAHy9uae2TgioWYTurb4H6wn2dcjeS/aZQTOdvWc9CpAAMKjpA1SeXp189NyshkZ0EKK+L8SQEkOMRl88rwSTusUWg+IXEDMc/pKulB2Ezu2qQYHvrDoLUPU4Ki9dH2Z8+e/w19IaQ2gCaVc6qfLL21cpXvgF6HW+RIuVpLaILm3j0wgXnYIZdQYkgLY9xj8AB6f1H3JXCMUCjWDFpQA9cIWUD+vpbXLDYv+77Xy3kGoY2gDQm9EtxwwL118ChhjhsINBa5FxZOa+eJ6QH1jCPoypJphvr/5P7B5hmux1v5FL25TXe/J6ZHo6s2cutu0BKlDOGYJBidDwcTYEC/hJvWxXXXTRdHExnwfxlhjuEHPrbkFrjZ7rtEYQBZzYcUg2+hgy4zsIsRMlyV5oqdC2Hv9oNRvsve1v/MiTxJ9dEwbQ7sLaJCf2Zkmaa4Ro5kOuHYVPMV5GgTRXGTevZvP+mv4u4yCDG06aZmYzUWKw9LDzeolN+hPzjQXw/X7DHxLXIV/EGwQ2w96VlrkTD+ZOh1h/zD4fDQFB6UZ1glTcL/HMRj38DTCliKvGOb64JdrwMyoonppDMQPFp0VkrnrWgiOqhlR3rrlZSPcIrgCchnNrIFwfbgxqT8rT7bTd4l9u+3QZZmHeEjmYSvHr3umQstMiiLAsv+hyZKJCPOTg7sncIIyB9sbHPlWRdfMTVJ7HuuiB01UdMnvQInvKpbmUwiFeqIo3v1lvd/2btf+QUo6TYws+oAgFg4/aLdlFE3SYUvXfve3/j9Yl7bmgTj9R0uY7AI+4nnre8zYjyV3fQxLaozfV2UvxVV69Z3h+xosxglC09/zcmH16m0R//rVXv5pRv598dG0uZFH4hQ83qAuRgVvdg/3jfX+0mDHVGtgms5fgzJI5rrFvdMvUiymCabBbjJr0hNFVc8ad7JjmPJW3s8F2nqnjQflDQN5D8xZ7PDw2v9DzqrTejeuPbeFBER1vzUw/zw7rA1XLo8NzxKBmdWeJiAvGCacvpATG2UdfroAvQzZ8aCMgGzoDVIXR0A5Y7owLxSboUThznJykbNOrQrxie/ICSblHvfDZYmAUWlCxZJA3wXR/Q+zbs+yO2ktG1aCD6sPNdHirHREYQ3JUIWtTqdSYIH0MkJtq2e6SmsRGcMW7j2tBIBAEETm88Hi3JnIJi6jCs4bbhHOqZS9a7s8KtTEOHwGXfCkUmwGpWGa49nBNUVo9GK+KYIhaght78vcM0BxZyeEiS91wbMDYs71ZlHFzTtUV3qcEGPlLoLNcDZ3JUCErJ7idvIfjDeUVkSFQ8Xwu3aqIlvNHbahixIWyQciAGHBwQnJjUuEWUkbnyHvb31BU6QrifZ5isMd06MBVEbQy5Qcu96UAQs3+oHpBk31VO6iy4RO7K2juQ/To9HHdEPym7UUJSb7lhTI9zke+Je3Kd23ZMtFDgmNwPOyMyLQXRMJ2RtCYvfMtpqLbsyMcLWHhApsY+jgFqmuCYHkY21KC6qEeIC2IgGy+oAQt5pbvik1KFhbYG0NrkFYFS5F+RsnSj5W7PepNaC2X8abG63/iGHscxSEmMetc8SE/CX1jXMDadNa0nHXmgVTZT98Crxx+mjogoOw7VW69aNrYNPXcrTG2UoRFE9Q7mrEoqf/C2YsfeMEmwCyB6HA0H8NZQ64zuZxNBslSmeflKnt/SIQ6hni0aHnnV42+DqxFOf1SdBrCuuiQfzD+k9vyQ4u9Ahv9VrIfgXkFikha6rC41ZtwvZPPptiutISVHOhMadRyUAAoxvumh/tTAYNVJLHt63tV7nA+mgSBnd93D/pJ9QfZesDPYGhyGGSV/sh2EQmn9bcCf5fQjlbCw5Inh44gb8r5qwGz6qWKHkYSB52DaOojsGKQa51iuh0B1HDu3KRYl5ZHJb7OY6O31MfBwjLJekWsNRqXb4OZN6dAFtHUhQ6aNY8XiIbMv6tDyBFDRm2LJPy6zUHmqsQfo69mvCKDD+3ikV4ufL+C5byvP54bldEb3QvAmJGH1cQIS37wZlqb/7NEqlT0hV0H8abuyEBlIrhJiXCPHFpoF77oOKNIycHEZZIG9kpmCHUPFqb2P0dOwejPvxN7CUQt43HClogpHOrP6IcxyP5j7LNQQYXMHlizQZiGknmafIANx7/YeP9VWoc7gkbLBi2pOzTRZKSitUHdDuDVrFzEZJsNnxrJ3mbJCwoAqlKh31j+cyNhOQp2b25e6qi+ahx5nljlyXYpKCMCFiaXy2+sqR7IrXGz0ygP53C9iM7+D+/D5nK2HdbLJV9HsdjLhpcOTwCen23GrJrLpp0/3kTYOZQBz540v0m7/x2iUn60ON3Z+LEeIpdRbdRffsNP0lRI2ktIDTKhiWm8tB1ZIOYkWlZu27hF4NU7a+ncovbWUWnlnGU8tiN+PZ1r1SFBWkbJHlDpT0TncK2ndrUlsef4dMk4pZgmG5HgDbQeT/p0djJBt7oS+kGngHcRDIpIYf2Mu094v8fN0NotTbJs9hxMH5KGF2VumfBa94svGEIoRIYaJABsTM8Qnx+yXCn8kMdqgPHzr0NP/tKIPWwKlLPK0WYOxm3rOizNUhoS/AheHbsVe4Wo8ZcKe7x4Hw7IKDAsXyoE/GNpCFZZEDRFVhLr2LOrPMg8iq6N48v17CuS8AGSPTBuEOCxl+iloAskpG+Y1DqG50eO8J/CLLX39x+4Iy8l1of5ke6oh98277DJ7h/WUxvq9MB5vJ4Usx28Ubg5FweUACoxZvLPzyFnzZajacnZ2gu3KctbRIkwXaKjNfCjeX/47d7HZybc5sZCTalRFXWcoq6D8FJxOYrLtnRcfgi+BvUkTNJRIpfOIOAH/J19zCnbe05W/M05X0q1uhlHxSXlP1Lo+LmXLO51agjbJ28sAhMxVX/lP+fc8q2/i05lRjIrL/cBYhx59Q4lkMGK0x9/rVUJuuXM4BwndzQ2Ih+7lgRbLDvNfguJMEcwjW9XV/in11S5Or74za3N1/3xoNua5cJagF4N0FH+Jr16vvkF8MMiT9VwsvUjwHQhbB0QZB3kQTUWt+nim8nPsFO0mrxpr5p5NO2XZJQjFBLFVeWUv1dSUge5SEXSl8FIQ5qiNwLMkVdG0vQIiYa+jKynjh+7/MKsHUq7xejPnlm55uudfrR9ch4ANuA6gkKqQn/5gLAzQzQHPx1EZF9n0oGQJR+OsRVr7Sv9uqjM8kpYLkjyxmpg3AnbTf1tyYdZ/DzRnfDrcIPcoTYZyC30kcHr9quV4d6L4OaYiw1Bbreg0n/isgeIPl61oN2d0R0AAeNxES3YIkOoEKlatZh6OabozuzfEzjEj0jKfLSWLE4syeAfPQYVwYUHIOCffskcI/M5aHpPkNAPmakAz8KRx7mmAT4rOFq+KoBGECwGrl1qL957djMofCpbHDsp1jfM63FSUH4dpM+1hgMHBaq2UgvlYxWaOXwfdoanEbVg16yk44rfBPvhAr48DMJxDe+1rWMchL0zsVPX6i7xtHwZDKe893SKI2Wz3/QuyL8ZlTTgL57Rc+uWVHh3f5rv0D6bA93RlT1dDZ6amMfxFvVIB6lDgKYDRklFCkx4N125vqOE3dHlm+z3vq9xDQh4meFmqdEcs1EN4WStViz186t8yI5zcKglRuYkHyn3AsTm+7SvVrit+ZS6Oiy+GlB6N4h9g2QSmF6Hfr0jZmT1kNqsl9AwwUDmRwgUfYuGA0Y1hJ+4+zPkaDOgAPnHsCq1jVYKBVEZ+BeZ3Skcjw2RsJGwkQY5lK92BZIeJ3sT0judQBKf2ONpUpQadD29Pi0AWZa2kci/zXeEnXpQcXAfGt0fftpttbMxn5K2uHG+C+2x6MYId7wONQXtuJzEdc50KFu+V8OTGtkWSZA9A6I0uQzeS8H9HUA+XaMG7Fe8hwN9NfR7PzJHAbtaJxZteV1c3NGMBTAMt7LeyTOtd9TV9MbSoEADiz8/es3K1VOiaCpAjaY4gt0uyaJ5C2RnXeDao0n4/76ybkijLJ7reTeru0XNXKTDuTi4mvBJcRzxg3MN2te6mYsOnVqdrOzA26oTPIHenyuhT8AcfvsTTCSmbVaPUmeA8tsptWGS344HHg/6VIGyqvt0mUVv0/XSqI5t1fbtFpoYfUCQqCDjJwvUJyJjakc8IE5cZy7nfONfczw+8yH7FzVfhkDcZwV6UGJbE+qA8Z9GnjzgXZf6GM6r5TjgmU9oRIG6B9rGMGrISz2Ja7scz99fzf3/Tw3sk27fEfYYP27leCquHdU28k3N3UwoZd15oN1D2kEb5r2kFAPM5ZO8ZkqqzfTtbzFirwDkd6C5rvhN7F87YE/cO8GigUcpyY5CJ3dzJiZbiBLkKff6tqpVHLkdCryvzAgWrNGgTB3Y5Jwr3tj3kZzVtubaHRPRwhJ6ih/tN2ezx6eqosDQyUufdW5rE0zUaEUh1b5n8pZlCncdslJ3fTjRnc1xowLM8OqHBA13b3HniNp2vIZfTwFz6L8Ol+3lqqtXYBh3TVGhW+Wzptq+fBva7LWf+GU1PB26S/Rs0Ksv7/WZvS3ffxepKlebp4tC1aclNaxTtSwOTG7r0j3zDZorxbfKVyFwA0MUtJCex/FvfutLQoCy5S9cPVXir1xT4wZP70EsIgG/bxDDxErK34Pj5iq4ZbdOgrTfLxHDMcV3AsvdnbBhD1CPa4Xh8B91M2q+wy1afSvbsw7mVWZf7N8Bdo2jwfKqkXAxC0f/aHwNJyUTLANNYqfdFg143hT9o1twmB5oP/X35c/mkjlI8N+tnP5OJy3VleFV8j6W0bjK5btvK1Oq+iWYqaAV/Sh1RAZk267Q/SFSLQg+gIe2Z2OJklgeqG5lrMXKd8xZfJiTjgHKEL5wXFfwGg0TAjw8JuhfO3gVspSjuFsSmSkXnSk5gFejrHhMMk2GSReIcLkr11cwY7zHhhjcGiXPAmcItg591lPzW3jZDB/E03xCB+SYNGRCmO6pNbplhnYbEr8v/lgB61HsH9GwDp49cvnNVQFysv8I5pgF97dBXHuXT+j7E3HF7+0vsRyoG3XKnFrDAOupbr+qagrVMVlJTUFXCpPp5v8TIooSl5TH/mJxAfBdKDV2m4J8fsNr9ynTsiNN8O2/oWQfhNcWFNLmLtZgNgXmCZG8P9qKYdt7QmGsUJHWOivevSxFAYsGZDG/410A+mksTyXap7RzZVP+9Vame+xTG/WQozYjdWEihvo1WhXfYgn0OOKKtl3x4I9AWFgaz4PXRfeqxDFrhBd6v91tSotP1L0q0iWyLlB6KGt65XUzm9RJ0UTVDp3ppOMHzaDVgSzU3GyXqll7mU7OOV3lDe6v9YNB4iaeOgmQNk0nUm78Swbp7uHnO6qQIXb3jdhfEiEG3Za6kyaZJUTy18ppWsIG8BDrfIQI3sfK4qw5fMJZWYH3U/Xj7I4TqJQCyqLTyoFhXu1gL3wc2LeT00X34nxQFB6fFhms5jw+YqM5vjtv8uIptg7aVP5ercGsFngtXPO6RorUNzYCtRa8cdJfjH/8AgA+kyDlCPit43y0TB/llcOQajtGY3/l29t+5Vnw7GMq6SXq6hVKDvyL1U8qTRXqXanrmsNSRGvK5WZuDKruUO0CCV/yO05Dmc1NBykk5XXttuyYvJp6mtMKGxSoXSWUJuWQ3pVLI9lMqmFBCHlEM54/1C2SjdoiGpASQeywBneTsaqvuXzf6e2h1NmA8cmI0Gekz4Cpm3y5J/Db4VKb0nCi6+vij4zkCF/uys1lbpsn3d473GM8exrPUlMVcwAhIKqZ6ciVhHcz/cgxU+HsyWcZ5VHKD+u3brpvgV/VyBjmh+xkO+Ua7Q6P7BKJ/DOlUoJtJVROpIQ02D8gwMowZvu5+kNe7aXT8DGX4LbeA+4/Ws1grd+2P0xIigLcGDGGyjGaSAkLk/IxZxYOGnfXR377CqgX6H3GejpyKqMnn31okHQqtBodsiEUNjN0zrsCY1G7SKraMgS/J1hPbtg0YOCLnA3sR9z9NKvEwBbRjRpe6P3B4eZxXTsecOF0IUpphtuiMhh6eV/Et8ctC9XqeANV2wybzrBYfw9i7YJDIBegmo/DChIWFSlsz+NESv7krn5nG7OAcLHFmFvBUMgsPZkoVW40i/V/Le5NoLJsGHFBmob3EPqgcTgKJws1G/IcNTBj6YPUG1Bpaq1YzCuwKlheL5XmpTi1v56T56V87cqLFvkYlYOd/tLNfBHOizMdfoRGBJAvwWPAVQQF09xmizcVekvXVOT7ekTweayZUlldNsxr1V7DLbz8f1IR3vRqVRKmBBw+5Rem45S/ofSKU485Fmpc2WsF1Uq23ykjYh8i4HTDdNDIkKkPDHKitb6bZ2Z605xoWkau/h2eTDbxnNAE08CJfEGavnds+7y0Xgv/jyq8ZF3IBFU8IS+O24m4MI22CbnHBULDfNi0BylgO1n8JaE7UUszW5ZYBbb8nkS/8IJiYwKuZw2tecwHb0yJ6FchNzAU2QPmEs6l+UjvxjlkOYpxuYnTMrdPQ8xWif9EfyoOghmktsp26MX/jOTh4SZEdDdU+l/g4jyImjGgXLypTPdFh4QU3xiV3sFjrdEjpi1L7k6ugqwgcdfqMiEcd8dDDoNVcknZZAxV64l6dElFOXgWLzD4N/+IQ75hRAbxD3lNPdxYT3pSfN+N8e9QOuqI2/lCbE/y/IaXWwL51D6Knatc3rFJFYfNDjSKqkMFo6gMwEo//UY6lw6OHV0PTjKiOdHWrBCL7aHJs3WgkxIfKiG+hPxsnj6Ul4QoTuln9Te0wemmaBxI7puEvsX6rviMBCdbQzHYT3xwIuua+UuRqBODx8FGve4BBD04FvuH89dFeNPIIuDE5g8nIRh4YifLl4YGiYTICHzYeENWup7+jJox/4mv1+swkBV11+k2u3zWNKXOadl6T942IYLJuQGp+XvHmUVIxLsa74N6R2uhrpXAjlW+H3g1Y9uGS9uDBZil5AHlEfiXN3TDpWZtGnYH2JHOLBFD8ETwjF3Ny5PYS/yqzWfDVeK8kfpVUNE8lxMleZfKQ8QmzRcUmqNzWVLYdJNBJbXgWVLGIEn6TsvlhvBujH0UXJOJ07IktvzDQl/JTnV2dAB+hIdMrfFERFyubtEmdofQy8b0jK+dX49NOdO7MY3R+PU5GDARKQFcQ+ETVv+lfYUbXGdNLWXTFNgbd/4Eyj+7Dm7UHxgKFezsxVmXxa3dFE2DgixA9BxbsmuxGmmwzMDTEzk/UDxPMV0RKfzBcoRJr+x3at8jmUEQ9F2yOGkqQmkhbSoLZ1s8hjHoDFoESZRdLOCK3GP1xA50SyPX6Imrf7PvygoZQi5neDHaEEZNTO6eZv8ea/uw0mlDtaP0u/Enuz8cB09IZiRX6GrkTPSr4+NTdWjaxTIRT4Cf658PKrqZifdUXjXHiCsBPAl1zrM0DyyIt3zom08Brfgi79uUiWb8H8dW1Q2/tL2fxG4AYfQAoGoGcWs+jv2hzrjAOwIiEGeuESwnzZkdY8lAuLxTzjZeY60XAdbs8fEi6T5i413Hmr5Wd57ttNKLFiTbjEg2AKfW2DmT3k6lHGotlaxkPCpBY+5bWa6v6VqsYPRh5pfVsMAehjS1qF5zjfjEUlhneP8SZqv990JgRgCA+VAfOFGsQlZr8oGD3Yh4d0yNjr4aCJRlt4CQtWU3NLhxhkezhWgNEus86nhcOopK0Fn4p/ZMhqFB363GFz/9hyzyHCFwnllHb2cglElO3QEpgzlbnC23J5PX+8Hv5wi59+h0jAqLuXmu7WMN1cQP+LAGhL6kJPtC07NGqdXmLzmL/vDaKdJkNf0/p2UTodk67z40ACRY4G/4chufrSoI0diZAYusmYM3Dllsl6P0gBijhCp6PHN7RID5h5y9z7NR9Fe44x77bVIbA/oNffLuzvYHz9ahoE4Xc2BUISy11f5qQu/GeSlr3WoVfkb4a1kg9HOgpD2Ej3a5Mvwwk4OHS1LbfEYmfZO6mzVWe+80tlPR3FCl67pEtl2jpISGog5x5k8d0kQJ4wK3SVq7O3MV9jR9FVXvxAzNepBXUHcrj8Xo/4cGJSGalSKJSlJhfVokpWk5WkGnyxYF1YrSMzzm10IMhW8rEMQrqGk8Qszwx7l0Zja8yAYt2MPlYIh8M4Em8h0M6N0Sz7GrxF1EjZazrSGKmuO3XDNgB70FqYboAD/MI0V1cWUH89+CVQuDOciL2OxZhVfR4YbevzY+1CnTC8l0JAM4ZeNYNYaWoBhTb9IHX4gTgRbOqfWLnT0ut+2b67GD3kd5WXec3dSWFHh+OSQiSsJ2gnaBidN67FKVY61Im6Hq2xbhWjNgvimcrpMWL89cjoJW/eoItC2Hh4EkiQOHfy/Y2XT56CTVi+kwpDco2gcGJIYpuO/4OGAXSfaWJ+wtwJ9YfSow2OwUqkudajrjrGirVlWUp4HuIvvCbqMwVD2S9V+Bk6O/iRQOhScTfQVWmYclrib7688B8x2gbSWBS1y/V0MqfZGNJ0bZ8fiK0oXQ+DP101iSsFzPVjC7lfDjsttNBYesWwRg/FJhVKdwv1ql+GSf23E2eNq9yaNSOL+AD6l79t+lCiPS9/osZwtwmry5chhCzYpgn+6amXiG6MLXvRMk8S5lYceMaA1vUx4s66TqNya7jXgtTzPK5T8IyCFhraS5QzsXmmgqj5QDRy+t7pfn13jAazBVw6DmwiYRKk4GMi/Wxy+FEKQmKuDAcJ/CXxyBCAQaYlwk80s+ZNcmaPeQBCsB4g33bVUiREX58H6FXCITvc6s/YSd+HHMQXjhu5N+pjsv94B/0D66u4BGdUSYFlsQcALmIxckRV7Nj2OdTf+PUM37dP8BYEkGdNwFeL2AzLqUvuBF8DMjUibkWY7tnvWZfCTyyFsZf/GX+W1oy4GBBK41L0131eefTjEVULVR0Yk2VCymakKea7NWChcTmW2BYqHt/hkPHmIBjsdBMnRCgp3PTaKusBgcDbyDsPIjy0/+hUOIIoppKll3zBjki+1G33oXotMzx7Hpad/F0HjASPQgrw+8n016/Vmv22XwCFTW9uwiFEEo+hTrGw5rDIWHBaqxTj70zVUvEfGukzUHsQ/COW9JL05dQ9LW8lwhlUtfoVffPU0BwI3dCq4DPQ6T3Bqmw6OO1EwkrzSnz7wOQwp3MK2Utsh8d7HgEWTbiTpjdxFneEWAc8MdrR2GVa59G8/JnZXqOsyUQ4yP7N8PfxYjtSMC56H5pjSSbEMpyYCNxVneyVsBe5jDUUJyYCO7vxB0KvVvIjULg5ssWB4EpFH/iBYn8f7OKS5C+EvBb4tW/azefRtLWmcrGjVaoFow6hke0gi/qfinxVxhV4D1kwkdBf4Qf1t98UOda2ffH2beCF7T/refPTmHQbdvgy5FeiAAmOZur2ZY09qWDkVpJkjJo50gpKjOsCYgX2v8aRF8yNAeMsMAyMsTgatCqewvIkqbKkaLnB5o4Kzjt9xHVRkoBsWkDlu48QyZ8voamjjSh5dwBS+LxLCiAFIH/XmpMMfuAz9uxAf4wiqGjeEBleC6IktaFCtKZvQC2aTPFq55LRuUQHyPWv39DYlzswbaef4MYLRpDBzq5CsnrdjBCiljnU91hmsVzo2h5oit5aE+58ybm/Yb+aE7/E0thU2CodgcG7s+m/qw8oRfFH5hMDhTFgMjgX/Hvvqehdy73Y+8P7d8I/mC2CReheDNrTL+l0/Tu0pzI+y3/PsF1auwmqKYC9KzWkT8sM1yfxgO/bkLHC4k/8gHPK9m+5q+c/EObgXy16dV9HorSUS5k+o3XMnKGZAQobbOUV8qVC+vwg+4DWzDRHjHaiJf4zAuoSMG1fFOxEA0FGyqgWtuOYKn3ufcMdSlwzgLdCbhlDMjTTlsJbfrZlYnUS9C5c0sB4vYG04tjLOlq56vDwEfOckWEC/uVwqdnmj0PYYAC18k6oDX0P5vnk5xI5KS/nsojaM41367lPv9q9M3O9enH0dpVbABY7mDGnb3TeIcJ45ED4fNClXFuWRUYAI9xkmK65im4Qll5n9KAtOOId4fM/+2t8GuJGMEeGn69rJ70JpiEhQ2VDhpRNp8HSDCCMadmxk9gbz9ig6wqLnMz/bU2zebshi0UhOVgurao99aP6f197DL0NrrjH9C56lOUCLSJyQ8p9Wr1S062EaQ5XCY8GyjXQjVTFYK7TkqJzOMnAOJEqIyPIAaj0NLn/cirNAcGYvE0W24A80zLjtcdFEm6Ey9WWYUgjpYsQ/v0jMtlYhgs623sPt750T3/qNxhiDpqzQfXgyoPfCnMnlansCnh5E9iLypYPXz0WMuZoJtmkbDQkQFtZGdSi2cDn2trrvvZOe4tXh1cNXXAJcIy2pD0gS3EM7yJTrgXD6HUoI1feUl5IfXTQMpYMttHBfMdsMyb6JLAeBg/0inpZioI5ig2q/Kzs3zueXnXwhU0E+TvdCDz9WAJlE+n+ZN37BL6T1N0RcL66L8hYSAA/KbLQdRM6h0ytJIDX56Fs8EefC5oY7MSmWIQaw5KA3njNfyZlDJqeBTt5d6tbVstRBsnQcgdGx6P+IqVOcBwcRNgRlkjgHMr51WTp+pUg7/Bvu7QiAJIkEqXMETh9HZynEbC+i3kA4SOkCA+r+/dZAjio8PNUPklh2GE8yn0yRr4LWaLRyS0SpAeAki/VG4XidYR9Wp8TOaJSvICSXOxF2id0ryULSoLqgFELbnuLCTi7uD3Hrep4HgbMTFnYNaKPjDp90g2U8vOqphqCwGsPaobzFT1xYK4SZpih0VkRnt1DELcEjC0b1cEeyctMt92QO8ZPy9HxcvQNIN0e1+9TgkojEz9uFOO6YWoFD6y9GIb4HQts3bWk417WsQnXrF1yUJJPKiYhbVHBc+dLFSMQGZR2J3KW8LZhpuHqbVw7pEMbPpJbI+Hdx07ckYLGmzUnogsg5VGon4BrJXXDCe5lhI5Jx3ixMhT1RZtOCB3dAFUUNSEDyI+umKsq7jgM0JDpMB7updxp712V0iwufw//gW9+cTRZ5x1e8GpYjcwelHXNEZycUHsvXh8wrkgLbatU1h5zEId48xmkiixCEFzX9hldwBSMTlkRuTEqOh7OsWEuGEq9Ioc2p60ruZhKrsVougOguI2HsaO6rK3vT4IwY72oqyhjxp85IqkHUMq94VTP9/5XfILGYB1SjG4Vet51nHMoM0YNHdyoBdtSjmaCbXXsg3JcU9lOa24sLzLf7I8inXYjNUGFhc0N+Wn8BRRYUbfQcUmfx+oPJvZ2erIrqpdG+n5+G8/lvvrQDgnj8g07JfP8TmyFUnTurQ+ihArN2MGXkD3NKR/cty6hDA92Fn7GastM+tqLtOBX2//DKSTSJ23Cp8P8nDGzakE7xRo3lG/7oayd/Hs/MGqWC1Ux4IdY7zmYOA4tFWcEF19lDIqSNQfw4J82ZqWHJycXvZrCekh2zgne/19jshHkzHEcP4xOBCGY7pad8kwAH4ROiMQ4uN4iYtC2XGzmG2fTvyxUnY9S+UEIyoZlg0u3cQgO24X+Nz2y6t8IKzfo52WkShvH4tjyxoprWq+bceEeHLfTh8iFwYK2QSQKnZhUTRWTsaA3jsNis4TLQGFvS/TopiXAeuo+4A34+Cbui6n/cp6iGmsK6k9YqlTBT0G8MITLEr4DhcXf0USRCf2wwN/5ORSUJmWR/rTIUKzYnlt93hM3Dmu8+DT7/ZcWMS33MwSSoJJIqv6RXS7Iym+fK4oxjLQEINh1AwaZXn4PLZ6Aj0Obb8ebErfAVDHC5ADzc/KlNxl1dEQYELzDtlVlY1hihGs3o/lX6Jp2jL0Qf4BFLbMNKmePDlBGFMPUjR+REZGKOGENsSJMNebmWzIkVqWr/VuOfv6Wl2Jxgra4Bu9QST49kCzw115bWETC9F/O+/NDdpIsi9kglnTwpHgBivb9kwNebTJ9BkB/quHBipAOzr8pxzXFlpzus2ma7/2NCVOk87OS3XSARgTZW/1jtH42Cq/IGh2dpg7kbNV5YdC8iEGr81Zs/joO9oQJOhVKQzlWcq6IBNO8L4LnQwIyzXK7fgwPul/0MswXvUn5DwAcfxMR7pyFG2gFTn6pTGAqs1xky2pDt27yEK3HhNFxLxsdmMbIznU072wjrO4wEmIKKxBJyYwbXYTAjYqgB3xGiW5dSaAovKdGabSMvO52X1GvjsccXKnYi6nR8r2S11FQEyhn9x04yEpXeYuTOt6ugNuzxpDzl7zAX4P6CPE9jcfzTl3NBowEbCM7W43pxbOrLMhhaBhvgVH+F2/YiWTIlxOpYxfR6XnwLVSGxw61+UswE0NQms64JhFHkVrrIwLHpoNFtEsjjFMHBxEw4/ezogY/3y6FTHWtJRt+Wjo+gIB/9mDkKoBpIAHQitL3OqW17NqSDw7Q8R4P67n617EeasUDAdkqeOFvwr7BDSB0XSRRaNyP5IArU0mLS8qdgKU7cYSY8WPhZOaK6+Swo034dK/BKWMCROh63JrzLBqdQxx1BDoGI10+7R4fns50Ia1MSNUhBsxnKko+aiPaLq+tdpkdSX7OuyemyhEL0ITHpxWnFpAfSTyuN+dN5yGjPlO10huKywmOT/Ui0dZ0t66zdN+djAdoUzUtzCav2SaAt8oug6LhGgaRyqHsY3O1xcuYEd3RIixEynwHCC6nYNxyG7wiL5aybHOzj6nYJvgJ7ddPqOUSFUNzObFZ/R8WyCds/lx+2BujcAZxw00bJ43N1hiVryeRR/p3RDeV3lUz3HhZsW7oYOlSEB0GLM49FfTxefWBJ8kCLVC2KYmFPWWaeNXSrQ4/N3ul3u5sb23Fn2coqzQoSbmpNrbCoEvI2RPvjIrl6zu78ttxSA3XQlSoy4IAkKE4HYnG2db4QNuiafm8w8xIyUYEPQBPnm33EvRPpqRyK00kLY+MmF7gfAR8Htv2a83ftRjImw3WQzV75yHZjtlKsyBuvmoj7M5R1rs6L5JvI2hIJBU7SWq1hpT6G67FECiFKYkQKN1yJrximZ61Afa5rKbZDBs8geZ3+2shuJPUsMp6qOBhlHB5zIS/miN+3wV9kp2V7LlzXU1r0+HYT2KIiy2xKApdMlJDTM8TmIIm0uovTFIFmRBzbrhaaZ/zQwaj9cUSaqWpb5AYznEUIZJZYT/GhjPUu28+noqlHnb53mCXTFWbfBHnjLUrrUu8oubUqQVifKvJFgMm2LfboRi5mHO5Q900qG0qy6958koQwWmzhkXyxbKOfBMpSAwDjXSwsDNylyRqGAaKJwXn2jXxuh3awoL03W1sUTtj1je/6ArFvqsbHG+/FvwkSvByi1gMdpWii+9KvOAFLsAeicoqdhTSrTxS9l3baVaBkCsSM+2bEeBmfnHLe2o3dT34rVjOMUh5+4ZjEDy3qiRjpfpP6RcxU4wy+2f02dPnmcy1nAH7J/4hYZE62Jq7RrubkaQj9MGqj8TMQRua6uzxwXTlrpTxXhz73YZMlhMFo9XU8Pk+J3UWlVZDtgnfMN0Uc6e78bxXPS4+QWjfiCFtEp1bNhdewPvUpRl2oUenU/5kBxVXS2FSYfupKVjOj1hV1Q9s1FRDxD2JjIR5mHV5j7paUJraPUlMNCdakf8oMtKQDa0q8wt6553w9ndbKBTObswF9tI44hHqGAbYyYb7T179ZLfFa6EAtdLzq9/366kdfrwlX8kk0b/xE358EoK8m+hzUUZ39T/+ArdG33H23XemMu5vGSAqpIVzBbezQM+K8KvAhH0Un5t+vBrlniFazXrQX3PmLixqAX+5omoUVb4BGnXaMXWoI09Ke3inVlESfmHr7h1pRq6uXhdDTqlXdJ8JpYwXtY83v5tsHvGhojrad4diMC4+JqPzxsP3meD5CowAWSYF2PN7iPLT7zqyAhDryJeXGObY72889Rc9FuuUQM5q/tYWH6hNU/lzSJZwqYTc1WQQlze9WLOiRnEgLjWfDaHLfewJGmXl3eNGSJoGEgDLuVEdy8g51VuzlplvN7o+UBgVsbEcYTaJ6QShPzAOFVgmDbKTBCebxWmoD202Qe63w3AEO+iTjNQf/lQO+p7x6AqGMz5z8xBSPP9rAuOAdDkP1lIOdqqTESQTAV0ZhsVKU9p6z1i4ttzcDx/9CTtB8bvf3dSDYKwlGm5fALBFrzDBMVjPuRcodVl7wN7/zr3bp1y8aJCOjYW+irEtuF7iVjAleP1p05/Jn6roIBFHniP8hR4jFYZTdpqCyZ9eS9XuMnUdPp4R7eYOt2Iq/Dj/UhEuZNfSfgWLgMTwguwfIunuPFcvbs+asgL7C+sQZ//CDCSjZQFEwj7LA33MOfUseq+qWQQH9Y8l8SOULE9jTtTPKOtQIeqeZ1wgvbfM1KKKt+4zUrOk1P1BWu/bGgL+HmgwH6zaoAEihBTOUsnfORJprUerv5Tt8ALxBOOTGQzLo+hZss1Mv/lrOqjr9ITpXBdKRQTeHECCFPazqBPdlZS8nONM5+DUMbfqvjkdyauqT68MuaIpPYoKXyvrcJQIleitwER3cR50SdnE3iQnyc9KzSHWKUDTZwcXA5qaIYaLbRuyUJ6YLhYuIj7vLjkmID8FrIsspHUYu9upDDo804Q1b5FOqlM1spm/+LvZvrNIZaf8iP4l83ZPK8RzR/yFfvUKv4guAEay/Tp4IaOUfi/mzANXNLn5S6p7MQcY3HIHU/hgimSo/zM6z8F5BO5zg6dL33x2aJr1drNVrnsILnojMKvN4B1QmplSv+b1rkx6L/iI6dI/DBXP03z4GQWskdP4/rTYDXTQh+0H4T8M4nA1tXPRf24tLdV+hUCz+0k6+9LznhsQjF7XQC6S0jT/jQYRCuql37YDR/SKvZkPOHoF5I21tAulKZkuxFW3x6skayGdmKBOQxlOLvZTLiPe5skgkuSC8Srf7iQ4mtXV6dmF6vatHVXF4ckY2Co1SHfUMTVZ/f+Ka0OMZxByLQ6pv7sIUKg6eHgPt0uW1ggRCSjdlCLHsG5OZ9qxe2VN3tvAr2oOLDatUe8cs8PQqkPxGvAkJabGMtvz67e2FV+sjqQSvmcMMAseP/OlmCtUNAyzjm8BaobuZ8nVGvGs19BHI7hUHzaEuOExvOHerRsECBXX9m7/DJbX5FSZKDYoOImgjIxXvBCOaM+MN1ZQPwo1Lkf7R+jpzRbTZtMPZj1oBcWzEy37micMyG9lx2qJff8KW/hM6GmNBx2NIzVvujumpCSLukGinszMwfhf/dAJ8eQxbxhOXVWHLGrxE5THrL+VaE3FWHOkgqWb/AOW1o84+bwIFeUcWgxk2vBVPv/hIErlaoS55SsXruQjgo83JgSIUA0wExPN++4P156h28ACJ3TuSY9ZWaE3Gs4bel822gCan5vswc4CG/+VYkig4tr8ok/CREX375CwE8G99/Gr59q3qutpxQzmG+pk8oF/vjbuGHnbbTn2oKIqHtOMJnKDqg0u+XlDWebLAPuXONxtkDsj8fd0VD749tNuIICsvDa6oLcAVQbSxh7klm48YA0v7Y/73E3S6mq2kSDThTcytcbU5avEWsJNpZsLrYsH96Hrr8NPCTP1DTwKr/BfXkqJOS/lx3DA1KnqDLLkQ25EMrS3RNR4SbUP/M4w2ZCNTC+p6w9nSjjtoKC2GiCp1UF6tjC9rARmKfDH9hoA7UFgpMyQkcIG0FEpPzQNfKH3Sg39UVb9/vu6GrvL3lVNhVuqmj9HYAkt8CXHUMsoBsgYR9noXVWscrqCotTrsQnCCJWnNqmd2eEVhZDbNMdAyZsC4KKVUa/+KG9DZt9edKYwDqQQOItv6f86TgETr+w947f9Zbx/w6gDRar6n7WCwrGx3u98unZb7EGIewPSS2M3Th+lRqaPxwNrOS7vQ3wBb+k0n1Kxcm05Cka9/jNSVwknegdiC3b+Yc6Nu04zG+FCUSmCvB4MgSybLG4QLrQ3uo6+8I8eZiryFu9oqAgQg6pL6YCS6sXk9OtrIaJjqdGY1+ZDdkKd5fjhF4yVns7JzdX5d+r7MybOLNQ4tZmIsHygG7+kimo9pJNv69fKFy735DvynP4kidtW85YG3FDmGr5Zo9D5UddnEFlTy8fLw1gmLm2kSCe0M/ETH10mIuw85Jl0TYDT8zrmWrvsMVrz1BMhdLTs6PX4kj2i2fgXFkWQrc/kq3IKjV8FESpuGxRy8lmNcMWY6wP5jIxn1bc+oCNA9zrqrzXIQ6mJulmXW1MfvjSx4n4cNBBHY6lNJ6kyvCXf1RNEKnaUtQhB1D5j3/GxXMdSvAcDIOrC/mr+ZL0K2Th6NM7Iwc0pQJ75HaaT6onJ9SY0rKTOv32gXvYirC2HNH3cpNagm3iSJdn6uNZ1D4sDD66/MYOJfZIRABTKlMyBQvMDicgVatcsF8XaJlSfhalOXcoSyo3jyDv4T20pEFhkBsmLGgwuKweYYQR74N/HXRyFI/4hXrZ3hlV5kO9tV2ftIUpP4THCt6e4yS2qjGIQXZiRHAtVAF+RmGD2UyPuF4sOoFhnd7BbwGyLn9ALdzYo7/fUEbEytSb7rlyfo2ijxW9mRtnB75q7tY79rzUYLLpunxxHIKIhUFXe5ZEJq5GkYYe6qtp8gPiow0EBMFNp+Xmw4REKIvSXaVybLslcZd4XlrPj1hOuiBrTeb8GzhU+iwWEFiuxK1oJBelrpOo4VbRx/byOorEjeExext6X6MQBVPG3oVivCfepIQomuSv2TW20IhttWv+uqS8pFNpHPQt9i8sz9s26+Xi/SRyFKBLi+A2ZzBUAmGXJ2DJwh/NcpSdIcN9bYYxu7PQTcWRhBFaGM0jeGbeOm0fEdHrLDnEH2pXsj3gjs4Qj62bm4Ffda9qhmPIZnSge0XyUOZrkNazaDgoppD6A0NpfpsPuuGu2DyC9XXkU4tAnPhK2REcNNoNcqWEIK0F9c8NSe+j/tw71FN4qlLVcb7zYJRTwDg6Gh5Istx7Agi4q0tvy81rQ2g4Fo4ZAkvAarKu0srB33kRuqbb3GDzGO8mnZcH/jvqCNbnvnbv25zYKjBzCYQA8nbUiMpOaRZXncJyZQ/FeH/HlEvOywgwBUc0F5kEZw2+AHJuhxwcUFkBpElhwsHMW9b9k+tpMt8aTLNtAGecCMhvXSNhl79TY9gbbPURFbFr1+O7HY3WLuWD1TIAc/CqTDk5g2HvBLzH3xrgFA3Txe9WdIQLHSd/Kxr1uls+Zmn8sOicRwPpTvQEQJCAhgXAiGI2tTl11Xzy/QmFO549aV8e3VmI++azaJRmd8TlQGu1NDB0RYA7EBO1p4CBrgQelZFXEgxSV0EnBTv/Netagb9KXgnS1MajCKRemSXkgcZGliEqXDNO9y87HmwNXNkr8pmifBEETo5JnnpFxjh0ydhujPK8iAVW5EdoX1IiWZGYImzYC19d8Z2/sE9cI3MNZQipdxVtNBcIYFE26xU9HjTk8mHHmxgUXdyV3CzXn1lpS5hJktwW+txtehFMpMwX87CSGJGihx0HaWUzRDxVwrwAWRloGi1mEPO2OGuXkfHkOCHs3KKbpm41LA5yTF10rz81NNk0UBYUEGk/HfhjroENAd3tRxi9yu2iTbYZ8X4WkSsrm/voZbpCZdkHc6JJkj2XqYCNzBzRZ8qs6jjaps1H1X/JWbOYOJ1Tr+hIdA+PlIV2xvo+XPbgh5RtZBnHUu0PHWJf+iZD+z5PLJO/S+L5hFsHsAOfuXEAhjTIV1MnbGnpt9+sYjZzZxAPHWng/BzHrSVLdu4hd0lIzC+Cao8wQRDc/Sm0lLHTZ/2twA7lR0Hdy7dMky7IRnlfV7Sw9Vwef1i/U7aLWzWIGeYoAnOlw87Ry43DdWspH/SvkaM23P89H5l132MIdR7MP+LKppl5onYwsLzb0lhW7B5hG2/m3QI5ItZQ8PzCSs8PHY8DsUa1WnF/V2rh36bmnUG85IlV9Kp6mwv7jlsDWW/1ZorkxG+eMzQyKos7PX9PSEha0A3oQpbkLlGTjshhDWILjQvNYGeERJuuXHOX1/DLSfRvun2w3QP3a0OtLoLNEk0k7XZGm7ZG7SXhUsDhO8z8DHxHeBXHxLcLTfg6G+qrcIFU44MPXzgC0biP1TSl1Y8pXiBI0SWGgspHhNSgJ7VoDAGj1aOSc/SQNZ8xvqysh+3U4RqwpDnIifyqSiEpYyowSvG+IHuxnqERpb56CsgrqtyTjBJTn3wO7cXl9zmJZDk9JFExugei6gooOYflZgEBXCVFlkrIaPXFMvcSbozeirbYXLYVSAitQVwDxP4BCfIJ6NoeE8NXsakFkUkz9E0mmGnkF76JBVHcF/RPEMP0MHdJKjVPziCqNbJ6HMyB2Q3LfJfyaH+ksh1dPtKPJFJmWMWqPrzdO20+CTwWhecQ5GBPaqBHPsyU6WbjQ93zhFlpJ94z+r/Ee+PFTgVpIRu2WI5ttKq1PY+e/JHN43dwUcTVgleA8QyxoqRDSodEmWNSm6vA2wLRGW0szuZScbZLykowU4i7GMcrwkV0NCqS+AuR7XsU16VmvZoZ7nFBSyFSVF0ScKsp+BCiLIkNhDC7cHQkntP1/TfTApVkCLt1ozNPjzYFjiyAZjuqUXmVBnawCvfxKQD/5jYrIfDZPjVbyaFpdkimrpBOwuayUaaEWLgnZ7aeTYeQeEEAQe7h0lcD9yCgX2gFNwLAEq+hf4N3tt8l/39/fYist2w3MP/AcrSUWeLcSpqoromAvCiYTVtEZ+V3+Rh0GNatQjNpnZSYT2FE0X1rDzEr6lA7DaPl5Yn/orzxZ9O0UadkN8GNWucLO2JQhlteEXq5cLuMQjB5n1XBzQrdgNNpgxmWH8vpWr+EG4JDcDyJkA4tQCGxQjxa2mPvKxLHSl3jcCN+y8I63sGdY7mW97xDJTXRFrWqVjhylx0KqT/a7GYbDCJHoFSRQoiI7Tus+Y82AAhBXr1h2fFeGMMyWj5+0zHUm4RKO5/CLle3SGYeKR1Wzseec+jt9SVi+5ncHFqDWl/XSvMiC4c6l/w1Tw1mYMYsGWVGW9bgQq0pU+ypDQwSL/wmlsFdoLG+nf4oipUODehqCZ72UEfcEkLerGALEWIPebVk9/zLNMX3YbBaUtqw474GLhtCzfEBESHxTxAMnrjYKIaYKZlndYrrHRqY/mKnQdEgQA2VBrVGtnW8ZKc2ldumUa9PQkxDxDqHRUR39Y3fHXHAO7GRcjVCI80PLQBjMjwE8wRJtLA3SYQjhcKhKndEHWU4anXVAzJliWOKZODFXHaaSakHHg6ipUSL9pwaM12eSxKCuIwOms3GzJCU/XyYvTfZp7yNcuRgX6jljlrRXRF6rChmRbmVo6/IJwV4jSsOo/A7AmEHNZb/C/e2x2De+SHY2Yi5qWDMpLuOQ6/HeRrxSGARVPOmzKMYJkVzTEN0eA9XfQyvBB4ggBO/l4XqPceYUYXephTDvpAs2Xs3tr/TsB7ZuqqLNJGYM/LB8YA8feiY606K71wVLQUlWkktz2FUdWNihk1HDSiaVGCWehsm6viKhDTjikHvb0v7JuY7ljochT5S+kGc9iCt6x/bfumZreKXdlQbTa+ue15SAIPiFQtRLLl8039qX0EfayIaEx6vqFUYRdAkvqL1lW0JpE56VGZzQqFp4+cClstiyFKULX1AyNbFpr2jkjHjssEsm4+I+EgDrwR9wvO2rDMi3P1uLTrmowMbI3bixNboXWRiEI+W8NiWrxZ4rU5Mllw4PD95+T0Wk8QiyZcZ6GWryhQ8Nkv9YaTDHNMm7FPTAaTZwCcHLPCh4YwEWrnVnfYwMnMPtpqGl4NYERCEHn5fYxE5/cYO1B1MaY7LvJ2bLEFkSc9tnTjSdftrGOdSGIzulEqVOTQ/+EDWokaeKu61Zb4rws3ZNKy7g6QzBZLK/KEaNrA0JkIpZNlPSPKNkfwaIZpO6VmmmQNIFiVJLm7WDLEHchiplyrrLCSvFJWYNqpZx0eOqQRdIvB01PcORkLYKqqVIlXB0/BJSIylKDdii0C++CmBgKpcsPymOKo4+uDh+bA99jfg+QQwEDR6LTtEaEkZII32WZ5A70+uydrcy788Fq/dxwuaXy9SYayzk8gziVCW3wC6cari7BOXic/iqiK9PMT3LeRKFDD6+C3nMP3fQRJFRCtd2r0XGUG9sIaU+vvW55yFeZTJFZ5cgDBeNqe/3eO2pYGRJ1nJokQaA93MWkJog6fHrzyWX1q59tmr3vIileeVYZ3GF4ozlzlkVPCbMEtCQ8y905wjOAKNiNuN02shT83opmojitNzKisSfxwboEA6rU8llr4tLGG7Jdu0ghgMOuJe1miKqc9TbPFyRIctpEl2RYg1DwXKrEysmo0Bk7V2szmLfap4b9dAZ7N1vooFaUUR9zpB047vPd8nU9/S7RRXK3pVIzm+WLShCLEiJ1IQicGrWnBcum/ajlPzQXsnoh3mgCLnIzO3iATuQjKQgZ5KIor9qnUAdkHkOI0hHAIDcJOOOl9QBzaoETwQ2FqrLoeIPL125mAV0MOuwjzBNE0rA6r2oXMk+2/nGe6CjekXxuJtFPFJRfz8gppsM+0SYCtgoUOQW84aTmRE3UprXb56ZGFFrF2XVeurJATe607aB4MCRLLbvblUudyzpubilvhAvlo3rf9d2UL6g5ntJWxiGGHq1/lKzzesKt9qLRYcWddGUcLnIeSkTKJtIy3WYU4/fWvRBUjURbhaZ/5oRAH3BvEuzpwakZ4dXtoMBGmMY06k2mRiREYbBA3PnkaDtTvaeMv4qsXS1opAA8hXoGaAhjO5T0P5plFVUlMGyfftmcySVuVGIPJDwm/LkAom906uXMRlxpuHQhtWv6hp7hRgzRdVzJpCiL7miPnO/Lfbc8w9s9jnui9bDocR+xpFvJZHxpTASvmH5epOjHRdjaKJoy03X/WKUhadTIkyf/pefHfC2bSeEYaXCWj0kc5MNqA0B3uCw2+R1y+usK0T+zQGXysbLqD1Ol/njaxpWlK5lmoFXOj7+JgjzxRn3qSbYoj6TOpRisuxjExcffVUEX87hT9rPM5LOdJho5kck0MvGFzT2bfkDnYG2PBfEFGhZ5ltVUWd76lNotQZmF7eo6Z1zFj36OiuoMGbM1qkNy1WpD99nOafmz/oGzbnNQ1d7IFaj6M4yCv2LY7D2unFJxOQXN/wyphazAaZO7a0poZ7zsMeI0iH3Y2/mbmayc2RlayO1SOa6O5YFXHerB9LXty0bTU8rAT17aYJ+3A+EQ6+cSYYGE5tM+pJTTiphZMKtl81hU+H1p89K36egUO9Gwec5kMP7FbUJ7fMI+BRzPFbASV9sp2BibKm67mZMXTa9Vb+Pq4plFGFEYdXRrxOGmnO0ZXd7ZUGrvKtLICk0IziObImvuRuuE14L9AybBsOHu5LioPBrYfUkwKP265dPT8Iv3547aiKbquDbOdeyS3uOQzOfBJcyifgYuKxNzNGVmwti9Uj/36lKBH60+tQYjJzg9ZBMWQipT1Ke6WCtwaIeKTxZzCEx9/UtpHNeE06/n3nzTArp+WOSg6WglyDMF8w5JEc7JDcwUcRnrz6mp+q0PB2ti18QmufAGh+/fQpX/hXSM5SsOuTNvwy5OwoHRfMQ5O2qUrwTGOyyYb4oM5CmocoeWsZycuKY2U8P/2CNRdPTohdj1c2AohA9l0W5CyO/RHCzeaBsBq3EAL7d0hOt7fMc5GgWtGVk+0RY0vGLCDjZwPIaTupELxhF4omH9pyCiSP5nSnjQrFNwikzwgiR+TY7wL1RYM/DP9oRdLwTn+YanxNGsZFPPQ2+9DLB2XxjuyxxL9LG20F2W1pNTp+L8K9ifBXB71+nfESO2UTI7YpfO5/RAGeHApgxZPi1hnLd28uSXhWl2kewHB+7wUS+WFb9GyctiruYAhUSpTWFca7WdhuScK1Y6yLDj4LysIUcHtrFN1Of/vxL9p4e1Xu2syCQcVpnzLVPa6BA1PGsbBk/ID8ljXjULTXbM/+m/5bYxqFwzuoJesBWBuHJUPjrKSm2P8IN42+NihXB1Xe6Ymm9mMc3jntn47ooeXhaWQKFMYEMoL/cEIhepJ2aZVm+d9o+cEZDMPjyS1ugBGnYhrVVxGakM58Nj1WT8lUrSE/n2lS1YpDeMGXw3+Jv+hTgAiRRzD9HPGsz5EtZ67ntNgnHouHYEl7HXMxnSt9lBb33Bn9bVJbR027DX67jrOAi4k/dtsdpX8ovhytIXhGjntnc/tTPwuAHBRLiakT7g9fMtc7KEY6s9eJlenfcjDU0VeyMEvw6AVu0F6byWO6uCqSupo+2D+8P6HoiKVZxtJ6153dpvmXV+YR77xTrTgyp+VIjhJ3s4BttpqjWhFF1YYXEEB8c65RuMIX9gQ1jwlKembUCFGT+veXTdLWZdwFnALcZUzAElp69uNWP7zWXs9IzCenwIH7EpCk8DlfPiG3fFMU9VX9eVkHWZytaAMLQGw00ZusizyBQD7GJ+i32hMBynpsSW1VuuIYl9LSgZhbuqs4qjZMUmQLHrJC/kwzJ0F6PlEHPDB5mZmZsrfruERAQBe68mqLtBVJFLFjQd/8X2DzdD7nxvEia20Ns2Fx5ExBI8VCJt2Vpc1XkzbIxfCOAlcOHSK7bSAwb1gBcsxo517IugxHpu0OLKWHPCmJbWYtUc1uvL8h4B0f/frCuez1/i2rb8MsaWKyxgohozX1wG/gelefB+5o8nI4foQW1T8oiLh/ZdOsQIASKYee3tZEgm9QsIPMYKcDj8umlruHmfCaN7uyLfjJjLfznzEpkqeZMNXlarK1RIL4Qf6yjyhRUKzhRpx40AXpWdDnsS4t/+g3Vv7tHrcpBaCsdwB1jaxPTLvc/oiA5CoOp5VyPXoAUjiMBTVYz5MhmjDegHJUngcY56QF7jOEMBrBPKc4s9Vqmy1SO+3FedPAjfHpkvNi+fiiXCfR0/3g9qU44OEjt05t9M/UcGCreYQIjSehvRZNByTw19FakR7b4TBKFk7u0UVoeJFOynI+1Z2iUC5pWMGPBxosQ/1sBZbX5iGD14bHZRn52Pl2nTFYVrLpvmYzi6qfq9Qmq1FDHo+QgIkYhJHetCB31UbY/U2zG+SBxQOb7nr6LXXpGOxxo8vYGKmJFMe7V+AXCBRpMloqNfM4BFlC94FwvzgRSIEX8BJXhDcrW7zcg9PI4UvHYhp+nDVtY+tVPeDSKxtsoBzRt5zM0pWtCSgVY65OGOwk66QZnURvr+Nh6DJhzDH6iNu5cgRoZ7MH5ej8S0bkjkThWvEXIbbhYHtdNNwDU0cmS1lfX/umLnRpbbqnqIgrHfT3iXbAi6Drhcwzg6IkIMNsiF/bbOsewS1BQnR+uTcmBwViqKm5tbvnivOmID+rjP3kmQ/XleMAcIp1ve8UF09EFIV0j/2u9SjdVfVio86oYOIe+gDDByrYm9PLGYalRjuU6UY1oTkQs+qItxku1L3HLdHA55w6x18GRDZ9ZblaGDgEP6G5shrcdOjZIWGwKF7qSwVfZac7AOkeynXM8cF8xEntaKUgBKTyilrvzIddVm6uU2hBCKsbMqxdVx8TicKgMUT2ekrpJ4z3AGvc/lrQcj8hAcl0YX3ly3TYBI/aesanplBH7C8hLczh/q/mJ64X8o124fmQ4vp1cUwvqmzucakaVjyIis4ia6pnG3qarV3UWQ2o/gbFBpOpKgzFSJuqEQy3Upy430Quv0E25ynogvOBFG4S4AmiHtcFHBfc2K5A02gAPUtFdWFEn4/djcEXRybgdWkgxWQar7bTxoaOsjDklDxjwdGHSMROGqCtT4fglCKoYE1YCu4mY9TuRX8QF2HEFsiBrI125wq6AePIcxfoCXER/XIyFlKRmcKuytCCHHXPEh68gbLOhnYIxdx3jwd0O7782vdGkVY7WKsaorgOnLDEQPunXICJSb+TRQ1kyFjgDgIdAE//w2EAVCMCxk8E1NxRFEsYcbz9rYna1tpk6l4H1GV7bACYFDyuSbGUTG/K2mVt/Pu9HOT8EVX7PRFwdaje78f01sgktaMqIjVqA1yrDl1Nl/aW9076Mycau1jyDXXDG06eOWGTFmwP9X5N86gQnFxEoFVmIM4lO09o3Fo7uGu75cshC5/xylhlzBPeQOtnPsiVX2vcuIuPMt6vWMiJgM7olFdZIXqIPwuC/D6NEDMRILPgsfv68va/uPcKOo2qcX1hCoo0eTU5HrR+tEmE/P+MqrjyhT8F8didtlNtfUfAWqqGN9vIkKl22leiU2K6MrHHUSImlViVCxKNdti609iRb5U3BGWzT8/A7B8PWdigtie75wDHSnS1JuOOSb17tPxOIt2EeJljC0tUozIwVj+4/+Vowvjk5miuExjzXIpcQQHtmDDR7N/1xYIsRriCbtOdj61ZT9BQlZom+tKA4J4Sxlu/Ewo3G/TZe2En0XkE46SIAU9piYdq3IEqaLXelDfpvnAZo3xYZt2JWVfCfr0f0xaQ39gzfEA+XAUqtUm4n5GVMkPUNK2mhX8hAKXeIZj2US+/Cn+o0BreSoIy9bJD6NqX3bZ87Ax+d8MLts2XMMZAHYkUBn3tBtw0i0oKdb4gpQFtbvXc8D8GXRaH2/e6Onk87vmG14tMF1i+kivA7luz0WcWTyRGGPHAHgShrQsyQooqYjjsCNy19M+MCTZjUFFnn0UnVV+VYYFjdzFOIh+bpexRK5JyBxMpa6jBe7rA5EBFODg6Qlzw+V9iBSu00eChIxCdW2d8qyVKj0wsSDovHXiFxj7L4ziVSFABJ0QXKi2h07qmT6ZyfRuKicEkactJGlG2rA8L8IarpnjmG3fq/f9JEbrMJax5GVUF3silikN+LgIfm0RJjjZdDbHR589zSBFI3SG9ziUDIJsGgPXh6OhqSvn8QD0LNncP+ASefI6R791sXF16I70mnfz4TYaHB4Wms9sAMbo3OWQs8qD1xAqHaOABWSNoAdZcqudJRoGaOnKC2NWx86a57TP0IF7EzQgo6ipjSzqA8WW4wa+02pkI1XPkMllk98REDGwpohpJ1aBA+YdOvp7Fqry8XFQrrKxXFZwXckb7t+va15wq8wV9Dq7Al6n34etwBnvjJXGGElHRAkrkxBVFS0G09z/RJbKHwTCQt1GlqNG8T0JWbuK/9a5aIVl2N5aqKZr8Bs3Gr5ZA31p6cPv27EQwrAIVDOZiBpMdOJKhX8zcERmuYy9kV1IdM2XQPx7dYQAnvAJ9nskC86LP674imBjXhCXYkf1NmTxA9E/K2g+k1b2pXTrRrzoGcSbrmehtC15yQLixaMdIABIXELlk+WC/9Y6ApP4ZOsAgfp5/EMhKtwTUiKbhQxPhP5l0+LaAbY5PhLDRBqwiBZZfoAK35fSdbvNrCRMM7McH+dfS/mIvyp571ccNfp2juV0UNOaRLf3BUjUwCi+x6FPctVVvR1TbJRUS8uL5rKFRvkZeQUYVnDZXNqI0NuCtcgxZZtLtNe3FiT4/QHPUeLptNVu2E7PmtUtVPuR7cbMMT9dW/Wu1o8Ika9tnYOzUz7dQau6WOpViG4eQnPSA3XLMP1ofhQPSjk2P8w7htmvkiSZt/Fmt7Qu3voK/2o7Xbqtn17WFw1XKZXOKnYU0gm5K6lWweaTofICl3+6Xoe/0wmUbhNxgVIR30Fy9MB49+LfYaapVQfnh7PFfoRQpwpeP09SgU2H46nfMocq5xYb35WYgDJUT/BlZ23D3/SUEsGng5gMpFT6tXqa5JZPzTfk2qF5VE9Fxt1OSdG6Cyy/u4tiTx6z9KCTkUk1y4hgS+fxV3nS/zB3pGSpuLBhj4gZLHKiM3IZx0l83L7kQchVugsWxcABN/YFSVKLTzLOGvop0ZMI4aWsIsJkJN88IM/IUiXazMysfuYG516OKgBhk9V9JyaiqDWPuF+GSZrfK36ZI39Bi70/UjnKlTAPfhypJH5EWvOo+W/UZoA+tSBdnbPpjWfOmCX5rh/s2QDZ7aDG40Asuy8zvb5c5MnxRgfZXbHM8JpAb9gAQT2fBwlrIldS+QUxIGAycuD+uI8f0TJktm0rgDTBEyhm4bXeugqhAjjm+fgPZvWSExbj1rccFwmWnHvwbeiIHqkWA6VwGX5zm+Y1Lag2F0trMvo9FW6cTaQjjintUJ1fVhOoGRDPI/VGXmo3V/rfjahYjxkNEzkMkuc60PzRA3aFzqbFu8KNusQoEV7N4DrntHjrS7k+AvqvgC84FVW18/Oyxv79SaKKuVrW3QOaueyx2rGrDbGrp4TrnduM+m4GPkXX36+Aa0vYnQWeYZQ/c0Q6iccyeILH4Sr39l8piwMWeUKqCyqKd4VwQvfig7FoJFtrem+egM81Hy8A02y0sE1BPRO9j5wEcJj+AyPVrGDAlQ+cDBjxpN+AZG1VvIOZMitvcp3ecZ0uLux7xB6++S5KRXLwuSoYkmryAPtN5rmCRxeZJosAhj88MF0io3XAEcfVrb4weH6TfGGTPtLj5q8FnTYxyP1mcQ/eXoj0irIN6Wk/09vlqZtw9d2Topuh9lQKrmpb7lnN+GDknQmFwdMQb2nNqmy9GlPD7g4x2KQ37546qwQxGvIiW59QTqkI5OGbHTRq3DSR8oAq1ZS6VxdpflwOwqFOIEi4+S0TAJcG74/aGZyp6YpyJ67xuPzZJKrfyyW8ABmHp7xwnOmdm1kXc/t4fx44JieVgZu4HkhHrnqGdhhHuclVWgLVdwhsQbZjj4X0keL8wJaZVmZmD2SZVUQELWfxo4hsons4y/4cYRqZacqFw++qvR/MtILJJhJP6h7YxhCt1bAQYFDCoslOGHnVVcA7zkdGr0E++RgZ/IJNva2/sYm4LgxZD2yozHI+1cSoSb57ATRbwhRE2vvXk8pd9qdR3f2+h5R3Mz3j9QBNXI+zl4zIywftYGMVB9EtcGy4RAbh2kCONxoPed03xCuPq47vdqE+lHzMrVb/nyc+A5SjUCpaQ1uiGsdBB0ErAk4lpCClV6+3MAI409AzP5Q2Ani06PkkQPL+IvV6OHbycQ66ekHfWCmmGBlAkNP/Sl6xgH6EE5rirAStolOmT0DcfuNK1ZO2oO30a/Vi8IBsGp1riFPdnGbMkoFOD86/AfcosDHlYIP4ZqGC/s7HuyuUZO+rZWY1+7fjI9cYcj90Jy1gRs6sfokMgLalPJ7Su567d+Tlk1Bys+sdC14rBCuqpa+LHc10O+r6/1kp3ysxH7kD5+hFDLcj97YcmzvVawKve6Ui8Q3Jv9H9c8pxZWfyV7mIJ2DbuNJOTqYvgZKa6LNoDVs5VdRtmq/EqYjBlKMeq4LvsROqxl8xEUF4BibNCMUN5GF34mlE0LrfHaSMEaNA4Nu2GcWrewwPma/PgUFsqGR50w+qwaFMpIghzTXbiHtIHNGPM+JDrWQnnQkYBpWQpefAghrFdoooyfZbVDJoYibZoCzXzlcGrne6bZsmOcf9pdA0ebvnMa95IOsC+kV22a3EAIZM8AUvVZlg/Lhdym+m6ZteGXB91yR0eJV2EuwLD46kTBtBkcUHI9kavVAUtxk2c+N+2RPxQcSQYbRsi+pLfMjyh5bZr5xqOAoS4Xk7KxYTJu2yiKiKb8w/Gy5dFvQg9eHpLaMwaQ10uB5at6y7oLvTOAXhlX2fLozLuP9oPmTZj2RQuRi0EDum07V2r9XMZfpI6j4MG4857aZMXD7iIEgygVNiJaOBjZSjTy3mS6aoc/vnp35aYIo3okaKMQQoARRBq4lCAPeWfq6IuOD+lw+ZDn2lEoGS4eOCsDDSNxG/4knoBhfWzWU7wT+x3iqz7Tcu7/zGqbZ5155qU9r2DoOJ1vLAv444NxR53/FArOsBN2m2n1H6d0vZPS7XUPkinwq8G/mDYjSGkN976v4h6LglkkVK80v2rdIb5SzPKMUUh4uPptLVX13TLnETX3zCpTDOjvgSMnYX70Kh620yXYzz4ar07PwqPEva7lK59NXqx+3MSeaj1kGG8wge+c1lSxhytAz7bm7YRkIcA73CFfmlycBVv0NZlN1vrzZDrA0mPP3MP5FLKjyfqunA8MsWBgwMSLes0Hofo7EjA5iEs/RXSOc0h++fCpgkA99mROIxYdh/DtWfK68CC2wNQBNTY8kDSsru3mPGxO0fAfmUQUF/YockMTz5IOTYCISO+2oxbt/md0CEWbkE9NSeDvkGMBjG05zc+++1/+05LDk3TZkaQ5fNA1+SPTgpxfGoc+Fca8kCHN6CZVpL4XTqxF7JwLMj+AgzCnJ3ZFP7tfEOeQGbicVvIkR6L2h2nX2kBtYcDILPwlEIdmJbtbOCK2mi76fSfdkmua1kxNkZU8y0yPys2GnfKrCqn1vfZI32nhf5IoZPIYc5jIJW+rVNAPYFWUh7rBftMExp/5v8YA2Gg7q3kDx7w+Uf/Wl6A0jmRLEz8G9xcK/UCzh0rZiOUMu99NHCdnJWdXylQqzsniipyNBpyz9ILX+cn6qeL5KSrT7d8K6Iz8X5o2HfJQnx63B5RWUrZTrg9RvDHxpPCfaTwjfDrtOF5LWEN2SfMPYJcCIPSZ2DtHX2oME30p5ZYVqGe07eijwefj+9vc7jH7yBffltJt85W+w78EseTlMDptiX88nrp4gdae8w1h0UsySou74t2ioGFaAqzAXe4b5EUpSEYUQ6b17ebol6KVLh8NdCdGNDBMAP4iI5r/NUvvMZbzNA1+85qiTSjvdC8/CV0VxsWDOWv67UwsdxHZHM62pBtAGoQfURP2xbi77qDea0MCFFZ8miOPNJnOZf4fGFyMP/VJU1thSAaj8OTNKWumBeWkgce3atfMob6E29X2ZDsG4PZjDTtpKPyubEdGO5oeTzi1PmJX/FUgVhD4BDIQuGbE60+SPzu23IoVau78FedcXxtmezrwPiNIo4s0AN5LiAWgCF74jmKyngn4dTGsVOC+OG62j1JfNoptaArl4y0viZvLaYt6IE7zdtdlzFSDG81sNYGryPn2Si44cZ2gMupzYC7SOaxL7dIPKE4Nu81Q+1zm/YRXwdedzAGFA0dz0eFC0ITmP/0fbccHq5TGtuDN3U5yfSWWnw7CReuWTlhyBzQ69PTnV/4xgcKnVM6qOyjavX8h0gTuGaV9B4C1RMmGCwtCtQQ2QbU0qHfBAujBkIRyGJ5qnoOUZpJ0tE/lwTDlmnUiZASIgRnL9FPOcoij+DBM6GH65IMBTJpxPYlFzYG3WchmqylXsDIJt3qK4UYMeUn1kFwCFSe/HStt9LUIONAYRoiWjkLNv1/VfD/mO/0/H4LU6sVszhVNJs3oM+/HsYASyLmEdl0nNNZihLufE5B1mvcKHGU/8p9uixQ9dEr9JOw1d+GqGi4NWv1HWh7+LfuShWAzt22oTizcCw8M1+c0HsMSc0G7Q8y2oXBI1soxp6v2LujwUj3KlBovGgMiezsjMybZ9SLq801vSUPF9bLCg9M8NWM1PIfLhfiJJoaNIESWF2x/Eo8ZSKr8vQQMQ63jAzK8r28dAA16VkXADLUw6phl7q/BtiUkwAlK4dYnI4eKK6m+23RnHjhOO4CWWxUqDdVPu8x4C3GWY3OibsLQrynEpZJhbOS9LkwnvD53Fh0r1qUaCl7vFcPVJ3Mu0Nsqi7Ri86i6OFPv1byfLcaMPR4zGfUss6di4qQBYkGtigI1ZuNKps49sahOzlRSsa1rR5/HvPSpPk88J/stv8aEvjw123Jon5hkq+4Q9t55BZFRg+Hj3LsTTryHg3f9FukKYIHrinthC1O4o0jllofLeTgA0S7nd4cEcA68nopY0pyHU1kq7TtBhtJ5k3oMFJGX/LrmpjJuhfmcHX5pDsIIWpmA5/6QvObn5I47QSGxZo6YOj1EwOixmaQB8+JdWSylcfetPoeT0sHhYejSPApSVPcB0XHq2K3hUYPFaHEWldExUYCtlWvVDxzqNz0AqJjgn8t2s0K4xlAuThxAvRlWzZubMqod+YzZ4h7n10CbaunhTNiQP+gSwZ9u7dKy4qd2t3CD3Zn7j7Cly/NfXsX7gESMTZ75udWbOVbEbS4QypW1VU6Y3xAaKaFWoaE6PMDOUI80DP2Hl9+fkA4h2Vo02og7hpsWoE68pJnlsOMQlv++phHd1tfFn2vRpjFYzTC55TrMlJgkpfwXtdq9IoipGvW/AANz6xIc+9n9HSgVWV37lASURI9ZGuUa5igzMWXsFMPH84Gbm39NO+T+gCp8UA25Xyw1a6Cf2j9l0WPnInnmajQHcHMlXc4PUpkqSaG1ResnbqHgymqZY3IdUHs5s74dCU08Tg6fi4XIDOR0+JHd91/AZ3lJsh3F+Ud7VPIB2ktTXLwirbGjlkfaGX+4hvP17Uf9O9rz1lfO6EiJQvoPCoT36PZ/HVZ3g48aflnPpibgT8ptV5L+ky9o4SJSSoR9Kmt/TM7pZdGeXb4pOsLJ5qRNDD7RMZbEl3DgeaSPhElFU4cZGrybHe3M7Bw0Ps+wQbjZojW/AQL+0glrxwy74HAl2H7cROkefdRQPp/rI+vd7AAFZ6rq0gYe8AzEn/QuQ70j51Rgz7mQJSjm/GoUOgjhJkhQzRgv7LdU4EJFlHukwQSLRSr9DV/MSBjAkAF8SESX4m/1oPnq85wyzCNmSCfm5rvQUkw8Yk8BlOw36JDzbECzLvniRxF5wmWFmDLmCbUWbcBFM2me7OcnsKAL2tiKUifMPDZeOuyg40F6mmq5JFHvoatTrinNMXb7avNGg9ptxgRoWNc5xJXN4MX2ZVE63L9eGxJ9cJRPbI/VA4oyyieAs13P7TRtu1lx3URxslk8fkv8+vD+GSV32QtyAgeWzZcrYgnfbz80K7AbC6sJ30nygvujruid6ywqkCwlPLw+TphCrcaaJ/tsaWVsH/kSBrNAQoHcw14zgwNoNpwPiz9TmgOrstRgXvmAPabFPDEOIreVr2G4vPim3nOaznP8SH8Tlb1X6FMJ00ezyRDfRh31gpOlgn+iPFubrTenBHYwtktNCzlxSkAfuzNfnOIbX/Nr9hew+F4LFnQ1CWxawYwXb2I2Eis8AeH54Sj7vhhq67cyZ1JGRNAoVfbYzQnQNrYbC0ZPvEVPTXaDvuu55UYN7a6wBYIMnxzLuY4wzRth9noujckUgQ77Ty9pRBpbcCZ5/7s9zzXYmGdXNKRQ7klz1E0J8rU8BQXEW/ZDwutVii5ZCk5mv/HO3de4L7LnEgSpD0tJRU87hlf1JHF0sotJZg9jVDBpZucHSOv6Woei6WZ8xldGYNdmVtLdbwYzxX6sXgG3ddpumdqaHjFn9KVUUVys1b89fSHnCBKYRhP+7o/IBXw5OzsnLcpVd8A+6XPDJhRNf+RhVPjxLf66m7HaDjF1lhaO/XAB/ULAaD45nYnquNGTiV8DV43ac06yO9s+Q8bEATqYCdYuezcBVLshtR81zE4E7x8Pfv1B4gnA1o5dU9UteQ8LIULT2ZJZywhxbm6mV9tcj/Iej1u2EYAHUBk/T5U75oA1qNUTYbAR15jNO02gs0XkwfZzyc2yIu1m+KlJ9TvCV31wly6voVKOqWneqZv+J8Ww1Ko7TN6Cvr+EjPlwbMqUXbVEsl5M+ITGaJKHkdvXGKqRaCNRDlKCWlFNrAFXNX9Xjvf6T/tg+yr/45iNENtP17TUhqJFbcC4jPKqQj0uGwD/aA7BFHEduZ1e6nyjRsWzpCf17yyCqRq1dUUvcwyN3jCclkDo+SGpfGR3MXhSZWc+lhn3BaazhRhWJ0mYKM+vR4a4AQlRBaxfhE/KVncClzkyVlqxB15ubQNZm9sk8DNQQhuWyCUkAlvpzODtb/I2TM6CxwexNlo2cy4RL9/YuidPL/0sP+3h2FGzJSAwsuzqfFSvS6w8j0RZHes2pG7Z9L7htcAWDtnN7dVyoQdnsb7sKeInH63x64chTQY9XXOr9iY+jOWFM0Exp+c3gSzsnrJiiPBG08Y2qsNi2/amv92nWBf8JLM98YRyb9VxYMcTjMYA0B88CFrpa5UOnpXveKWndpIptrinkDClXWcWXXg3sGSy0pxLV6xKkF9MOfc46NK9vGl731TtjWHPBsxM5ipkqP7Ji+BahArYQuXl1y2kv/YKjckzzYxdmcCZHdj8IcPscyj1ObcetQJ1cISOMrOc3u5s2QA4SuLxWw6xBcXcxCstywWnka+tcwvQDosmhgYX1RgAvTbfGfft5ZxtsKa1F5lcO8SX8w6fGctDqq+1FBeKt8Fn/UO5F3KeHlqFvmKXj/KFfZNCWHYkAPAHMXMlanvc0Cg32+mFSQ/X9ZP/wpu2mPdGK0wWH/ukwWgXy2xu+iSgbZYeV+FtaIAS61m59I6+0Kc8wd/neHDAH7FW3juoAjpiADMKYyBoTrCHtbJYaotp3Cqmuwv0llx7tR7lqJ4lZfWijq5cI53ygmwb42OjT9B90Y2mC1PVu7X+neYfCIeC2ZwwD2Vjb/xy4I6jk7h5wx7D4WQxCuEWBPEFMKRTC9Ipn6TgyC7CY4cMw3TWbwG0P456v/bdtl4uBka8u1BVlALSLqt7sO7znRNlQxqSTFckfgMvpEcE8zcLuPVwhl0mHtDUKH0etDGRLCAGj0TrAAAMw70frAQE6Ovr1M9SwGL0xntggqeQqBEonUDkwzsUOcpAOLTsTyRke+Vg2PU8+IQhDVPzjhh2OH75n/OaUgYoAfc2l6UsR645S8BPKLsQPN/k+F1q6jirvh2kzQAw0aBSq9IsVcBonCRgw8wymvfOfQZdjsAHSwyZa0tXMwYJZwKCKU0+zx8OAPFXvcTims94tei2978f4YNjRU8pM4x3Qmfz3BagYUwsJhxCptg2hVxRxMPB+IaaLGDnd2wJf0A9uGUWGU5mIc4oMNC9uR57Bxe+CoFc2ZUZ6IN9v7no+TjxGZPQ8hruDolutBW9H1epdaR0GPqciYEqL+zTyPWxqDAdh7EZaRtSJIkYkRCcuhDWTxXGjdfS3wdfyP5SAi61Mi9Zeuwnr1owoBsT5k2dp39niqcM8Dj24YYt6IrVEQ0Ip3uqb/ujyosEKIXANS+rFBpY31icQL8R+2vNBfOqdWnx2cUK9wpn6q2xb+XfzKltNZkDaZjXlWyifUbXDh0qL3mTYgT3/jib4TAHo/cfuNjpKHPbXMiRQQwsdw1nNPAHp2qxNKrGN+w4RCLwMBzoDUBvI1WhVYdBzXZs2Y+ThuYHIHoKObLiZb59AjlzEVZGuBbbcKFfKvBpO0/r11fr4pI30CQecEuppqw/yJ3dsPcykpiAoB4DkF/hIoBHXFSsoIIrMpdei/dWTq9N2gt3mzn2V9FY47w+Wjkk8pUdoqjJjzFKHiqJVB4y6iHFhKkXYuiuS2IZB/EOkAI6b63Beu9Ido8sr8OuvsDSAsIwMZL6Reg4JDTsYsLQbW3rWVUUDALd/cLAkcQ0U4Knbvyv8n4XcNLGupYj12yUFMCsOWfgMKPfbWX2sKYqu7PXj9e34pVBhSwGcg+ZYfMnN8WGGmWMKx8EtufEpWfEj42aqTBTAuYDWmNienWz0x292UgeUsvKXeFLOMagHFCtTDLIEayT60rCvUOn4Lc6xjWD9pq4NamtK6Z4+IHfrIF3UyZCXnE2xWAVGyBSj/YDRBSzOiFhQqMDKsm+Lm8DVE12pntD3eSuefWSnCZE+W89gvU4fRsiH0hejFNB09Ng53SvIRv6Lnt1L0ayJSJZYaYdhEB5Gb622pMN/Bm4TdG/B+5n35lGALAdXq5cpSgkQ1cRrk1kR5KYB2WZgUTDZDwr69yZmndmA4AxWC7mlOLK1JHUNyLIu6ECMzSQ9WuzUt+aLQmDzCl7CfidXMoKG61in/TkaTprPiqjbRc3/wrIEROInK6GvX21D+UBsdk+qX+nePCmsuNxvA6kyTsqJMnWlqwtnzinZZCbC4fRwG0hNa3DnGfaa2iIMbrCCaMmAkrQAPgUCGPzpjZH+AMMjeZfhb54nptlkR6AX2ORkE2ghfc2+cU2k78hauVgdbgmA3tqWI9WyIZ8VNKdABXkrVFCvpEn0DDQIhL1n8q+FGCY51aXf1zHSwplSHMAQ+uPlNgyPZIUQZ/w/TYNI1peUa5duMPUB2z50BCxBAesEBaJahimzmENJt2gPzGW+o7qvD3fbM6umMfssmWt8brnsbFb0a1u4NQQRnxzvnFpoz4+50cnujSGV5yvrbyP+BSHQLe3yMMaQOVel+1rN4dayvBZJDv91p1pAENaZJEcOAmODbIIdgJ9y1Zypr1bJSD5+ONZy46M0EJ8u8QBz1U4guA1AOHwvj7fQwY6vEPQgBPWA/aLtHry8XVAts/5gaeACC3m6rMlWF8SNYshaIRkBJaHD585bCBH/B4FGkYbtRVrxwWnkgR+REuGjjh80tRPaxzdusPyVI0G8lp0/zntTg1kU1nAkCCw8OHXlC8JD+VTRf39AfGCRLBfi5TEr1MxFenzyyB8wPabFrVKurSHgnqtH7/OsoGol45Ef57Eg3dV3GFOLr8MNDtb3+0bVdireECQLM9/AteCY8Y860w/4XRSRwRoo+328Llj+6LzQ0lFwC5+22x1ohNRFpG/Mtn/64p5JkQF57rcpOmrH+ChFWcNTKh/02r5TXyjgilCU4XBqxkfq2L6wUg5lAdLYSJFKBBF/g5z5QbfcvdaVejR5psIf5Acr/zq9P/N3vMapwmOZrE/GCV9Xn3TfkImU9IcSQIgsGk4jUN1YCKalzZVcAH12fXC1OXaugXzoPoCTNZHp6zr3EHEkrqFEenOnoXUeAm+ZXZRrgJ6Gu4wC+o9kqhqj8l1NQYPmOX4S9eBjq8yVKn/WqaOFaUJs94pL3JX3u7CYyv3ErZNaf37Zrm2SgyK7x8p2vbciDF8qYGnXDWPgDJI7Hpu+dW0GHtQzv+mU0aOdJr3ab6L9PZvgv2tliHd0YGfhQkAYkj9jYgA6S9/auj7uPmyFyPgslqOK2X9OOEHJGr0QTtI2iBKqUEyHhpMm94VJidgO+es4UfqGyJmH0U0PtVTosKTipqQLKwmwjuDR0IYzP9RigO/33xks71+01OCvvn0Xjw5Pv4O8SXN4vTM70rvwNEwZc9k9Vy32MvmpOgIAVwr/XMwJKknRfzplvxN6vKZAJ1zwuZxoWkywv9izl1rtwRs8DbUYzR6E0Vx5J/S4TzgwuN9Hsy7cOV4hfxNt6PdocwRh8k+4/UPfIC45JTF64SJIapW9yWNfZv+qto4zXkrehGXPCRYKZtQiGrgXz3Kk4xw0zRgZzi91MboNZyAGEWDPFTY5MflkdohDliaSQLaC8W+GFGzU9w6Q1Ed36CWMe1ZuGiPHU860YDQB3c10KDvOp3pLp/IEiYwqcElQhpQuDvX0uHHWO2p/pps4QdLZ5wv90Y2G8q15Jq+1qRQTB0V9QhdDkoNLkqBY+/lfwAr5RjOw7ieAClrcEsyXhMCijGwtgg6mF4eeZ72ppDD8diR3tu5Id7o2Hvz4EUWfrhixVaFPoDtLwl+RfqiTybkZtTU7w76X0klNuCy9VkFTjHICjnCwJmEurepzXfYJBzBx2FhhDm+l/+ubt4r0S+JzZavkDBaTTe1EAPccaJAPAw3p3rChUT59iNp67US+RrCifA8SpwcXX6gE+h47pE4w9WwPN7xZnhO4tqpXNdgvqATFBj0WqCzZXQEGc5Sb14uqG1HIbRqx9FTpaHZS3YlXdA/Ifu0NUrHMt20KPmmCsOs2B5XtzU7p5k7+byn0SNGk38wTYbnqC78wJT2HOxOA3W/kitWFTGEg88pUb3S3lUAcYlbZ9ILaCC/GBWK96+hUCHu00VoHSgFerYThPjoptR/VYFr9i5u9ji/W3M3L38Ngr+oKedA5anUy5Z+agsJhsKEk6nUhQGBUDp7fySr+I0UsDi5iqhQAFXxxz+CtWh/8C0AFhLn9m1MphY5dkwA8xyhrwJfHPgPAR+BMNIwpk/sexmxDlhyDYeNObD2beZ+hA7EQMpzaT/QEQjSEcMw0rDbpdB7y4wbxZJRlbdaSIDA5BaRGwW4DzqKTCdi0Pr6McjC/ISXNDX48lnvX7TiIhaHnZul2zHGP5xa7un8DNSp02W83Ts4eOc5rzRbE6TUZ+lSm1C9NpXEQF+gDopl1DCY5ZrIXsToLUFc6fMHVjEL+ep8bUioBMfqFcEXkWQSnkSZYPb0OLYI8kXMb9JFqHzAXN+qg4/OR1e3u9DstQLzO/ZaiRNqsiM+X+t35DgrJsmZfC0AVMXV3j9uxKqUFntQmlYYa5Q0wiLdltLZ1+r+avE8YtD621YeDwb/uDbhffF7G6n92Bdqa7mSCSYQdxxoTrj1IScO+q9ySNiZ2CHZfPUN3IG2QDlg75ksHRFOW42jd6Qrxv4WXmVbBJxnydYiLaAY7JrPkpbsA0LWHtp+hVB1HLG/MoKm0N2Tm0lHch5t9/iMo99EGlIusBjBDOk4mM9mihqTgXFtXLLip6U54nrypLoMM3A+SOUZk1Aruafg9r3S+GInberNeeYxeDKVn/t0CjlE0x5l9ej3o58XUy3MznU3JFdpCUFgRSe0kx3Fq3eEXNhclHYjB2H9mee2I4cufM8LNxtEoNlcvzJfHzWJTLAiIRCeCYBq2rq9c+Atu1EY6101ZUVrEWkibBjDpO9quBj1nwsCH7OAMBNN5nwr9YYiOger2jikXCaRFNQnNWxUKxtcJNcsaqwXmwuHI3pe84e47/rvkgrGCQu76ndlhFid+r8rFflKa4DY2klGuRriD//N74F65IlX//Pz8v7ErFSRAj4GCdKTNv1uwCUFKB7f5rs6KQzDa2YajIwYJop+UJtTm/nyB2MTSVZI4nFk0aZM+ngOwJd7JQe2lfXBloAnLQMGrI0EWiveYFp1ag6MPZfcDdDR9qNAi02zde0JzyIU1Z/4rLsB1A00bO18S5niM4ecbhn2hXOPe603elZgXe+GZGoqqsL+UxpMSbyfWzZsGa/vWcgfk5OeohzZwLW7pcFcSZGdEU+6wiFY1tbajEdHv9B3auFROzPX7jPER1pbClQdaUXWI9kIJMFwamCPwKQVnqFTYRtePkK+qAE1Dco1QCRy62a180B77fFgj/vUt3H9u6OShewzyNnUpQk4GHTRUuRB2aAb2FfrHjoZdW3s+qcOsHE/LM1naVeoWCgaJ6KNKFOnXinBIKZBc6+sH6JQAQF0b7e5T99W8Nqw9U7enKcmQA8VpNp+W7Wgq6OxtQjuWltwPVpe/6ar8If/jprlFA3muaKq288c+vvmQKGBh9QglND0DOld0tjxtmbMbSsT3RZxNbB6UrrwMNGGMNIj5tP1Wi6SzM19adh0Sz/XpFQLT5Mbbn0+SKUST1GMEknme4ar4aBJjOJiTvRAmVHcjkdLMGTNRoi3VVkHs0jH90oZeolERqDnkOCtB4kDzH6jsV7Ob9OcA9MpGWMffkhxmaBFuWvpkvLEUm8oEzDWtMQMfaMv9Yas0UivJ+SOnyimZv6+EOlbEWajfMgu1XiJJ0LrZJfgooCzYzcU1/F13CQ6Sq18FM+HHTxy/DT1Py/6QOoqr/a1UWRTQrnr8P3DHzbo1wejw5VwRdw3+3KB71g/08avw98fOk2KINaAzQvztJ+3mqI5uiUmRrleJPy8TyZ+9TS2+wm7ma6kbwVX6K7LwBuqXkhK1y0cAZY4Z74A0E/cv4Jg8GxZ94S4mMl9hxxlK4jNY4I0dD07aU0YvXJLlTxtBxnqClPse/PVOjEAIHi9oaLim0MKYJY0/aa2wknVfcahBrirW1+y2ew7hFc6IFDmAsmfBr+ZPdICzEHrFs9lkoZyB5R7ahxJHHwTwZqMiRTIPDrLCrcy210Sm7aPajN1fz6cTWjPsE99pKiEMjiMamTjYFsrS8hsZWatJCVou58YJZh6+Ua9WZ1eXL4KV4HNv+usxTcI2+AVpY1RV7zI9eVcqXh3d6xI3O7Ev9jLvNNBleWSN43JXwNEHYL7KKUNAY6ozMO6q07hMG0SmvvdR0RkSgTuGoAsn03kryEaieuLhKfvYmidmtsEUnZlQp79RnGwJ7nvnopE7tFAYOtNTgbB6Yl5f+8CKjlgAWkzTK2eUR6QDgJqV4+ObIs7ZqBskf8idTcuNFFffzYdIQyYBh1BxhG5xHB7Rjcv7ugvHraLwLK4v4CKhD2blNIurBrEJmAvgIUOxX2pNZU8ZP91RNFVve2I9CHDROfI/PZYvjFmLINv7DJvAvjOirGlJEVbJALKg+7fGq1kk42ZxWu1ScPIq2vPrdekGUFI+JDRNSd7ExkcMSbaQABE3t5J5IPTZtpWL+MoEKx6z2furt0gPulKiIf8PEwKm21IpQkNx9veBBTd+lKdCSFER3xaGmczoEOX2RjbZ0l2owDWun3Ha0Xkv7Rad4jt4aF3/pgCKOMKeUrEsJn6+VjPnlDeYX1a5GAyhP4cNdlLKZkaYKPalFPdiAMQ1zgvYSjk2V0Me+X0Ba553Ur/nE/vqZ2wtgBDF1+TGMnAuoFit9jxM9Sm5TY+rbxE8APxDPBHDBEkcDCZrvnusghLkyKarAkx4gL1zhMGEQasUF/z+qoWZ9KBM2HRDtzbOLf9TSjBc+7SJeQHncR7vBZ1ulubYhckZ7jJci9CisQpkQk88DL7cUvYfU+VRa+yEARPq0X6waXjKqdgQSBpBdXBvZ2Jp2AoEckiUZNMnFkX9VG/pPPf247Lss1zcQ/3078NABJU4qmBrs/fe9NibToeW4A8OI0xydILMixfOKePEJkH3zvBqBsHAwTuEoHi/vk31p1LykHuI4cyI+TOdcudpdUFEnrRAa9b6+rWsbNxr4vAlncgvlbpo9hoBxBTNl3OoBxlOS3SSERhs/d+Ix00YTgbaaHHBcBQtXAsppsX0VyFOzjryGMVnZK39MtqwCi14Qkom+SUGFUk8OGNz45CIiIdTOD+2jAWVl6Ko0hvX8ibQINcrUlEUV/skQknApwbSXeHXZOR0GJ8ipHggRzfcLWC/jCJyV0vj6FPUZLkV5H94lOKYRV3qDxR8eJcToQldW8XvOFbsMOZUlxHuRICRkPG2uQ9pdmTpF/SHhU6YyKvUwi6l6uKdYpIB22y0/xgzw++SzNP01FjqHjfharIn1uaCbadLUAYpfh+GjNcnr69Jky0KUikd/4Q3OaQUmv7Y/bUpiQtPx98VLB55CJXOehKDNKNHvPjyg/SEMRj8hcJUCGnGoFMA8x+vpfMa6hY2R6Rlr3TMbUbfeZb89m/cLeDn05JkAjAy6gdoFWgU1JcmC7wSA8qTQkxvE2cACFggZYz9DZ4YsmmxDrSb6LAkvSMEgvMl1SX6N7ZzvngyVH76MyqsfrGWVY3Ifo4MIKhEGfhhHm26F2Sp89T6UvD4omEiKWNh4dVoPZPX16nVL9nsj6DXPq+7hZOKgm1awe8yAR6wPO4J/jyggmWjUzIcsrsY4Jlm7aiGLEjAugtlDYuZWRSRyWcGAjSRX5ZPQT4xgUFxizI1JHB9UwC5TjUPyFtUvKK43yqzkzYPEhWIVw9c8BnVgIAeThAmqrcXGj9gG850ZUzoWzF7UcAvCtgqjtFD9LxlixhmXmk6FyBBv6AcqP1Be8PRaNUrCcKhsGcMTmQffqNXCHeamcwi7U/B3GPpkPeytK9HFkOszUv0t/Ea5x8WA1ac0Z2dj1GkSEByKUBD38nKuH86eBd+jYMU66IBZiJiSWpyOUBLxZHakM7rlf3nqs5koXN1ZELoTsTkkzOJBv9GHLUL4js3Z2VBBzp3pk5vAgc9WFRuQBZ8GbijwyiMxtl6+irzfS6DsNQ3HMMOC88m/EDMu9Tni8oIKbcltsFQZN8DJQNkQ2ceBpHkrf6CZv7RznLSF68+FRG2QVv3EZWzX9RT4KbPy2+uZxX1VCs0Rt7476eBWOLWpnG5Y9Wm3ARUiDa5/AJDM4ITOF2Fryox0OtiJmPw2Hg+hY21VEbDj2bRuPIEvhBo1YGkj5s4mKEcI3j50Qq8w4j+ZxcSb2Q2pmDrKdYGDSU0/cqJHqnZ0WcrE/iR/V+dxBUjBY1ydBkhyDHFGwW4LBHLSY/HPx97Wgo+9OV3QY/WDPwTSwazWISqaK5X/nTTeVXqz3B3JFbRm7Regvgo+cppgjdlA6MFOi4/33ET5dtoeE/jS4M795kG7uHuMoHJBoUvm+qmvBdLaLhk7Am6lWl8qtkt1TVUqQYPeVLMkQXOw9gF5jL/YV/NI2iCz35+0K018LmtVk6IBWM9tCGkUOUJzPRhWZmMcNLOnnqgG9wIEz+XsaDhOUt/2K6ypeUb3Tdh2W8aPCCSJ0A2B2GOdZjzls06AMfTymNIz+8DLYBQweMwCYKPy0O5aci3yPqDXBnVA4BTN5MIB90zl60MSUmReo6OEIE7zmWnqyncnQHzmD8vHAFA0UEtP/3hjhZk98zdGRInbBgxSe6544FfBgLBytPhIqtXQE+06sYdYhVKpKNi0JXKJikwEUcNcMBIjZUGglEA6mc/Uy5iPTzcQrdQLfM4GR6UzgksymLsvVokmHYUQOEaDKTzxqyUxSdJ7fiVQczgttVkQjvOTuqAhLzz37WFq4+M1TdKGEkdkq1Ypuhwp15wyX+bav4RvZDxdAzr/MjungSm0Ein2GpDDXozj+V829GEY8dWWFQDsqVq7ht1GO1W1No7p+B52PgK75W0BW5JSYUxhOC/PP0Ya9Nij1S1ahxKD2SEPWhJQ1/eARbuUZaUh99O3rBaeKi/muWBRHgmAKVmVVGqX2yjQHs/0W7TugkKeKOqKxEUx4b304CewBHwJSuL2mr99ew6AHAFOqUPtb6HRwJcBnYw6/QTgg0b5UTC9fqaLNigWICiUxauql3IQFOWMYdvqu+wKYrOA7fC4yHqdx/sBWqc4+F5lc6XtlLhczZ4DOAilXdEbXfgfo5JvVd4sK8oHIbGm6GzQMwhJzw4/jHjy0lYhXOOIzcPTOmze3W5zst01X1Xr+ledmQ4FtAPzgo44OhOzzSvv8f5U5m9CajsTLxsk5XL7wFTQwseM3q2d7istzvOKDDqRjjQhwpYeXeHYsu9EhGehAYfd2Oucm0ICyOYEdgMI9LIyESV5wOkDv9dITDpl2TOPqxkMLlCYRkuJoR6Ad3BolDoaV2u7zM4XihVZNnPJ0PE2Fcp8vcYA9Fjaq+X/qpUWUw+1JIjN0N6ikmSNTwq536wZcI4PC2134s4KHsN9CO415HJxVYlL6b38tt7mDmF0hZeAIaQ3Pp7K9pSLY4gRFjw4/OwNU9SpVOiPyRIsTj6pFVC7iJMTdbPPFG5voDD/+b9gVK9HOaupuKnOdxhoDcKlmiDP3wRSEx9LnHx19fiFXRIS0p4Hvk/XGLlsiztna6OCGKG9WdDOr8lFkCAl99JOgWXVsleV5ngAzsD9MuXdQUr/mxtUYcJ8vb6yYoWKCJstaA7sdGtYYAhydQ/Apbq0e9MPvUL5hlb6aaBvvEe+EW4A2BeRSolzq1+QfZR7UvYOpk/xS5/GGdfRmym1Ti8fTSoORfEKUrFM8+QDQ9KA95uPrck3rohPR3f4Dmyj3H9mp25WynvECG6Ylpmaki6fjTV7/FptmAOoX+mYh+bsi3AJ6/ZlbqPjf3ch68cvMPVakatyZXFpa4qoTVJUHrJY7fegbg5lpnatXRxhjbSkT7qno/M2qFqS68Aje5SDivZWvXtSSz2qo2e4ZRAFfBISahCe3htFX7vRWtmUVfoRsXlqgEudIhOVMrpQztGL5xZ/5upFkDdhJwpZVVX+Y0T9gxa44CbeXK4ESZwUQzxrnijQRqysxLGSQYHGWhU34M3QKCrhDOMjUFI53T6FwIXVJXgqhNgJpfUed07QFe3hbeMVMBXoHl185zqg5n60qoKlowKF3Fa8xuFFLrdylmCP+KdIxeVJ7+BXNLZP6HVdsHqDMoYqDKCy9VK6qmm7+1BI1+tUpY0bU2AKh1s8fcGfWnYD5kEobc8RgeavsRpO/CUZ3K6CfkiU+EUYgL7OXycMQ1z42j8F5W/dGEQg2OvGCiV+GVOasBXmghb8e0Xkofcg6mIZlRfZONX73kYObKqVVQo8/+4E4zVntQy3ItU1K1HkD11Ut2wBq+cyU4yRQDx2ziwoB0sbYr1qP8gD/zHaavvWcLNjlLEtfBfPxXhlE7f/Gfs7g2mCITuCt+6ty92opqsoK3NMQUpxFl9RJ2n1rakOgZzR1h6jWI5pxbNbYkXVUKkTbgZRvwoaDRMATUEF2HS+YVhZ1slEWuoslPy1xQoErRhNgSdy7qvz7H22LmRDVuIv+V+s3cx2GOdMBh4cz1FFcR7wwenA2e9SA20z7NjxTnombROO3F3LagPLQ6kNKwLsO687ziToMluv9bYMf3SAxXEtOMRHK5RLVddohnm2FUPEHUTTfAwBANK0Tkx2JHAjE88thfCH59y7583zZqng8vxde/O7dffzyG6C+hrg2+cS1zZXCLzNP+LEQmI3Uu9Y2uTyZOImlEQqXK5hcYxcQfDhvUpwU2ZlLB6IkRYxk68oowbrIyIYZZ9zCXJphHs1WtdyJSaJ4VwKZLhBEHwUp9CL3cSaUpTFj2KFPeFBouK3R5aIjIjUaLTMnF+D1B6F9MKZb1c1e74lejZomA7x7eB+4JqMajgFwsx1/nQUBsc6wCj2lXBzYwDDuWR5QwcNn/8YjWYwA0uC7wk1Bry1t8VHy0y3pS6H8vv6OsbUfx8rea0THVViNo0rzy20W6e2TGmGQ7e29TTg6xwyhPuqM4i0RHGGbMULvbgFnL8AdU8kH8Gihoxom7srKFwyAkwBI4FqqicTtsWvTLFfuxXt8WZ3U4g/6F2rvKP6a4iY0D7OAczzCITi2VQo0q1awvZ/lVc11aCJncFSKHqjFzjNc4AyG1+8Mx6tT0RFuV1YUBlJcuyYjLElQtOW+gSNJVyciUzoNoNEq1TlxuFXOD2HWMYCltF5YRmdcICkWfecCaGD3UVIiJhMUgYnODFO3qtHb77+aSLyjTW7zBEFgEKgqh3ydJe55guSkESVZt4BkgNp4Yb2wMTkbB3KiAhHk+9zQK6LoAI7ufTKsdF9GrOw2MXOaNtYu4ZYkzqGmDHURCckt/D+hanmcAdZ//V/9pX7dIsgeckKy/7hvKjvZ4yJmG5tYPtNPlW0amD94m2ajp8RjPabr+i1lO/jKYFkSX/NqdY4Iq/h8BOtj1sVggui8dHplQKDV+FApjftOJoFtpn72IT7ZlT1EyZzTpA/v8Hrt5l+Un0LGa/UcmVU5UCmr6AicFaihOR8AFEXqqLcQhLT65uIl8IKlAFshdIxIs4+r+gtxlMSr5IZWlibT9K+nd5IzuCOOPojJOPxoL+k57UQJVlfhcQhiLBSBMdC1dBuP4BWCUbLGhpJVBGMI92a3tnN3ZwfGqn1iya8xhnOdPUTDmhIZwOM0ALzkkP6m9wGWpkmu3EqcwHaDr7kj27LOAXvxj/D6GNACfmIp2xwY8XVoNmY9RkU03mUeWcit7nl3LcfwYRV/don/Y8QwZLmpSEK+Dtz9fHrqzf7R5ZXajrxcnKYwMoz4f/bUaQnHOwuk08wo3EknfXu+z1ZVOkO+ckqmdtCtcTmcnry2OOWcmpPomqoir4cJDjjSI8XvRgR3OLsDRhX9COltKqPTErN0Qc7GRjLKoCRY6Q19X6AzduV6VjjoNeOfAEXVk2hMKSzDAJO+3//dMRR+uYb2F8l8dPd1S5PVPA3wN9w6BSIKhLSzXYwuBCz6dx1veBVQnPzIdu5ytU9J7raxqyU3Dx/z3Dn3n7785OOw9SU+bJaevX4VIXXKD49vc50Fqr7DGBSOt6XUC4pPeAQcZAtioUBlZlP/vqqORT9o0RHL6Xw67nFNtD6/UJf61uvhlSWmo7CTLNmetDCevzwkcnsTb17+xDPAu7wPi5kmrKV35qVdrs7jpqcWwRoFPW8h9FaNm1EPzU1WeydWAOsMup+symda8cnInblAY0tFvQ/RiYt3V0Vv3hibIqh3mAflDZ3BVKCZoaa2xEV+M3vRo9OsWpBS2ytZQuDOiicuOUNEuGLZupgoXA2PzEAk6dXC/cSSt8p0drkPn3BiDW4y4ecduTUjY6ZvnASBWjvgHR2aqVJs43LLV5BQGKgyLsBKoozS6UuBjIgAD6UkzeXJ+uiljfwpkuCIZBu5y+nAO4lNhnlaXL7t0tM7zrknpTzm7Dp5k911m6EMeFhnTzncuB0GUNDMxmh6WG08O/mvDQ9Qj5yOHYjAn5Ryxvitz/ET6qwDZq+Xo2LKdXt5gJ8kC1t2WwOvKqT+B9I+Lkcc9ydNjG5WqFwAu3OY0NvQK3xq/iZw5cEBebg8HLhj0UXXrxHlCFBh46POmg73itHgJXk6j2Bryo6Uz8mStnfsxKyOLrsT3uVl+nhUNHFMvkAG1VRALkt/3eIiXkeA4hq3VQIs2oNkd6dp3RMGlfrirC19IqR9DZ4qEdzIKpKZBcB/j2PKzDSTd851N+yKJKkD7WNn7b8N9seIKoMYIPfQCyeooOMHe44RF1zz5bP3vct2CrUUcHfxB7Iyww8hUGG2IgpNdnAbXwBmnXqhKbjbZq6DyBXcYTNH/62OYdheZrhrEJ+LZOwP//PhV5GJ3+Mje8mx+0GJ0Z79A1eRBD8vxCN0XDeWSVEEoR8BFA5im3umI0477pzvYvsG/Z24Vx5F8l8XPw/H3y2ll4hBOQ0lQYiEKVxqTbi2NOsqn8dja6yTOU73InamExdCi22OfD6unztEKzDJymn0AyfzQiUuv6eKbLe2gT1eGXVpu5KM4yiplLVVaIospFe3xP9NEWxlXiB60JsKyOT1PdRTR+6p4zrcwOYLwu9D10RMsMTJAIFMvudCxGJdQasC9i2tzXY8LOgxngKMlLvDdsoSM8yxucHdZR0OlJStkCUvhSVAXv1e5eCk3viYdZV1p1JFocxQeKmRCeMD6G/gx6v0Td4pQCkNU5DHA/7Dw3LaTKvQ3z32HY9Gq22GlywZyvXNH4F3EBs9IAAAGftkLdRdZjyjYPuCnXBpZV3cayG6LgCkF8y1TROfYEV87RASoLNusVM+njtTqti3HV+YSEDOluxKxdfuEZ0gmtymfF4yj6Y7a9SiN750RFmdsn4taUmjOh61s4xpCJeHHnTilH9oKttqMaF3sS+IhVD5ai2uhK6Kxqg80xt3u20k2HM3cq2MRt+NMYV6QzZD2fwN7FgAAANMAHiluNYN0OLsT+SwrGL+t7Jcq6qAKltvLwB+PHZAAGM5AAKpIUgIwz346vq2GQLFQrqD/WaAcUL8omScW71y0UvLsycsqJAqaITED5upubMkwMvS2p2ozoG7v0lAZjwIE8hpZ17XBXI31mvDA5Om63iBezlOnK9zC2llOZoOMMZs6RvQfaTsfoyVttmSv+To96cR5x6G1NHTqTf2YK5KXd9umIcY3OkJvI9Vo1DVl968mMwlNaLdaHyAqBZ5uuaPSOeQbn7Gt2gfDrfiGI0B8f6wAj28GNN/Y+iTSkrFgumJsfSM6/vyqHXRB8hvn7vir92aR+nrdqyrCf+8v0YgIaiHkpPVcOlJD5cKk2c3kWFwuzUoSWaGBkOa6DcLbx8BrJ7bU3YGTdLjUQFzrtoNT11RqGNGk31hHPQ+kEaWLVcygEnYE2GDwJWV4E3wrrbXMyhSVgrqZxgZRff7WcN5eBKGWVIsuwNcGn6GXp27LVNXNlz9Kyg5wQStaRpOBlQGlHndpMgWjXsxXX/eMF1PaH8Xqlo4yThUfZFDwhjNbYpk8nI5kidGGH4DeMWg4hXSEPKo5AvgJ3JujY/XxsUd6MKwgBCKJ1UBEAMxJBTTPj/estWYERRMhaetweMYUZ4grrU84NMeqxHrFlMRXAzTyODgYYsKRYtn7aOoZKeEYmeE4OX6I2BuZgYt6I8BTy/Q+F4A+lvkglA9CjO4HUg8yDvaijkoWsyO95zgOo0Z9tIEhlYbhrsTJIwTQBnp74MFUO0AJLNhrGzaC6Uc/28N+sCIVa4kPgs8hJ9mueXD/AX68PZckJ9/lvQHAs1/9ocNLRJT5EW7Hd/gnxigCfDMgxGg5IIeCdw+fSMyg7PR8zXNR9P37q/y8PQ4yudsyqz0MIScreoljvxJXRSN664fnklQ2wNBk+SowMpX1dGo7tHCXOZr4Imo7wJ/8LRyVzJ++JzikOgkUpW+xiEtDcl3zZUCYhTNpWGFLruKwmcDuIOozIOMXQ8nFuo4o6jvd3102qsIUvC0wX5rpD2NSXWBmXfdqFCPqbZROWxebh0gh77lyrN9bM/cM0Ufjd5rVIXd6c4eW+GM5EHptvKNgg3xnTLt9VUhKfFXBh2xv4elkxtUFpQ4ZvMI7GIMF1y2b7TscF2hWLZnQkVAJyd3HdB859WyiarVdYNpDr7YdS62/m8wJEO+tGczBi4zUocQvT5XmXJed6rBSvovapaZZq4i0rym8JXP3rnX2tmVb1gO5SgFF9IyFcbpkuoAlj/r+Rgfmafj3cj6LoaYO0HygLjuHnW66cvcABK4HbCoCB3HkHGbWEKd/H+7kQfTigf/KBhaTx/m2hgT0MJiwAXj0rBok5QZfxVtX/zZykVqU/+dwUK36Vy1QcNfMwqhbssbV2GM5VyexhwMEm7s1a+46kXmBJb7zsSVXy7rasu+AXcTZ9ZGTFtxO9F1b1Z6GwKyNu+7yAcXjWUwZBThnGXE8QJKHYYehZ+JnIwtFPupOLWT74omSxSo496y9z8Zyy0FaOxGC/1NUv70dUTvSm76k08wi/roKDCctOMfoACJrKD8IB2z9pnNcVjIiLfAAe302PUIZeY/+/rr0PfckH6JNzqcaNxRwA/hbWlaLlIFkpual8RqAWOrUq53w6/hzFHETChFAu3QZdreJK55+JM7ZBIZLX1hPN5ewjZBDjGgGM0JEIPJNaYuXhxJqNRe8agUxM6OYUE2Vm79933/8Nw4f8kjzd+2UZka837tXVy97hhbAv1aRsnA9o9hZPN8qESg5c0YWNfDfqk2i8drI0j92af5DLA7XOnxlvmw8Dtq2Dxl979bWo8ODX0H59uKFDHMZOfisg4tRxHXPklIC2sh+D4K3e0Nd4KpY5wlXfX+55SHZIuFQHeB7tVWTJk2RskKYm/syZpTX5LINdFbTY4hEhy4qhDWt3tLDr+7Z0gB7OBZKzs9Z9R6Uozj3nEerMNInHIPT9wKCQUoCvFUcVGpg7PjKEWfSV+PTKTQuSaNJPqkRKAi3vqMdxOLw7Va9PU2+oYWO+HBUC8kmbIQX/8FPoBFeM1Pc+dqthUf22cZA+rdRZPxFsX1pOeF37xg8sPYn9Ba6hFZHd6kTlZucr3m4iXH3n3lYMopBtzNVov2g3Gbi8vFnWnWXYe7pZ28Rm4l35j3SnNANcVVK5+gIlVeN6075bJaVdwdCQihEmmS2r6vFAghhLTXPFgqeQlGfotrV3/dRXNV9daxxfiwQRxjv1kWTMSfdMDvgZ7ay8IjWvy+OAs0SRVi4Q5vNpuLO+PbtTjT/yQa2n2rAWdNh38ryNJbmRoGPxSdaQwRH5IzG/BId7hRfqO7pcLsclmiZPb4ec1ByAy8PcSxPOn+/NDPAWpUwusO9DLXDTZyRlg8NaItvHL+GXp3SJIg3FPUPhlEAD5+o0g96u+xsDLo+JZHrtDM0zJ4HSEn+ujkxkN93U+y2dIuJuNrwQV8wHaaTVTl4LNxSmM9DWAe9YhLkMsr3OfiX080VbLb8nvdJfPNbiMGtjLMknqpcMPlcSoR/gIoL4qVU54o0mA/5/1rLCun1rZmnnh2JjkF0rDhli4ptdT2ZV2xgc3CCaHeaf/kehUXt4K4XdnZQGZR2ySmo4tRS5+TTB26mSl2uGYgOZdjyAucnlISkgh9qYuRKuayn/eX/YxIazOERmLPEeL93qZAPcSpgOCJzozv9TzxhR6rMF5INuSTSi9wlX7OWlNuV541gDbSR8f3/318Fs9bN68sxaCBR2VhQdSyxcS+I0L9ZMx781INq4+YF0KtfHb1HnknuIzwNa+qgyqsqa9ZRU2rUn8qddd2EVJFRl/ni3+fnEXU9jCL5PQ4Oxxx5vaP7Di+NX1UjEGxXX54U4Bp1vhUrtKm2lpXF2iZajdYseEhQlFe96gwRjlFawOJ7VvCqWNWTiqz93xoGXAP/Xu7RxnpNhekRXii9+99rR8UVq3rbMv/Oep1tQpGTo5Pcn0VyH1xhcB3lE4tKZqKBoh3NCHPCG2BG0qjPeXiHAuMk88l4lyJFBg7uP4L2wjDotGts6DHU3Nb75M1vUUJv3cvR4n6GuuwYnZwEAEXqEZJSLSlkNwV8jM/eGFlKBC8uC8HIMH5Op7TLcxShPDrzMSuTcSGQrW58p0KGiaQxScNTekgTK++9v6RnblQOFTJUmuOqu1HCGaLht6nVOwq1HcS/1pIkrzWVvK/rh9jOnZZ3CwZfUMY238xsc0n37MWtFxj6Ft+uuYTl6TnMxvvMkH+B8z4/9aVkfVQiXTKgxUmO8gA3B2nbndT3TXUiGcbeJFiy3IKI6loz9i9826719DR259ku+XZnTrPw+NqKpNwnlXANkvvQqTNUSqgJdAjUqddnJwE6ba+rvHATqMoKAqQ+t6+j2akZKYc6XtJrtZqHBVL7XHSoWbUSZHXwdsgxa4xNZRuW62UCT+gy2K7sdmnEcOAX05Bvd4H10KVayAzZMHutMwfdmOqGzGiNNR3E5Ak8V8t36kXLUN2eS730CyOv94JRO59RpgAdKKtg5WgWtqD3AO5UAogSsWw3zqKkhJB66ngojyvka/+KperFWK2wPoe0gkwqjpZTQPWvSohTeZx64rixa443g7DY3BlC8GUGyK8E/zlrVy3SSS3W2w+4YIxUgy03sQDIO1y6G1rMyHumSwW/FvELlwBCOPvQxEE5dIDN10r5Z8emvbU28yxLelUp+M7heMv7cJ8+YOL9rO+JJvbyz5KtaJE2UBzqLSKH5NflwH5jtH8mv7MsYgPh/ke03CbtIzMKEEGPyl7LiUUbYv1jP+PF8DZP3yo8UI/roQQyaZG/MJvOrb3/CPBGwFwf1H69RPBVCd8uLLyrgokZowbEon9Kvl4ZODvg5uzXhDSt7KLb5Y1gx/pXIuZtg0EWNsFWnLPDi5WSiGOoghjZjNTWylNg7017ZiPXG7vvMSwajShbpsqOPFF3gxbbMIb1H7KM1Yt8TIjE8f3Ee6Gccl15QqXdWX9HndLBBxvrbwr7jV6G0AVLxk4ybFwC3K+uqICMWmIsCO9xLssT39fZgqRYzQOU6gygBDXrDjjzdvq9gKl9KuIz1IR0Z0aIYoyiRv9m+NcGh6b0z3U9SB6Wc+b0S2GN8f0IuPlFDzTS/xbe3eBf0yyoPh14nnhVAquSncozyTZbEiuQjfrKZ7QI1R7iMbh2d0i8PKWY9szWgECaKH+8t855dkS8gs7jN0nN6dAU/QMBO5eNbUZaZpl6+u3B6ON97x9QeRFPPhxwSvhcGXxX00LJvHeMwuB61NDbisgknsmkEumzWoEi2KbTposiXeZqT4S/DncmrD3vzn5wOfR+H3ud7huo/quwoD4BNvRR6Q1WjeTLjIe4sLSc9dfUE2W7otVqMZ5LlSlldqgRMq/yKxFRtQGdJjCk9EN2Q2ZQvRlx3BAv+rC4irSZbB4AQqnbrs86YvLFWXdjiU9POG2b4GVVgX+tDnhdOrjndH7nfJY3Qkoc7bPfCV7hmrk9ua+b0bNNOtvOR0Jmehwwhyvvv36uHvXYJ8E+o5p0htpE4yx+oCPyqxKGM6GXVXq0CrvuoRVW70kw4UC8Rd1cC1ZpCw2Bm/xx4/VwEBOwqgAHMU44RIotB4pacgqe9GlhsTk9FbKuE6RDS29tuFZwsAia2VSldOCIdTpPOiCUlpGkVF660S67SbpbcX3vtCQZKYJS+um3w90Fft4HqpsPFDSRKBRWfX4Ca6t7fsVNzwuNLE7wmSFJQlSBnEFyXFJjH3py0T7/kv5aC36swf5fDbHO8Tr7iKgWz4VjFMDUtZpRd1+DpZbdv5vBUB5bfdoQzsFVRxlyjNCaZcim/0X2gW3HuVmYU4kPFR5vPV451P73EgmVsHCwoK0CY568poxwXdx/KDcoNG8+OI7e98V5ckyNM1PqIIKcaa1ceiOF/Y8Kg2rcxXiM3RDYzOIllbDqHs5ribmELOB5DXvEpDVRHsG50K6vDErGghQMupZktIpVvgZJQD/V41KM38xIuFRenAIet5vL0d7cSUl1zALfJURYQ0zP5XHCPJPWCpT+SPlpZwlgpG6aEGoVnmpWh4wxDRFgHAFF1hDll07QnsB0ib7+b1xLeEaQzadjoU006c/wXBqeuRwmyLBnJsz1LAd5LQ/fLJnOJKDYebkmjVcMZFzQDigQwzaT2tnMabsD2xxHg2Ngb5b3ILY4rsvZQUa5MPYmicIGEed7upuAVjsZg1XXVtau29TcRbo6Nrxwbgq6PQAvWNnRt34GPvrtULx5VFilg7N5uj4GlLKSBCDx+e8LPEciX2IQ+PdzRT8gP5HJxKkCnDHfAz9xTjRTvZUMX/CwXjYn3OsU5Jsrolea13Dwg3QCo8ymVKVxLoJFbfXAT2kWYj/GGkYPRBi2HHJpIuRgSmZTkoWP4K7naHvcmwJlXO/EuZEKw7frMJqG9sr+25Trj2qLFgwgygwUtyAItyspTizQ75hyJbd/EGugvBEZ1vCg/3l8qchOu2qddrsSqDf0yH4aRbYgzu8KqKsL5CWyjputwkY93eXsMj5ihGiwTsuSPBfX3lp4/nuZYBqnmNbjiFu/ZecrT4jFJUGE3YjZiEezL89Ws/s7YK5JpbB44C/F0UjjXQDNpHsyhamQXoxnpvNslZAiuSFYfxIvALCFlXocn1Mvcb/KtDfP2GiT58IXNjX33sHNdqT5m7BOfytlrehyUzKRYv415WfUcK6AnELFiCThviC+txcp/RTyduRC+wWyXFNFBSggwFuLfnKemTAKifg3KXIKKxWKY824a0Er5QE1jDub6kIAzQmUCatCcsw7ro8Us6uwXiCPHVpBH6PXVJ4P/BAaqeGRwoKJOziXrNUEJwyI4WVpMffyNG7maSRPhNpTtwIZtxX+THemKkvoW7FsbCyumWss8/6lMwN/3cPVhSG/n1L1guevniKD8w2sn/gJDXMMBK4IKVk6twtRp2U5pqA3pG9bVj2Jp/4aam95MqM9BjCkK/tpdvKS0UaheDN0UWwFhsutPsxXLnLd6HiRDpFZXFHF6WAiWbnXH3Mdf6xcScPPE3pprQpgoDocSD2hSp+t1eT6P/7+JZsM4py5UEghpfX2wPu5hjH6UYhOijmqKRxabE9mQBPF96Kmve+UY9lXvMACWNRP3U/gzTtblMIqowL7hc95X16Yt59jcGHXkHuEHXg7UVtxGr8iTJ6Hk/GGeQw6cKckh8804BU5klBWjdAS3zBxuUTk6sqWBFgvGfSSDCFcQigCrNn1feFexxa4C8o5KqqzHxmoPhy+Wql859UHSU1l1Ic3pjt4dtQ9Ib4lcyuC2agbrEIg4wVg5oRtHqBDsEW3gSR2ZbKIyW/YNPXcHXbhZTIfou7ISJgYx6uZFLBUA1wlG1rNm5DvIhwJ3lR7bR0a/NcmfFx51/mvLQKcJ4bAkQLI7zb8V29r8TQ4edhc+pV1J6t0R+xuo8a5yDxKFWXgxKZVpZefIzwkNTV5Ao7yyeCXQUf2lrY4zleDpLBG1AW/vnB2Ui4R11xPMGR17wI1sy95HXxpR+gMDVD9u273MrFOLkJ6pDeHBnWXe/YAi+ckEwwALFBbMvXbYKgjXlG9q8gWoJR1BkHmu7M37WMA030ktPiaF1EYqTaqX1jNdPUMmxcA/21gkeVxMNxNqNpUrgg8s03c/geAy09HsUEdG/OpikK96vQ4bhod5++p+VUpb8ne8SV2owq6LnHjsSKEXn7D2Kz33MtXvd+3IfhAUemQCwPm8ncvFWIrIMGIa1jBYimw1lLKB5wMeB8T9/vDLXIQ/S3bQlzVG5vTlD/qdoyPyghOYAUO17reHJ5T14FB0eLZv0yL0bV4MNQRhk9mxWD8zeDo/JALGyerWbqxjll8xXjWYTdfhLdDjc81vazeacgOBF576HZ8YfWVEadRVmJfDhjgHYkRfufR6AwOMkfJBlxeQctG1pI03pCz3E1DFUK3np292oI2RVx1EjZqYoCkqmW/qBabG7CeWhu4qYRIynJE7ytyBoyEqh9nI77wVvv3RzAcFHDBsn5XXM5iCfR7uh/XYdrwgm3DPFsq9sxvdpfiNaLtL1r4CTxXFA3ZZ4hHBQSzmYCy9SHmDrJcIjU6EyKD/xYaSzZaoR2UUeXKztvCZ3nlXsi1eKC7jEY85jgW1WGjid+Q8ZPSi+GjAK8HawPgZxS2wKninmJ2QH1li1ACPXBsn9Xjbc6UyORNwtz9gW+9HjL7EihHVBu/h5k0JgcAO1q2YUDASbVHNmRZpYrxmDNpNo9a2430UNyApShYlQcji4FUtibzLH/8MZ7421XLvVIsASd3DI9z7ld8LT6qui94sRQtsMatqAyXlp0giil+dDixcTLNdsMqbvPq0WSn4UvL0g6iikZE/a404KxTrr9fMk0xUboNLlGciAHbrLcFwo0hcQEY5TpWRQJTs8c00p1E+2MfwBIQaiuEu5bDzUhTYpby20WTlzBvpVP2h5ZBL5OCVo/CrbS/g/33i99VC4c3WHVw7/YOtNjgPnJuKdFyWs8bc3b1sVt8rn1HjGW69xCpuCmdJTacdu5wn42xJeerulI9S3gohoknCwg9EZRg3WcMyf3U+jvBylQOLiRmBnFXIMfXCf+d5EdZAen8sJ3OEVlKI2RPm8NIs1hVBxZBwJpm7unGSzD4FURobC7mVtdZezYMliIZflIo4coEijvloaDDwozD/ck7Z7JPvDeHQCCzIBb2dx8IkOFgtHb2rDQNROqDi1Y4QcTlcphvDeovgGjXM3qgbLKFpJElGefM8lTK6OpRFQ+KdziPBDeI0u9DS05om25L0ToFu8jx03Jlsq8XSqGx9s3q75giIPMn4DOMsZPbV669rI/i4DTj7BWRexL6pJ3nD2r8hB1Cz/eI+U/LVIe+xNl9E3iP6H0l19q2uxFOqchAeVz25nm+jOGNPxb/I1KlZB8E6New5SjmpbRk0CjKeHVzQwtIKSKjdUUV+W9E8tuvn2ZaySg9fM1fxG6pHxZhihCiwKfedNDvFtHGQaASGL6UzaxPABIpxmng1X2zSuoXs29oWs9FV5Q6zxM4JaVYmfvaxA6VrJB9FxO4OODsWUL1dzP6s8M3lG75Rz/N1U0ZMwOXzG8zDUAm9A+X8LObEZ3QMNyV+5FQPHs9Aqk+Zx1fUFlWQhMWnMpcwNhJhbD1LAQ4Ffb3uXCzV6YToQD6HxE5TM8JtUH5wf4JzR9dmDHrvtbzjfuK9LQBX/XnXwOZ4ppBqlibmWrWMK/42BkUBrVyiruW1+lbPw5XiiPTwn8BrjbxNlXMonYuYplg/DplkdXOXoUDyIsA3eLqiXbLGaEjPh93eyqYW44AWJry3WEMRhgxO5qF1WoZsNrCPfV2Y5gd5MTtFULK8pwwS98WeNe5eyGbppgsDEHFwXLYCuG2MNp1Ly1FRdhli9ryNRuZWiixQdSFW5zPf060DLHHdRtP6TM72D72VvN/h3R3xOmGbouYFu/BP+mBD78fxaX2fR1oMB/FNQoOP1Lp9pGphOcfOEpP8mV6heTnI8gFc/8w2MxnTYtvhaBL+pWJCKpSlvqVWqi4L9FnlefD/5Sca0LM9uiw3Vnhcezs2EoLLLpXj4+UZ/+d+DyN10X/HfAJLY6wkfOeWjHsj+TZiw6EmOuArgjnHlIqXVCKhPqL1qQbgQ3a+v5CK2ZYnvtWL+7DdMNAJgmEGi8d7SWs45b9ZJ+/pHBPp9Zb9B9Wr4yuABYerlQeqizt25H4Ir6lS8iBqSG2/+i3PpwpSHsvyCJV4sgs/AChTjebAB12pSzHyqFYlf4xGMOrp4pzDUmTpIP/g6K1/CghmzPs/T17Q0dsqYEXcm88io5O4aHGbLdeV/GF6758/X3JKwnfegzF6MPXb9Uu2wCXBGQ9WxLTTEcffe+BUb31nrueckLCQ16tIaCrJLxoUuEWGFdSki9nQ1MYLJ0U7EEs+XDJctn6rNjtCCXyJGbbdTncZ4XWKk9D4k9LEWPdLtgD6dgbivlLMhZGVqc6oKVWJtlDw4ex1fzfIrJFivwrs/2i1Lk+pgTusLA89HtXfve8hfopmF2sZUfMSgPRcts3lVpDsJt8rxtNxRW6yXsphmoJtfewgSlvl5GRGF1Tdly43sQqWcGWvwZkpdxn6cv88TrPTjwpS9da82h5rTW4I6qwasP/PloOqMBbfEu+6sZ1KWOS0SS7tte0ztZEirUdJAd7Z5qzlZpm5RRp76H3BDT6pjMYczOAEE1YnlencbghvnwauYmOMceoPk5c4JGx4keD1FfTFMEpiPXFnnKB/RA1ZIY4Bkr+g1i1asvB5ZZ2eCf1Ay0/+QlZX20ieeCPsnoJIRoCmsbsVkryxG9mlFOWD0xRUd9Gt4ZkVSUrdwal/GGeqmHz3jkPgHv1Uy3QjeYgPWSIJEjAcPLLXHOwuY8VVYAYPpE6/UGAqhKzdTozadTp9j/DGkvR9Z4BROEU6XXC7do4/HwxDfPzFCwGbVEfqbn8wf5vkZXe2BQzu8sr2hz3mQP8GV0tBabRNOemr7aiaKvcR+91PNAe8kHBqgEl4ZagF0eOHP1eXmDWfvdPS4fxPefGub9OvUW3huSCNUU0K2xfdeTF8dyXXJlEv/qo97qoALlTunioyq+o7PGYZZdOhUKCZBOQyObhqV4ZqRVYIHfYrG0TIkXVncblIiFxtGO/PbI+VjObScddSw0sSAVJFRakT/d8dcAUlyP+aRjRJIMzc3r79JT9nlmjURPYtv0Hw1T+IZK/QpKF9XPEFUvNeXdkoV3mUZ5+yqcMsHNo38V/BHuvWyuR97hL3UOrfPkhtZbdT+3p92tI7sUdnbU4b+eR+ZQDmUCG4num/+aSad1WWZZCS2uNRidjoKficBUB2rbto/egI3WeQ5t+RXKafyZ3kG4QtjfiriiSesPobXiYCXelThTSesnru2aITxl5HtXKwQwvUl1rqm2M+4rI1pSX9oOqLG/J2x1akWDqLXkSVQdmsLIUS/x3WMg3rckgaeT02GJrZ4mjZ16kh+ajDYUQqOG/3gs5Svk0ob+jYPnXn14GBGi5oLE5o6psz1xAH76xTYECpysKEvs4Xy+mLeHe6Zd6OAaqpzX6hBk39PhXCdSEm0zslFcsV6xLweQv1wj2lbW7391RNqiMP7P3aEMHJn7SvOEb61kn2YVhNew54Czlpsw8Bbc5r/SW12YxHIMCTGz4Yx0gNhbsMTMIUI2mgKwVXQueVp6yJsVwOvJLOs5tUnymXaaMB8pvpnLWcDL734HhZo4YMEutlfqsNoNrCrZiq/amJfYA4+8qhq9yE8TiIuTL/Pp55O4zJvFnklbXUwngxNJWTLn+N5hxspQBFu1dXe6+53yPkvkWOeoNXcdGeOItnaEgdut+V1/tgufCG4dbixb3TiB0fLTfx5uSHOQqMbD5tMg2xLf25x1hBLF5GPTSAqhZF1ytDDpKG4OwjkBtXpA1GzkyGChFR7kJEoW7gJna3Eo4dMsTQcxrHNJCCREeRwRTZ/4Iz99OpgQh60QRb/25MjkoMd6bevKhy7ac1xilc+kABnW2iTFa/zXd1YbCCeq4hErU21t/Lu1FROUPU21Zj/8Tbvn7Zj+EU8yCMZdAx9N080a3F96BLdqOzcZEcA5P3L+eyiGW+/OgBaJeSaE7qtydpaG1W9pBS6XWdVA9YkySC26+X4UC/pig1zJeGnO666PYzr8tdG+nPnJREg+237MMEpkcc7BdP8qNMHvpnfm32+8TrEVTb0DqXB5x2D0QTJyEH1i/aU/vx6r4iAMUTUkwnHddzhmeUIbIDJBfYhmD9qdrq5qwW1/r4oYdG39jec1IIBXNGjCollzfWQdG7m4lTL6wTPwajRTnmsUYExZvvU1P1hfOCOdju+xYZyTVwFfJE5VnB4I97V4COnJTZwh2GD3e9tZdlr0gV3TViX4djsSDoSWfBKkw4zEHQcm4lxt0FXAvXglr1wewQ5zTFLKX26qWeeFT39GsqgSuklrurgxnGpXXYWNqjBJ6Z34vwwiCTtCFxUDEG6Mn2eDM/nLw8ROBXS2RIYThl1IUTgVwWB7ZKfZrO+1gGMIaDFc8Mo/22NTxuvmQfm3MUt48mGNvm7cYrK894gjTutRj2GoN4J5Sr/yXW4AYOml41xfdjCo1tqYdlR1YcN87DShzPfhwzKR950QNfDBlSpcfBHmJ93z2I55Sx7rGtCpre3J1hYlWRV6j5ZmIxppRQ053hddr8ftCt70sWs3UJrZZZRayZvOXLums3C+9FtxoxqJxWSJqCDrTr/WvimWZ6x699Dl7nVymICOmUwYDmfcL3HuFRqDysLHyG+20ehC79iBFtd23O5p08nxXbq2nxndBKYAS/Xd4523Pg14gdXvlGz1StKSEcBvuGR7J1Kr7asydQ6FCxnQ3mtplIrjFdoxJlyXjbN862JiMTVFifPasM5mKItNVse75oQy9Ce1iujUFkV++54EuU+sVbMNv/2JwaeYKtfQ+pZI8ZY0UvdP7w1wvP7CC5PhMvFDNllgVIg+rtyZc0m/ebfZOneELtecBNfu0Q6datSxwf9R4jcBtiHISjZBkKZYDw73ms4LzVOQtyN9Lxh5KhixqqjK/e5ba9Bo4OEJI9HqZLaiZWJNGVEakBe/3y9z+7xtEiTfvlOqeIoZYhCLhVeCwwLFduyvxALx71v/3uZie7tySAgrB/D+hUikeTAWQFpTrpBHySU+Qrx/0J584+IJWtDdndzSjw/yu57Bfqk+MtOs8pGiU+rNj1B8tP0wDo8YxHEVEfoe0SO7RTGLqBJg+WGX3gJ2j1XaJTZItR8aEqbUpuD3Vc/nUJhOF9PTnPaLIyDwxtN/JwW4HH9Qa6y5pe7znFew0l/q+wO4GnCtdIjjy/KHpyCzXh6CopT7HKxFlo2pW1Y7lATINY2CAM09yr1H/17+xw3qmce0PV29YfzgtkwRhsXmiA73fQ4zSfSsuteAxn4eCXeQ0hZEEmIKlH4JmWvT2e1ZfFLxrzNoT5cr4I3aQrN8gkpwLZkyt1iGNV49Xm78Mp4/uNOLtMkm8c3+GrzWA9OxZ2uA9JiQdUELaqzKSWF+DzrNf/tQlMBqjzKO3RvQza6cZ7j0hGxJUQAgvm9DC0vh9kFud64I9/2qTKJYvwdPAQ0cZ0IlljD4JbuoPjLzCkrfVyAgDePLGNdMaJUxK0Sh/tAc22NCgzCIydrw94i5NLqEDAPQQPbiqYf0d1xw8kJO3dBDiiQWzcPqtvkBERdSROzXnp7p38pOkcYVduah4MkB3a/TQ4BYeZS7D88I8uZxtNpBqUfYk+QXuKRuNV0uXbBBz9C392fl5kk3pX0TQb5zyXD7DL7nwymisH0u+bQF6JbMAmxZxoCrJX0kuCEEF5SABdLitHG1a8iz8YyFn7mzwthIsuLsOutMVBRsBZp3/OWxxRkiYprttkBdeIT0mRkazGh5HfH5K+7U1WHu+XpCNGE8ZY5+Uij9eMJfqjLhfxGDByh3lTxqjf25B1YPz0SUcnLCSrBiDTz5IsHAOoIHpRMKbnyr2zX2BoNfslos0NW9oJ8q24/5sIR4dfbCf4NaWmpnr/odX8lI1deVYXCqRKhOGiRtexOhM9tYLc01Q39pnf1Zro7Gk1SDKZMXNCTXta+XNJFcLkNfDI1B1DUXQXEbtbYnTefN80uu4YzxQtXAcd4UUfZxhD2Nq8TDXVnd+0f061Cd9x04DMXeWM2vadxNZFJBStqLUvCBoI/2EiXtm0mzr4f3XFmjWSjU+mAwy4bCkyw/FEY0JRbF+uG7sZ3zFvpwlVSivjgd09VOVVKykwFZQuJrNw1NaB+t0Sq85cZBZ6tfb/JxNaWDyjBJJdFPIC2ExQVMrl1bveOMwT2LvE8Ehc6wY8FoKgrqv2AFfp/XevOmrYr/sf595+McPtK3GatTAaBCl+olxpxQdadKMt3OsRJ4LxiMZrKkWloelFhvgU6ft3I9ef9Y/ki0TLxsdxt2x9RwnVcnWFoTWUae/cGgOK2j/1vziaOrZ5lXdZK4JWCsNJm/uQ24xzb8qMfTjrzwz9lqnFS2uH/k7eEKQBHCDBFKO27FUk5Qk/pCueKMxgYyp+ZMpDrikoym7MiEvytvvABGMS11JQhZtpSxJFhBwjksJCWB01oDn1SGaBh6LACNf3vgiKPZlvBR4pwh6+EFZAM/FLECFywcxSWY7dfqp1pHTK5THavpJ4u3eSIB9xruvifBpgoRk+ljFJ3PDol7mGoS/sjWBwMDFyvzFdPzrwD3NQYYzbVVpoK+eHauxP14ueKsyCpoa2ULQpZc9Ln8coLqKUEf1EPlJ962HvpN6URwvTVdmrnIbr+3qZ+PUjudHh+dy3QRbfzJ4fpHmmIx35H87rCsVMUrojhfKBwAVka+HSDMEjqeAfteHtd3eiS4eeZBJYOyUFmrIlaE21XYK8sGDTGNI/9uWHuXD2W5akRZKHc+ZWo3QzlAXZdwZGkiq31yPrzPatoCd+LH5RXX0KuwYOKAABNOnqayxdNqeg/KnXxtM2CmoLEddGacxlUL46eZGnl7at0RTNR3VNpreWIyKh7LMx6eai+XsP32pqzW7RJLQygS5xbpXq20CI+zNxcTfn6iyqtgHrUJJ3YBpmnynnoXfIKizTRXWgxkGcxUOT4T8asb661skD+dbniV4jjPMC3txdtBpQoSgXzgXFtMvulxoq1G5P5LDx58cyKZfNlN8vsfpcJUUra7xQSz4AAAAAAhUkqlCFeGdwaohKQwxojnLIsdEIGhKb6dJOoL9KwMtkxk+uACq+Tl9Uu5yYpob0Z+sy5M/D1lr9sf/sPYdftTVq8ObUmcKFcadZQweFtIUctNIoG71pq5YN/Ms+JMi6aFWznHF7dXSVJ8NbZpYhv5tM1pPYzI+zpROs1VdaP7XaY5ytK/m5QWD3TgDZhZURjueSFoM5+ABEP7cJ4c9VJWnDlnGp/Qz8zQySPvUEfxyGxLQgSGxZ71BAIUrjUlwUgb+/I5bTQuooG0zjmRU6H5AgwplUP8EuHjeo6cIiLY465h6oxsu/dwvCbic2QfMS1xXqiRH0CGA01SupXszVh/MiR3sFLPcP+IzhonmOwrceEthYHv9XPx+57tmXM05rZEVI9UaAuKGe5s8timy0WuP5JBR7fAolAo2VB3q9ePyCK8wujhZCTQv70k6HhEKTQiZ8t1KnIYy/RP5SkyFdUxAyA7WOLXNZDoXHE1XqXUEHExzxelvrDkONVVPXpgr9xbpJ3522qDgzDvDVSBsJcoTSoWhWgFjXFnv+cv0H4OCCc5wEYqD/NH82wtnbec4nQWJXSr7+AlD2OOSMb6XY7a9kzo4iYkDnDQmGE6KwWPELgpbudqnVrVEZNja49s4clysS3czJJdd1ELZzee8DZYma/kXx+M3LNQ+g8EpTcGtHec3MDuKD0elnj/eM4H+hYErAb7jNqHeZfJcMnNX87vvW3xds9pml8TeC3TYTmkg7Uv2Wpx3RK0LKyBJYl9QLODaliqD8y4uSMgHpWfMWqvY7R1bX13KEeVzpJfmC3OzNxA9sigXezFatBBV2Wrfd9xADVMfnJU2y8Mq+bZPqP30eYQyU/NJFiDaj6UwmcTVJOOd6cudfT02Qa4qsVTHcVWJnpEODMIZR+cOodd3GBgTp/JoOFnR4CNGRWUB91K2ukMU5l2/AXjNyGULQBIk2AljOY++gCVr0if0VveWPMHs5YVxZae2Rrbi630p8CIJvGcjsBUxXIAmhu0BmwzR9JEGFgkmlUFf1iojPHoNMbvTRqbNo0bhVb6hX/7j5Io3Adtce9wc/1ERGoZlmMpPb+Fvk7f+kh0NkPDxTVt+1SOMfK3xP6rywN2f/dCXCcudV65n6962iuphMY5O7151r7EUGdM85qK7nyZLo/3iWjhf8h4EinP23RD1blRFaNaAkAmp7XGisPhLhZoJQC920Wq0P/FGgbA5tN9EkqwJwvBzX4+gi5PotUCg4vAQ2MhXLw/bUMqdUURr3iXTx+6EkBeHLEXsHuTKjkwUxCtWd0BoJkU430xSgFtrZazOnSDsnpIvt1Fmt0vD3ePoQYFlBUzEZJjM892VMMSaGVZZmrAQz51dL5Fs/DyU4U4JMnP7eUQGtSbTWZvCjkzURc15nCKHJa8z7ru+zcpyzvYaJ1yaY9lf7bCOd+SEG8BgR0iQbl4TW2+flnMhTOfB45xm3bgPRZP973b2jcCBWh+zbHCS81v7pbC1MY8p6uoKx62A3gQXKGOV9Fpt9LnbolE8OeTHV82x8ACduv+D1Pf/AbDoCYCb00GltZecGnf96/a7oDqHRcwckp69qlYhz9ySXGSRwpTXR8H27gj1z0geWqDaR8HXP79F5IQ3pbiJwTyh2aUxq6fJeBnPk+B86dZ85ktwa3Ufpt0JfrRiysn8rd9SeMNZYtqLr3ZoIDE2WgJ6q1Rt26CVaSiUTkNrjtxunBgDKnyY3xmv8Roo29Pi4M3VU7x604hvf4Brd17+cxozZz4sbEDux4pTT4svZkZpVUs8UdMo/kNJKYuWDfNvRm7KITBVMbwDC7zt9Rs+3qrS9pyyjgWvAmFOtGbHY1B9T2NSRYPX57b6mHU2cRQEcwCeBrO1L0K0m5eq6+bvue1fbvlzzjBQ3dpo6JHvZPphWGGTJs33+qPDwlkirCBl0pZeoKDZKImM/YTpb5Dra3UnsnCLtMnOmaqb7pAuA6vzfpYQ+3OxiJsQNBdBOB9UM7bN9CneYNH1kG7psegmUFjzy21Hl+G2z33vOOY85BuEF8FH+L+C/og+R9rVwKkMODunbPgssisAuoMjJU3L3b5NomZjmYFlrphELqZD8BP71O1XtuZddeYNXpyctYHCJ+Op+9aHHVNLH6tozO+ApW+K9J4duaSkYEwwzage5gg424d8RZ+UM7As5ns5NAeyFGTnWO2lP4SSJzl2II3syiPPsT+CcEhjqqIc/Mv0yCyJ+KKnNA5RNwKLeC0CROyXJ/2aTr3Xm9IEUwR0XK5En0fm7nsxKQkR5pnhUYpMB7d71881uw95fSEWFiJGGnMlT1NJK4lGinB6TQYzXtPp05G0/FngnOJKS9mVoxpd/OhXpTwUOwHw0PQzAWReoG0aMTHjOaFGHskRLy/frmzfxCYxohT6Bz0Nz8QfMpAsA7noxcLj6s3l79x9jIiR/eZuPwHG0j1jM3NIRcdv65ezgKJx3U9U6YvBCD/fhpHEzmAVkA+YAxryeyvQ63cJt+8wXuog5jVjLRsNV4al3mIUGZx+2dVPoQCOgkpIlzJah4Bm96oBGIll2jqW/JahyaAYtuB2bIkXHm/Z55t4XSgW47Xfa7o4ph94GRcPSx92uKc4XnxZ4SEAtKx6YlHTQpsD75KCLGWJpd95RbcBfRHhLYBOLbRVRGHwaH/EJ1s7km0gGpzvKiqpzJiO2VVoJSalxV6v7ofYx6AkHykBTdDAffXkpL6MhiXXAoxQjKIsELLqrL1o2LzXlLa4sXEqyGkjqL0C/9DxM/+pOHa8jWY0jQyYlUioy2Ee7r8lfX5LVMtprRyL4Nv0NBPQCyhnk7TQguaCPGmKw6PD+qXferVD6hbV+JlkKTDqGkSEPwY4ZENmHBXg2jM4vhAwvUAVSookuLttItsP7H9A3x6X+s34d9QL5xIhE/fmZUtY1mcvkTq3Y/HV50GcozJMpShiq6fwTlVd/wAyY1DaP15QVEZvN0AfpHZk5luDNPegLkC1rjQe6OASW0NROBdcG3snKu0ayPMwX+77ZyCfgjQyE2oZdKv52fZOGdQwv0sMOxaREv7zG/308y8eTtaHBB/w5zgmOkbmVFAkgFxWOyPT7FwEGNLo+xRCz7FT74UD63ZAUF/LcLLbAB1LJ+TuaVmxQmXG3QCYCSwwcOFILtPz18w1FvWaLCik6aQD5gm/0ousFCE7XKRgjMACL2jOAQ1sfZSxvYrS67AlqJYJcfgbQpPe0AH00fK+ELuo1DbqbSTfT5fP9NR3RJqjInutnHdtptohyUUTrlX8Fp1NfCS2VUlCh6qB6tFK8V7Y4eYjzgOjx1QG76weGrCl4PiY6IIuJPY0oTa44BReiD3eoGIHjLwOz44rOJjA9P+7HdPKDaYQ0fk6SNKnW4RnqJ65OBk5VPFUBZ5Cd5jaU4F1pI7Zfb8bAIuZNdn/1UyBvKXr9j+bINA+45mKaj58AZMCFCJnEG4OpZgAhk9Futmu3qdtJiK0TmrD0dPXK+ZYs37cf2PROfEExrEVDXm1zGXmpfHl6aW4ToMwtNFaUMHLTyjU582QooxM0PIhtS0hkck1Xae0S/sihPLiciwZAfvEjfw6vtHAEAiTmsXm2XolrpyIRqq+Nf/vhNR6sAl6yl4cFFSBJqfh4XfiXr/oOrLWYTQCafQWOvDhVc+FkzvOyK5MuB728wPb0iXdWtHODB/RDICGlsQRmHHxT/Lwe8Dc2HdJZBHtMrS/iRKEtlxRX2wofdCdaqUmlHMpwzLt8xVAJGlWDwdYHKAaiprswgVLhbbQMEQ+XT46Ifkv5I4IXh7FZMLwmSVwLc8ZNVifCFe4vmSpGWxyjM9nMfNFOWrRrvbHq+BOkOK1J/KZdpik78ogq/NM2PA/aTdwzWxtSwOwR80eiKsbacES2ECZnOTCBSCZOXsAwafKv8DZa4R1R+VCD5EMHoBZTHV3ckTsBVsH2Mbu4UAl0/OeMnjEORiWb3J5vICgWG6vIglyOUaLOBhGpnXu7QcxDLB+NxUKgFFf1x6NPYMWGf6+Obpdqexykof5KeSNf1AsvPCBbAkan6GRaIbH9vD7etydscAK3Q03UK0KCJLkbP8x1Kmv6HgGfqYiM4zs4DgMs1S7bxjUIiqV95cDxLkBmrJ6cDlxXIS1WAkra+05FKWTw0XX6pQ15tSUWbhIfTPKVH+j3O8MNc1vjcmxZm05zhI91Bwp+g08/67csyjZLkVTqXRwDrUEJaseKIXFGdpqMKUnJl+sWXlDDCu6QQdH+UWZZMdByoN1V0rnqT+jrCC3d0BkkfvnLziAjJ2E6fk7Lj1Tgne1p5U5cmFhVgTkMvGL5nTRnenSiPuiMWxQ8ZrGm+bvVkibUxhBH3tMXLjkysVanMTHnnITo/VF12ry7aiU6vZrkCT11Z3V1O2TiI/ADHT374/XZ5bJUyvwXcEkJ1XOgqDrBLtIhe3khtU9d5/VCXqmjDAgjpnwvBP0VgDaSy3LGA4Q2DFGeLcarW4nSFuukKr7XoiiWHpjKvtzAqghlAjmsf949JRSugan8TDgKAh1Cr6xEOzYMmViT3AGIjhdUVQxL2G+x4hXXHiAkfyEOfPU4uwNIYMtdQ/B0Alvf1S2GIkVRyO9OxpezSQ2OKO9tQZFGsZGKvYyX1fyaNaB5D6r5Dkmugpe78xDS8koBkYouGq/m30avHvobROeKwzqWKl5NJ8wa2D7TuFREVRXvOBd/wptp0tPLYRajoTkxSMGsbYQRxT7bsNMxIOQznP/d2cbb6DpqsdlJsu19aOyHNrKTiDDBe58DJBhDws5X13sd9lZxgDu25KacR2ZIBCY/TPR1zj2CHyfgYZqVEijGAaQ0fA9Dsn5w0HnNuv1p2qKwZadT93mK13klpg1yhU6JIH026hFzXwwYwOASdqzizbjm/7VnNJMj0/weFlLa0ZrDksc24bPVIP+0FuOyqINxgVkla52CBZNJq54gWRe/k4aE0H16l67L10dM9Ca4//T1uZ2v/Sc2/h6Z7VM8gj1fCYeoGUuvpoXKX3QW+mMJCmwsIC7FAIokkbHHUBwf9qwutvCE7FfQISesLss1bUYKatnkWnMSrtmAdItwn+xvIddlxEGnIv9qxCh05mUFVP1OeG+ughID2o4sYgnGeEFMGWhmLHZVGhqz17Fp6SxePQJyHO/w/XY+W8ktht3TsFWLYGFeDmVSjSIExk/cT4mrEyfW8+2AziKi5S7ZBdmhgvIum+gM/hsdY4HDdUeTRqkFK6LndvT3b7KL4Jd+gnEBlbBmV/OWQSAXtNrTOPxDPIuEdozvAeAaE/6GqnA6JF2kV66K1cyDpFivCbDL3plA5QifowsHxx91RYZQQ7fw/vLIWdsRrDrfIHHljPhJCGET2Lsv7puhLebA8YuZ05PJ0+ZTHFABIezIhbVMjqCuC2u+uarD6hXbQ3V5XmAoxDVLACDTUwH8Lw4wlCOHibWXF15dzHvVXu+QEP+mpFSnFi1AK83ZlcLXhhVIV5IFiDJ2GmVHf2hzsxrhtXEaAMC259gWY/z9f4uPeeXR6q5FPBnlRA6HabiGUE5kqc1Dv6TXOyvrF2yUCs399+ktJWnF9FmrndOzNWbvsqcOi2ApNPpmf47B5b62ovKeY3uOKRSDh9wQggbAkp4cEq0LfToDU/kKMzVVgVTpSADaHrR70dxTMg+1gKvumSGUn1FmeESnpym+zzgsn0ll1b4gPIGC8NtvHgXa3R7xfAN/8+kNobsIuQKak9eAGe7xsdrlrAa6BSFuCYZfQInGhBhnJWJQC1Ct5oe9BNb+D9XmLFjCNaOt1CUWNlB1orG3H8T4Hs76TLB1OBVvK7AAzmr4EEgos1WpSbSY5FxWihpllqi+nCz3bO+Aiwzg/+zMyiVGbR7tfFe7peuSRd++BlaEK2hQ9UhfYUmtdmscLpNqnvWaXj8yU/sDvoeHysVCdy4en31rYgSOv6YVDsCYVCW0D6R562NnHkjFBPcnXiAuLVfrfqQR4O5fPHCf8v6G2duNU2Ur52wdcs2V7AJzxaG7VfpxcI8EKsa3SpZKmOAevQIP9YJE7RLC9M5llGIQca6LYUT0UK8mx9UEtcAYLzDyLYRzgR1bqSaglgAAACWkGw6SmPPzekvxTjgtBglUvTw9bje06Hvtw+pIAAAAAAACa/RB8WMI2KKWOFWIV/5k6+epaTP8WgcM0LSDzRXn6orgOKX6415PmJKoRFMm+5hLeT4/fSsWii6wunmo8WxEQFhGrzR5a0RoFwHdLzcVZUGfPbrOjTSC83T5GW5cDDKc5WmN50zbAtciVp9xXhm0Y9pvD7dyAymPwtEzwf0GUGKXKZyMgwSUAigjIr8kmnvEYVFucYlIj+p/CDu+p4+PHPtmFaG11yvSXVGGH6PCUZKHeQK0gb0V03G/sc08wW/ifn3H2urobKr10vAr2h5XVkTotdCXZW59qpFSK+npNLIh7EhlEuAXfEE5uNl2iwhj+xbKG97aJX1dEFt0zYcAQFjzW43L4CCubwuqUj2J8FLmMUsj9OYRIkLB0WRTpxg9Mt3HUYtfYzJjF8kzoT7WTFgbpWUb7H7kaonk8fZP2kbkJnSWa2Ptys3UqJFEEt1BA5IC/1eMCwO8LBHn4wsms/OdlOd13eKwHXKBACZjE+9AJvUEpaeWGl5aNAEmxCwZaCvfw79647O4LKgsNWVbTJyl9ZVlTA4N5PTIuqh5JlZXyNCN1h/P1+Bo9SnSm3oJ46zMTs3ZAPQwIMc2Owof/G98fhcghypSN/uZvwUu9pXLOEQnauJgdqNsYnkMLaP/HVyvYZl7wFiCt7tVdjy+1GEYzI+28eLUFX9EV24dnXyxIYuKbB3HBPCgDQLsAKNJZRaYorhWJJMRB7/Uh988KgvO6gt7pHiArNGoI07YPYR0+GCnM72YGfzooEmDtI5LfihEi8MCFyJnH1cH+RvITVCn/0xoa/i3LLt1pZLPBKgE8qujWqgUvqrp3w2bhEaWv2iDGJcqTx2NeDM0SxanhZkVxK2ir5AGrXr49tV/XalI9iuRExMEOMBQq5ezjoUG9gHeIOzyj3wJthwpNNAeVeIxBPcNQlKmJDiBs4JRbDBWIGJYyDGZVKTZblYhPpinAYItqsvPxTD4qMS9yjrSjldu7DHwJp/o+vKwL+nmcK1/RMIfjfl//xJuXh+xynqZ0Ems9BIwjB2HwBsp0SM+P00kXfdj+HYO99rdM8Kw//bkZ/PbMz2Yat0HKj14IsRaC04iXnl1Mnm3AoI0raGZHj3amJFHmNBbLP2t8EPgNODgmKmHdSC+LP/ARylO+vcssySJv7NskrDpOKryGQh1yfcj1nAhQRJOVd2Fgnyg5dBtMM4D651+hk4z3weKhFKjNcQ9opc719ltgwCukXvKptQ9P5otkGNTbo3zwOya98i/b+R4M2Xo4FAWqH8dAHEPs6YlGmhD2XxjGmLhqdSrjT6YqGV+NcwtlrCShZpgM7EtLAeN+hAaELzfAIzzpNz1CWRYB6T2eQ6HghKW+MMMWP0/D2Qc4Wnl6blUeQk2e5Qaoya29siZ35mrYPT6J+zl6zKHwUeWokJi9wvmhVsU4K56f7CTLxPRtZ1E2+VoTvEtYCjJPSM/Xmo2LGYEx+9UAeROwOSE6CYHmzxynq7q2cZdFMgk2MnX+h2nqJjl7H4FfjwPvV7PM2Yz8hFpbEsPal1qmn26mpL99OEtEAObMHlNHyW93tyDEX3JMJ6GJutt3Lm8r0T39LV3eJY8v/PIEow3EFJ/Ak/FCDUiCe3OmtKaxdzLi/PoyqnyxZpo2v8q1Cz2u39WVEKoLzXeLFoHrTUEZMc6co+NSFOVCNjbc7Vi5OgGZ4IcueFlENBzvzGOpbKUb1j/jAmaDi8AdUcrVKKukS6joGEDNvfHusPNXp/X+5lvgsjy3oVL7fMpT6kWxYRiKr5Get+6KmteF3ZaKVWso5fmoT0Glh9h30WwAY+3iq7cIZEj0i7OXlW4NVp3b9WEIwxjeKqg9MjmCd4hcITdnnF88W+LVubD0YWavhjpktSXvi+zfYduL8W6dhuF7omZVxsWbcT05boqzUotV/4jrdqXvm5yWlRdF/Ald+AZ7u+jLKXgCN5D3R1e8WsEgqKyvg6C9Ijet0A2DwfLRVI9afWcBAiB9BKkBEUptqN3TrkGAPonCxzslFdaHD7Rwj8zSbYJjDQNsvpvN+ex7aoxXcGu6oB1ZKIL1AyPPY3ucaJVegIuB/08+xpGODtg1PnhNIFHTkFRimiUswkp1ErCPBY+v2ShKml12WgTt0nEvCh6Vda0XqGSxDFquTUuuZXDeIX2+uTVvnQbyozO8SeUrUstUpdaB/ksYwD9dKppBpJrwFp8Ac9xO81qEarWAxbXTRR6sMcD6yseYBvAfMjo3/acEVyMLT7FYaH++snbdP15FvriPLFKGWbjMu9BL8aLbrGRUFACZuJWSfudUMQMP+vJ/3Ienu+2h7xgzQhFmKWfU+M35bT2sc4o8xdKF49aitMVFCcb4h0Xrfp2gzD9JfdYVZT7ilZtYNJjhxbpjzXkZ38smZDCeg8IBmWZLh3UAmQZf2Qv2m6TKc4Sjb1xmQK5N52lz/wAvfUPNmurVUVkuFoCJ8qtmAQRtilICsBaH92JriDnBDSSOYSQgI0GMI0MK/i7sdKMSvplslFxDX2UkPTTVgkbEWfFuRnoB+h6HT4IoyScTr4jZfr8jJ1ufeqJuO1ef+Hks+Gym4I2sO3q7QlxZPFb/TKVfS+zuMgIt5VyNR95UjzFEM+y7rFy0HhjxhMVYyXBO1Dl2C8SieQuFTe7n+X4pncTI+gBBhn9iv8KC+QoFZi5bvBwUq5Dd1cQwNh9VsPp/TP1ho2blCtwsjdCY3UzIw/ph4d60qKUIKV7cFM503UMEiguygOePUq1MMt+2hqCjd5ML6aZQ59xBHV3vMCuXeo1gQ6nxmUskiGPUODMrC7kbDIArRmeCZvO5nbIeqSMhqp6VTIZy2gPgkBQqraBzHa8lcKOq+vbSjR61FJjnf6Y35EggWmtesAukQNyc0EVTeCB3K5WVkKxA57bMGSAaITl3c4gVSlx3pJdY/fAg18E4q3cBF6Y+F/q9u68ffXZ9cIio62OCwmxsOd5i5TFCuHKH2E1z5+UjTy9jt0pH3O9nphkEpfHvUVkLIVujeCNpzf2H24j58St1Jci7Pae7GqB0u8nSuF7zzVu8yTOO3zRJN7b6zxlc97gtckFrf3AoN5vEuSR0OJHyUA7FTr6Q/M61yxksyd//u9p2hiijQytAFW19qx2GQi4T7F7VQI0bPxkqHLGcdxhmNyMc3DoLkTYLuHBPjwJgdoommNQNz3WI4NfslxCowwU+hBH4NrR7wVSL/lppwV+8walSvHzEYhFT1D051qSM5uXMGHqGnbAKMzF+jfL6YB7M9wxg0CPuux0ZE1TFjG7xKRfSJ5n5ubBCXjtT/cjdlGKeOXi/ZR5juXb8mOx/rgd423Yaa7kXx8n+dIBwYm79PPqoPxTCm8YyVLHXNNihxdUrbIwAkLfZqRy9tbXYbYgPRLgcISNd4mbTe6dNdKhRTJoonEGV1eOPeHHIxvhNIJCn8HeTP08lfg8A80BWHgxDwNriePF5ERvpHqFRi3E4fihHo/FT1o4V+1rZi6wSCxse0+eimiDHJXQQkYdbxui7U41GrewAKn9I6onh62NuLtGXa6ZKSc7ivGiH5srTImY1ZEnhL+cqOPckJOHzjbBHJjNzT5tYjaQ1Xy1SIGLdod67I0vc1383xMtNE9/VJbykhw6nD0BD1iYVJ07ZpbTvlWdbgjXphz2ykrM3bxDEZb8FTpDJUMHgGhkIEc/WJUJSCHadaXX/7/7UnSJ9y/DikwpwqSLinhvOZU4ADfcQMXGw/E1JeniP8iE+oBU12avBCg6wqD/i0SK43yQExEEOAybgrsL0qA5iwUjYmFnTwmTZEhqW6JAAAAAAAAACHc2IVyDkqHdwEqYDWaoAAAAA==";

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
      vec3 artwork=mark.rgb*(.48+.65*light);
      gl_FragColor=vec4(mix(bronze,artwork,mark.a*.94)+grain*.024,1.);
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
    ctx.fillStyle = "#55483b";
    ctx.fillRect(0, 0, 2048, 256);
    let disposed = false;
    const atlas = new Image();
    atlas.onload = () => {
      if (disposed) return;
      ctx.drawImage(atlas, 0, 0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
      requestDraw();
    };
    atlas.src = ribbonAtlas;
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
    let frame = 0, last = 0, time = 0, visible = true, paused = motion.matches, progress = 0, targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
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
      if (!paused) {
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
      if (!paused) frame = requestAnimationFrame(draw);
    }
    function requestDraw() {
      if (!frame && visible && !document.hidden && !disposed)
        frame = requestAnimationFrame(draw);
    }
    function move(e) {
      if (paused || e.pointerType === "touch") return;
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
    const pauseButton = scene.querySelector("#hero-pause");
    function updatePauseButton() {
      if (!pauseButton) return;
      pauseButton.setAttribute("aria-pressed", String(paused));
      pauseButton.setAttribute("aria-label", paused ? "继续播放环面动画" : "暂停环面动画");
      pauseButton.innerHTML = paused ? '<span aria-hidden="true">▶</span> 继续播放' : '<span aria-hidden="true">Ⅱ</span> 暂停画面';
    }
    function togglePause() {
      paused = !paused;
      last = 0;
      updatePauseButton();
      requestDraw();
    }
    function motionChange() {
      paused = motion.matches;
      updatePauseButton();
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
    pauseButton?.addEventListener("click", togglePause);
    updatePauseButton();
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
        pauseButton?.removeEventListener("click", togglePause);
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
