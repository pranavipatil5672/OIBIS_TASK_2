/**
 * Dhanashri Vikas Chandane - Personal Portfolio Script
 * Oasis Infobyte Web Development Internship - Task 2
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const typewriterElement = document.getElementById('typewriter');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const portfolioForm = document.getElementById('portfolio-form');
  const toast = document.getElementById('portfolio-toast');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const quickResumeBtn = document.getElementById('quick-resume-btn');
  const printCvBtn = document.getElementById('print-cv-btn');

  /* -------------------------------------------------------------------------
     1. Typewriter Animation Effect
     ------------------------------------------------------------------------- */
  const words = [
    'Full Stack Web Developer',
    'Frontend Specialist',
    'React & Node.js Enthusiast',
    'Creative UI/UX Designer',
    'OIBSIP Web Dev Intern'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 120;

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 60;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingDelay = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingDelay);
  }

  if (typewriterElement) {
    typeEffect();
  }

  /* -------------------------------------------------------------------------
     2. Sticky Header & Back to Top Button
     ------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* -------------------------------------------------------------------------
     3. Mobile Navigation Menu
     ------------------------------------------------------------------------- */
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });

  /* -------------------------------------------------------------------------
     4. Active Nav Item Highlighting on Scroll
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  /* -------------------------------------------------------------------------
     5. Skill Progress Bars Animation on Scroll
     ------------------------------------------------------------------------- */
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillCards.forEach(card => card.classList.add('animated'));
      }
    });
  }, { threshold: 0.25 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* -------------------------------------------------------------------------
     6. Skill Category Filter Tabs
     ------------------------------------------------------------------------- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     7. Toast Notification Utility
     ------------------------------------------------------------------------- */
  let toastTimer;
  function showToast(message, isSuccess = true) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    const iconEl = toast.querySelector('.toast-icon');

    msgEl.textContent = message;
    iconEl.innerHTML = isSuccess 
      ? '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>' 
      : '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
    toast.style.borderColor = isSuccess ? '#10b981' : '#ef4444';

    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  /* -------------------------------------------------------------------------
     8. Resume Download / Print Handler
     ------------------------------------------------------------------------- */
  function triggerCvAction() {
    // Offers seamless printable PDF generation via browser print engine
    showToast('Opening print dialog. Select "Save as PDF" to download!');
    setTimeout(() => {
      window.print();
    }, 500);
  }

  if (downloadCvBtn) downloadCvBtn.addEventListener('click', triggerCvAction);
  if (quickResumeBtn) quickResumeBtn.addEventListener('click', triggerCvAction);
  if (printCvBtn) printCvBtn.addEventListener('click', triggerCvAction);

  /* -------------------------------------------------------------------------
     9. Portfolio Contact Form Validation & Submission
     ------------------------------------------------------------------------- */
  if (portfolioForm) {
    const nameInput = document.getElementById('user_name');
    const emailInput = document.getElementById('user_email');
    const subjectInput = document.getElementById('user_subject');
    const messageInput = document.getElementById('user_message');
    const submitBtn = document.getElementById('p-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateField(input, condition) {
      const group = input.closest('.form-group');
      if (!condition) {
        group.classList.add('has-error');
        return false;
      } else {
        group.classList.remove('has-error');
        return true;
      }
    }

    [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
      inp.addEventListener('input', () => {
        inp.closest('.form-group').classList.remove('has-error');
      });
    });

    portfolioForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, emailPattern.test(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 2);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');

        setTimeout(() => {
          submitBtn.disabled = false;
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
          const senderName = nameInput.value.trim();
          portfolioForm.reset();
          showToast(`Thank you, ${senderName}! Your message was sent to Dhanashri Vikas Chandane.`);
        }, 1200);
      }
    });
  }
});
