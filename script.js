// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
// Always show nav links — no hiding on hero
navbar.classList.remove('links-hidden');

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth page transitions on navbar links
const navAnchors = document.querySelectorAll('#navbar a[href]');
navAnchors.forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    document.body.classList.add('fade-out');
    window.setTimeout(() => {
      window.location.href = href;
    }, 250);
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.about-image, .about-text, .sig-card, .service-card, ' +
  '.music-cover, .music-info, .into-card, .press-card, ' +
  '.contact-info, .contact-form, .stats-row'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Contact form — Formspree (only on contact page)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const inquirySelect = contactForm.querySelector('select[name="inquiry"]');
  const messageField = contactForm.querySelector('textarea[name="message"]');
  const params = new URLSearchParams(window.location.search);
  const inquiryParam = params.get('inquiry');

  const updateMessagePlaceholder = (value) => {
    if (!messageField) return;
    if (value === 'waitlist') {
      messageField.placeholder = 'What is the biggest problem you are hoping this product/service will solve for you?';
    } else if (value === 'consultation') {
      messageField.placeholder = 'What would you like to discuss in our consultation?';
    } else {
      messageField.placeholder = 'Tell me about your project...';
    }
  };

  if (inquirySelect && inquiryParam) {
    const normalizedValue = inquiryParam.trim().toLowerCase();
    if ([...inquirySelect.options].some(option => option.value === normalizedValue)) {
      inquirySelect.value = normalizedValue;
      updateMessagePlaceholder(normalizedValue);
    }
  }

  if (inquirySelect) {
    inquirySelect.addEventListener('change', () => {
      updateMessagePlaceholder(inquirySelect.value);
    });
  }

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpqkrwvw';

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const note = document.getElementById('formNote');
    const btn = this.querySelector('button[type="submit"]');

    btn.textContent = 'Sending…';
    btn.disabled = true;
    note.style.color = '';
    note.textContent = '';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(this)
      });

      if (res.ok) {
        note.textContent = 'Message received — VEECII will be in touch shortly.';
        this.reset();
      } else {
        const data = await res.json();
        note.style.color = '#f20374';
        note.textContent = data.errors ? data.errors.map(x => x.message).join(', ') : 'Something went wrong. Please try again.';
      }
    } catch {
      note.style.color = '#f20374';
      note.textContent = 'Network error — please try again.';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}

// Stream links — keep text visible on hover (only on music page)
document.querySelectorAll('.stream-link').forEach(link => {
  const text = link.textContent;
  link.innerHTML = `<span>${text}</span>`;
});