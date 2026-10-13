// ================== Тема (localStorage) ==================
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const update = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' ||
      (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
    btn.textContent = isDark ? '☀️' : '🌙';
  };
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' ||
      (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    update();
  });
  update();
}
setupThemeToggle();

// ================== Мобильное меню ==================
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );
}

// ================== Активная ссылка ==================
(function highlightActive() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// ================== Кнопка "Наверх" ==================
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 500);
  });
  toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

// ================== Reveal при скролле ==================
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ================== Год в футере ==================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ================== Анимированные счётчики (index) ==================
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = target * (1 - Math.pow(1 - p, 3));
        el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io2.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io2.observe(c));
}
animateCounters();

// ================== Форма обратной связи (localStorage) ==================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Восстановление черновика
  const fields = ['name', 'email', 'subject', 'message'];
  fields.forEach(f => {
    const saved = localStorage.getItem('draft_' + f);
    if (saved && contactForm[f]) contactForm[f].value = saved;
  });

  // Автосохранение
  contactForm.addEventListener('input', (e) => {
    if (fields.includes(e.target.name)) {
      localStorage.setItem('draft_' + e.target.name, e.target.value);
    }
  });

  // Отправка
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    if (success) success.classList.add('show');
    // Очистка черновика
    fields.forEach(f => localStorage.removeItem('draft_' + f));
    contactForm.reset();
    setTimeout(() => success && success.classList.remove('show'), 5000);
  });
}

// ================== Блог: фильтр и лайки ==================
const filterBtns = document.querySelectorAll('.filter-btn');
const posts = document.querySelectorAll('.blog-post');
if (filterBtns.length && posts.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      posts.forEach(p => {
        const show = cat === 'all' || p.dataset.category === cat;
        p.style.display = show ? '' : 'none';
      });
    });
  });
}

// Лайки постов с сохранением в localStorage
document.querySelectorAll('.like-btn').forEach(btn => {
  const id = btn.dataset.postId;
  const countEl = btn.querySelector('.count');
  const baseCount = parseInt(countEl?.textContent || '0', 10);
  const liked = localStorage.getItem('like_' + id) === '1';
  if (liked) {
    btn.classList.add('liked');
    if (countEl) countEl.textContent = baseCount + 1;
  }
  btn.addEventListener('click', () => {
    const isLiked = btn.classList.toggle('liked');
    localStorage.setItem('like_' + id, isLiked ? '1' : '0');
    if (countEl) countEl.textContent = baseCount + (isLiked ? 1 : 0);
  });
});