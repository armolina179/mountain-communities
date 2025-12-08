// Simple cross-page fade (works everywhere)
(() => {
  const D_OUT = 300;  // ms
  const body = document.body;

  // fade IN on load
  requestAnimationFrame(() => body.classList.add('page-fade-in'));

  // fade OUT on links marked data-fade
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-fade]');
    if (!a) return;
    // let modifier-clicks open a new tab normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;

    e.preventDefault();
    const href = a.getAttribute('href');
    body.classList.add('page-fade-out');
    // navigate after the fade completes
    setTimeout(() => { window.location.href = href; }, D_OUT);
  });
})();

// Contact form validation (accessible, minimal, no framework)
(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    const status = document.getElementById('form-status');
    const hp = form.querySelector('#company'); // honeypot
  
    // Regex
    const EMAIL_RE =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
  
    const fields = {
      name:    { el: form.querySelector('#name'),    required: true, min: 2,  label: 'Full name' },
      email:   { el: form.querySelector('#email'),   required: true, email: true, label: 'Email' },
      subject: { el: form.querySelector('#subject'), required: false, max: 120, label: 'Subject' },
      message: { el: form.querySelector('#message'), required: true, min: 10, label: 'Message' }
    };
  
    const norm = v => (v || '').replace(/\s+/g, ' ').trim();
  
    function ensureErrorEl(input){
      let err = input.closest('.field')?.querySelector('.field-error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'field-error';
        err.id = `err-${input.id}`;
        err.hidden = true;
        input.closest('.field')?.appendChild(err);
        input.setAttribute('aria-describedby', err.id);
      }
      return err;
    }
    function setInvalid(input, msg){
      const err = ensureErrorEl(input);
      err.textContent = msg;
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.closest('.field')?.classList.add('invalid');
    }
    function setValid(input){
      const err = ensureErrorEl(input);
      err.textContent = '';
      err.hidden = true;
      input.removeAttribute('aria-invalid');
      input.closest('.field')?.classList.remove('invalid');
    }
    const isEmail = v => EMAIL_RE.test(v);
  
    function validateField(key){
      const cfg = fields[key];
      const el  = cfg.el;
      let val   = norm(el.value);
  
      if (cfg.required && !val){
        setInvalid(el, `${cfg.label} is required.`);
        return false;
      }
      if (!val){ setValid(el); return true; }
  
      if (cfg.min && val.length < cfg.min){
        setInvalid(el, `${cfg.label} must be at least ${cfg.min} characters.`);
        return false;
      }
      if (cfg.max && val.length > cfg.max){
        setInvalid(el, `${cfg.label} must be ${cfg.max} characters or less.`);
        return false;
      }
      if (cfg.email && !isEmail(val)){
        setInvalid(el, `Please enter a valid email like name@example.com.`);
        return false;
      }
  
      setValid(el);
      el.value = val; // keep trimmed
      return true;
    }
  
    // validate on blur, clear as user types
    Object.keys(fields).forEach(k => {
      const el = fields[k].el;
      el.addEventListener('blur',  () => validateField(k));
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') validateField(k);
      });
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Honeypot stops simple bots
      if (hp && norm(hp.value)) {
        status.textContent = 'Submission blocked.';
        return;
      }
  
      const ok = Object.keys(fields).every(validateField);
      if (!ok){
        status.textContent = 'Please fix the highlighted fields.';
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      status.textContent = 'Thank you! This form is not functional.';
      form.reset();
    });
  })();
  