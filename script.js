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

  const formNote = document.getElementById('formNote');
  const autoResponseMsg = document.createElement('input');
  autoResponseMsg.type = 'hidden';
  autoResponseMsg.name = 'autoresponse_message';
  autoResponseMsg.value = 'Hi there,\n\nThanks for getting in touch with VEECII! We\'ve received your message and will get back to you within 24–48 hours.\n\nExcellence without Compromise.\n— Victor | VEECII';
  contactForm.appendChild(autoResponseMsg);

  const clearFormNoteState = () => {
    if (!formNote) return;
    formNote.textContent = '';
    formNote.classList.remove('success', 'error', 'visible');
  };

  const getFirstName = (name) => {
    if (!name) return 'there';
    return name.trim().split(' ')[0] || 'there';
  };

  const buildThankYouMessage = (firstName) =>
    `Hi ${firstName},\n\nEvery great project starts with a single step — and you just took yours. Thank you for submitting your consultation request with us!\n\nWe've received all your details and we'll be reaching out within 48 hours to set up time to hear all about your goals, ideas, and what you're looking to create.\n\nWe love this part — getting to know you and your stories behind the projects. So get ready for a great conversation!`;

  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.textContent = 'Sending…';
    submitButton.disabled = true;
    clearFormNoteState();

    const nameField = this.querySelector('input[name="name"]');
    const firstName = getFirstName(nameField?.value);
    const personalizedMessage = buildThankYouMessage(firstName);

    const formData = new FormData(this);
    formData.set('autoresponse_message', personalizedMessage);

    try {
      const response = await fetch(this.action, {
        method: this.method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Unable to submit the form.');
      }

      submitButton.textContent = 'Sent';
      formNote.textContent = personalizedMessage;
      formNote.classList.add('success', 'visible');
      this.reset();
    } catch (error) {
      submitButton.textContent = 'Send Message';
      submitButton.disabled = false;
      formNote.textContent = 'Sorry, something went wrong. Please try again or email info@veecii.com.';
      formNote.classList.add('error', 'visible');
    }
  });
}

// Stream links — keep text visible on hover (only on music page)
document.querySelectorAll('.stream-link').forEach(link => {
  const text = link.textContent;
  link.innerHTML = `<span>${text}</span>`;
});