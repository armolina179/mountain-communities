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

// Interactive Map: hotspots move content into the left panel.
// Keeps a11y in mind (aria-pressed, keyboard activation).
(() => {
    const titleEl = document.getElementById('continent-title');
    const bodyEl  = document.getElementById('continent-body');
    const panel   = document.querySelector('.continent-panel');
    const hotspots = [...document.querySelectorAll('.hotspot')];
  
    if (!titleEl || !bodyEl || hotspots.length === 0) return;
  
    // Content data
    const DATA = {
      eu: {
        title: 'Europe',
        sections: [
          {
            h: 'Scottish Highlands',
            bullets: [
              'Gaelic communities | Na Gàidheil',
              'Crofting settlements',
              'Cairngorms and Grampian ranges',
            ]
          },
          {
            h: 'Western Pyrenees',
            bullets: [
              'Basque Country (Euskal Herria)',
              'Navarrese Pyrenean towns',
              'Shepherding and transhumance routes',
            ]
          },
          {
            h: 'Sápmi | Sámi',
            bullets: [
              'Reindeer herding communities',
              'Kola (Norway, Sweden, Finland)',
              'Subarctic mountain plateaus',
            ]
          },
        ],
      },
      af: {
        title: 'Africa',
        sections: [
          { h: 'Atlas Mountains (Morocco, Algeria, Tunisia)', bullets: [
            'Amazigh/Berber villages with earthen architecture',
            'Agro-pastoral transhumance',
            'Trekking and craft economies',
          ]},
          { h: 'Ethiopian Highlands', bullets: [
            'Amhara & Oromo highland farming cultures',
            'Injera grain (teff) heartland',
            'Unique Afro-alpine ecology',
          ]},
        ],
      },
      as: {
        title: 'Asia',
        sections: [
          { h: 'Himalaya & Karakoram', bullets: [
            'Sherpa, Ladakhi, Balti, and more',
            'Yak herding, high-altitude agriculture',
            'Sacred landscapes and monasteries',
          ]},
          { h: 'Japanese Alps', bullets: [
            'Matagi hunting tradition',
            'Satoyama mountain villages',
            'Hot springs and forest stewardship',
          ]},
        ],
      },
      na: {
        title: 'North America',
        sections: [
          { h: 'Rocky Mountains', bullets: [
            'Tribal homelands (Ute, Blackfeet, Ktunaxa)',
            'Mountain ranching and forestry',
            'Wildlife corridors and conservation',
          ]},
          { h: 'Appalachia', bullets: [
            'Multi-generational coal and craft traditions',
            'Old-time music and storytelling',
            'Ecological restoration of ridgelines',
          ]},
        ],
      },
      sa: {
        title: 'South America',
        sections: [
          { h: 'Andes', bullets: [
            'Quechua & Aymara communities',
            'Terracing and potato biodiversity',
            'Irrigation canals & communal labor (ayni/minka)',
          ]},
        ],
      },
      oc: {
        title: 'Oceania',
        sections: [
          { h: 'Southern Alps (Aotearoa New Zealand)', bullets: [
            'Ngāi Tahu rohe',
            'High-country stations and tramping culture',
            'Glacier valleys and alpine passes',
          ]},
          { h: 'Highlands of Papua New Guinea', bullets: [
            'Horticulture in montane ecosystems',
            'Clan-based land stewardship',
            'Rich linguistic diversity',
          ]},
        ],
      },
    };
  
    function render(key){
      const entry = DATA[key];
      if (!entry) return;
  
      // Set pressed states
      hotspots.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.key === key)));
  
      // Render title & sections
      titleEl.textContent = entry.title || '';
      bodyEl.innerHTML = entry.sections.map(sec => `
        <section>
          <h3>${sec.h}</h3>
          <ul>${sec.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        </section>
      `).join('');
  
      // Tiny fade 
      panel.classList.remove('fade-in');
      void panel.offsetWidth;
      panel.classList.add('fade-in');
    }
  
    // Initial: pick Northa America by default
    render('na');
  
    // Events
    hotspots.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', btn.textContent.trim());
      btn.addEventListener('click', () => render(btn.dataset.key));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); render(btn.dataset.key); }
      });
    });
  })();
  