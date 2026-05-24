import Fuse from 'fuse.js';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function withBase(path: string) {
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

/* --------------------------------------------
 * Menu
 * ------------------------------------------ */
function initMenu() {
  const menuOpenIcon = document.querySelector(".nav__icon-menu");
  const menuCloseIcon = document.querySelector(".nav__icon-close");
  const menuList = document.querySelector(".menu-overlay");

  menuOpenIcon?.addEventListener("click", () => {
    menuList?.classList.add("is-open");
  });

  menuCloseIcon?.addEventListener("click", () => {
    menuList?.classList.remove("is-open");
  });
}

/* --------------------------------------------
 * Search
 * ------------------------------------------ */
function initSearch() {
  let fuse: any = null;
  let searchTimeout: any = null;

  const overlay = document.querySelector('#search-overlay') as HTMLElement;
  const input = document.querySelector('#search-input') as HTMLInputElement;
  const resultsContainer = document.querySelector('#search-results') as HTMLElement;
  const closeBtn = document.querySelector('#search-close-btn');
  const loader = document.querySelector('#search-loader') as HTMLElement;
  const openButtons = document.querySelectorAll('.icon__search, .search-button');

  if (!overlay || !input || !resultsContainer) return;

  async function loadIndex() {
    if (fuse) return fuse;
    try {
      if (loader) loader.style.display = 'block';
      const response = await fetch(withBase('/search.json'));
      const searchData = await response.json();
      fuse = new Fuse(searchData, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'description', weight: 0.3 },
          { name: 'content', weight: 0.1 },
        ],
        threshold: 0.15,
        ignoreLocation: true,
      });
      return fuse;
    } catch (e) {
      console.error('Search error:', e);
      return null;
    } finally {
      if (loader) loader.style.display = 'none';
    }
  }

  const performSearch = (query: string) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const fuseInstance = await loadIndex();

      const results = fuseInstance.search(query);
      renderResults(results);
    }, 300);
  };

  const renderResults = (results: any[]) => {
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="col col-12"><h3 class="no-results">No results found</h3></div>';
      return;
    }

    resultsContainer.innerHTML = results.slice(0, 9).map(({ item }) => {
      const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      }) : '';

      const tagsHtml = item.tags?.length > 0
        ? `<span>in </span><span class="article-tags">${item.tags.map((tag: string) =>
            `<a href="${withBase(`/tags/${encodeURIComponent(tag.toLowerCase())}`)}" class="article__tag">${tag}</a>`
          ).join('')}</span>` : '';

      return `
        <div class="article col col-4 col-d-6 col-t-12 animate is-visible" style="opacity: 1; transform: none;">
          <div class="article__inner">
            ${item.image ? `<a class="article__image" href="${item.url}"><img src="${item.image}" alt="${item.title}"></a>` : ''}
            <div class="article__content">
              <div class="article__meta">
                <span class="article__minutes">${item.readingTime} min read <time class="article__date" datetime="${item.pubDate}">${date}</time></span>
              </div>
              <h2 class="article__title"><a href="${item.url}">${item.title}</a></h2>
              ${item.description ? `<p class="article__excerpt">${item.description}</p>` : ''}
              <div class="article__bottom">
                ${item.authorImage ? `<div class="article__author"><a href="${withBase('/about/')}"><img class="article__author-image" src="${item.authorImage}" alt="${item.authorName}"></a></div>` : ''}
                <div class="article__bottom-meta">
                  <a href="${withBase('/about/')}" class="article__author-link">${item.authorName}</a>
                  ${tagsHtml}
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  };

  const closeSearch = () => {
    overlay.classList.remove('is-visible');
    document.body.classList.remove('search-opened');
    input.value = '';
    resultsContainer.innerHTML = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('is-visible');
      document.body.classList.add('search-opened');
      setTimeout(() => input.focus(), 300);
    });
  });

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (query.length === 0) {
      resultsContainer.innerHTML = '';
      if (loader) loader.style.display = 'none';
      return;
    }
    performSearch(query);
  });

  closeBtn?.addEventListener('click', closeSearch);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeSearch();
    }
  });
}

/* --------------------------------------------
 * Scroll to top
 * ------------------------------------------ */
const handleScroll = () => {
  const btnScrollToTop = document.querySelector(".top");
  if (!btnScrollToTop) return;

  if (window.scrollY > window.innerHeight) {
    btnScrollToTop.classList.add("is-active");
  } else {
    btnScrollToTop.classList.remove("is-active");
  }
};

function initScrollToTop() {
  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll, { passive: true });

  const btnScrollToTop = document.querySelector(".top");

  if (btnScrollToTop) {
    const newBtn = btnScrollToTop.cloneNode(true);
    btnScrollToTop.parentNode?.replaceChild(newBtn, btnScrollToTop);

    newBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* --------------------------------------------
 * Copy code blocks
 * ------------------------------------------ */
function initCopyCode() {
  const codeBlocks = document.querySelectorAll<HTMLElement>('.post__content pre, .page__content pre');

  codeBlocks.forEach((pre) => {
    if (pre.querySelector('.copy-code-button')) return;

    const button = document.createElement('button');
    const copyText = 'Copy';
    button.type = 'button';
    button.className = 'copy-code-button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = copyText;

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText.trimEnd() || '';
      try {
        await navigator.clipboard.writeText(code);
        button.innerText = 'Copied!';
        setTimeout(() => {
          button.blur();
          button.innerText = copyText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(button);
  });
}

/* --------------------------------------------
 * Load more (pagination / posts)
 * ------------------------------------------ */
function initLoadMore() {
  const button = document.querySelector<HTMLButtonElement>('.load-more-posts');
  const mainList = document.getElementById('posts-list');
  const parentSection = document.querySelector('.load-more-section');

  if (!button || !mainList || button.dataset.init === 'true') return;
  button.dataset.init = 'true';

  button.addEventListener('click', async (e) => {
    e.preventDefault();

    const tag = button.getAttribute('data-tag');
    const nextPage = button.getAttribute('data-next-page');

    if (!nextPage || button.getAttribute('aria-busy') === 'true') return;

    const fetchUrl = (tag && tag !== "")
      ? `/tags/${tag}/${nextPage}/`
      : `/posts/${nextPage}/`;

    button.setAttribute('aria-busy', 'true');
    button.classList.add('button--loading');
    const originalText = button.innerText;
    button.innerText = 'Loading';

    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Fragment not found");

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newItems = doc.querySelectorAll('.article');

      if (newItems.length > 0) {
        newItems.forEach((el) => {
          mainList.appendChild(el);
        });

        if (typeof initCopyCode === 'function') initCopyCode();
        if (typeof setupNewImagesForZoom === 'function') setupNewImagesForZoom();
      }

      const nextInfo = doc.getElementById('next-page-info');

      if (nextInfo) {
        const nextVal = nextInfo.getAttribute('data-next-page') ?? '';
        button.setAttribute('data-next-page', nextVal);
        button.innerText = originalText;
        button.setAttribute('aria-busy', 'false');
      } else {
        if (parentSection) {
          parentSection.remove();
        } else {
          button.remove();
        }
      }
    } catch (err) {
      console.error("Load error:", err);
      button.innerText = 'Error';
      button.setAttribute('aria-busy', 'false');
    } finally {
      button.classList.remove('button--loading');
    }
  });
}

/* --------------------------------------------
 * Zoom Image (Custom Implementation)
 * ------------------------------------------ */
let overlay: HTMLDivElement | null = null;
let zoomHandlers: Array<() => void> = [];

export function cleanupZoom() {
  zoomHandlers.forEach((cleanup) => cleanup());
  zoomHandlers = [];
  if (overlay && overlay.parentNode) overlay.remove();
  overlay = null;
  document.body.classList.remove("is-zoom-locked");
}

function setupNewImagesForZoom() {
  if (!overlay) return;

  const images = document.querySelectorAll<HTMLImageElement>(
    ".post__content img:not(.zoom-target), .page__content img:not(.zoom-target)"
  );

  images.forEach((img) => {
    if (img.closest("a")) return;
    if (overlay) {
      const cleanup = setupZoomableImage(img, overlay);
      zoomHandlers.push(cleanup);
    }
  });
}

function initZoomImage() {
  cleanupZoom();

  overlay = document.createElement("div");
  overlay.className = "zoom-overlay";
  document.body.appendChild(overlay);

  setupNewImagesForZoom();
}

function setupZoomableImage(image: HTMLImageElement, overlayElement: HTMLDivElement) {
  let isZoomedIn = false;
  image.classList.add("zoom-target");

  const zoomOut = () => {
    if (!isZoomedIn) return;
    isZoomedIn = false;
    image.style.transform = "";
    overlayElement.classList.remove("is-active");
  };

  const zoomIn = () => {
    const rect = image.getBoundingClientRect();
    const padding = 30;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const availW = viewportWidth - padding * 2;
    const availH = viewportHeight - padding * 2;
    const maxScale = naturalWidth / image.clientWidth;
    const imgRatio = naturalWidth / naturalHeight;
    const viewRatio = availW / availH;

    let scale;
    if (naturalWidth < availW && naturalHeight < availH) {
      scale = maxScale;
    } else if (imgRatio < viewRatio) {
      scale = (availH / naturalHeight) * maxScale;
    } else {
      scale = (availW / naturalWidth) * maxScale;
    }

    const newW = image.clientWidth * scale;
    const newH = image.clientHeight * scale;
    const x = (viewportWidth - newW) / 2 - rect.left;
    const y = (viewportHeight - newH) / 2 - rect.top;

    image.classList.add("is-zoomed");
    image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    overlayElement.classList.add("is-active");
    isZoomedIn = true;
  };

  const handleImageClick = (e: Event) => {
    e.stopPropagation();
    isZoomedIn ? zoomOut() : zoomIn();
  };

  const handleOverlayClick = () => zoomOut();
  const handleScroll = () => zoomOut();
  const handleTransitionEnd = () => {
    if (!isZoomedIn) image.classList.remove("is-zoomed");
  };

  image.style.transformOrigin = "left top";
  image.addEventListener("click", handleImageClick);
  overlayElement.addEventListener("click", handleOverlayClick);
  window.addEventListener("scroll", handleScroll, { passive: true });
  image.addEventListener("transitionend", handleTransitionEnd);

  return () => {
    image.removeEventListener("click", handleImageClick);
    overlayElement.removeEventListener("click", handleOverlayClick);
    window.removeEventListener("scroll", handleScroll);
    image.removeEventListener("transitionend", handleTransitionEnd);
    image.classList.remove("zoom-target", "is-zoomed");
    image.style.transform = "";
  };
}

/* --------------------------------------------
 * App init
 * ------------------------------------------ */
export function initApp() {
  initMenu();
  initSearch();
  initScrollToTop();
  initCopyCode();
  initLoadMore();
  initZoomImage();
}

initApp();

document.addEventListener('astro:before-preparation', cleanupZoom);
document.addEventListener('astro:page-load', initApp);
