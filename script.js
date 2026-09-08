// Script interactif pour le site Code Contenu

// 1. Détection du scroll et effet sur le header
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Animation des éléments au défilement
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.topic-card', '.topic-row', '.article').forEach(el => {
    observer.observe(el);
  });

  // 3. Navigation active
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Ripple effect sur les boutons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 5. Smooth scroll pour les liens internes
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 6. Compteur de visite (localStorage)
  updateVisitCounter();

  // 7. Tooltip au hover sur les cartes
  addCardTooltips();

  // 8. Animation du menu mobile (optionnel)
  addMobileMenu();
});

// Mise à jour du compteur de visite
function updateVisitCounter() {
  let visits = localStorage.getItem('codecontenu_visits') || 0;
  visits = parseInt(visits) + 1;
  localStorage.setItem('codecontenu_visits', visits);
  
  console.log(`📊 Nombre de visites: ${visits}`);
}

// Ajouter des tooltips aux cartes
function addCardTooltips() {
  document.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const title = this.querySelector('h3').textContent;
      this.setAttribute('title', `Cliquez pour voir plus sur: ${title}`);
    });
  });
}

// Menu mobile responsive
function addMobileMenu() {
  const nav = document.querySelector('nav');
  
  if (window.innerWidth <= 768) {
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('menu-toggle');
    toggleBtn.innerHTML = '☰';
    toggleBtn.style.cssText = `
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--primary);
    `;

    if (window.innerWidth <= 768) {
      toggleBtn.style.display = 'block';
    }

    // Événement resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        toggleBtn.style.display = 'block';
      } else {
        toggleBtn.style.display = 'none';
        nav.style.display = 'flex';
      }
    });
  }
}

// Fonction d'analytics simple
function trackEvent(eventName, eventData = {}) {
  console.log(`📈 Événement: ${eventName}`, eventData);
  // Vous pouvez envoyer cela à un service d'analytics
}

// Track les clics sur les liens externes
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', function() {
    trackEvent('external_link_click', { url: this.href });
  });
});

// Track les clics sur les articles
document.querySelectorAll('.topic-card, .topic-row').forEach(el => {
  el.addEventListener('click', function() {
    const title = this.querySelector('h3')?.textContent || 'unknown';
    trackEvent('article_click', { title });
  });
});

// Ajouter une classe active au scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('class');
    }
  });
});
