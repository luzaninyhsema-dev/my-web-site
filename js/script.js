document.addEventListener('DOMContentLoaded', () => {
  // 1. Подсветка активной ссылки в навигации
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Плавная прокрутка к якорям
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Анимация появления элементов при скролле (fade-in, slide-up, pulse)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target); // анимируем только один раз
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-up, .pulse').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    if (el.classList.contains('slide-up')) {
      el.style.transform = 'translateY(40px)';
    } else if (el.classList.contains('pulse')) {
      el.style.transform = 'scale(0.95)';
    } else {
      el.style.transform = 'scale(0.98)';
    }
    observer.observe(el);
  });

  // 4. Кнопка CTA на главной — простой эффект
  const ctaButton = document.getElementById('cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('Спасибо за интерес! Скоро мы с вами свяжемся.');
    });
  }

  // 5. Обработка формы контактов (имитация отправки)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const statusMessage = document.getElementById('form-status');

      // Простая валидация
      if (!nameInput.value.trim()) {
        shakeForm();
        statusMessage.textContent = 'Пожалуйста, укажите ваше имя.';
        statusMessage.style.color = 'red';
        return;
      }
      if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        shakeForm();
        statusMessage.textContent = 'Пожалуйста, введите корректный email.';
        statusMessage.style.color = 'red';
        return;
      }
      if (!messageInput.value.trim()) {
        shakeForm();
        statusMessage.textContent = 'Пожалуйста, напишите сообщение.';
        statusMessage.style.color = 'red';
        return;
      }

      // Имитация отправки
      statusMessage.textContent = 'Спасибо! Ваше сообщение отправлено (демо).';
      statusMessage.style.color = 'green';
      contactForm.reset();
    });
  }

  // Вспомогательная функция: эффект «тряски» при ошибке
  function shakeForm() {
    const formWrapper = document.querySelector('.shake-on-error');
    if (formWrapper) {
      formWrapper.style.animation = 'shake 0.5s';
      setTimeout(() => {
        formWrapper.style.animation = '';
      }, 500);
    }
  }
});
