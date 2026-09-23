const galleryItems = [
  {image:'assets/independence-day-01.jpeg', category:'events', title:'Floral Tribute Ceremony'},
  {image:'assets/independence-day-02.jpeg', category:'events', title:'Independence Day Assembly'},
  {image:'assets/independence-day-03.jpeg', category:'events', title:'Flag Hoisting'},
  {image:'assets/independence-day-04.jpeg', category:'cultural', title:'Cultural Performance'},
  {image:'assets/independence-day-05.jpeg', category:'cultural', title:'Student Dance'},
  {image:'assets/independence-day-06.jpeg', category:'cultural', title:'Traditional Presentation'},
  {image:'assets/independence-day-07.jpeg', category:'student-life', title:'Courtyard Gathering'},
  {image:'assets/independence-day-08.jpeg', category:'events', title:'School Celebration'},
  {image:'assets/independence-day-09.jpeg', category:'student-life', title:'Students with National Flag'},
  {image:'assets/school-campus-event.jpeg', category:'campus', title:'School Event'},
  {image:'assets/school-entrance.jpeg', category:'campus', title:'School Entrance'}
];

const gallery = document.querySelector('#gallery-grid'); 
let visibleItems = galleryItems; 
let current = 0;

function renderGallery(filter='all') { 
  if(!gallery) return;
  visibleItems = filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter); 
  gallery.innerHTML = visibleItems.map((item, i) => 
    `<button type="button" class="gallery-item" data-index="${i}" aria-label="Open ${item.title}">
      <img loading="lazy" src="${item.image}" alt="${item.title}" />
      <span>${item.title}</span>
    </button>`
  ).join(''); 
}

if(gallery) {
  renderGallery();
  document.querySelectorAll('.gallery-filters button').forEach(button => {
    button.addEventListener('click', () => { 
      document.querySelector('.gallery-filters .active').classList.remove('active'); 
      button.classList.add('active'); 
      renderGallery(button.dataset.filter); 
    });
  });
}

const lightbox = document.querySelector('#lightbox'); 
if(lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  
  function showImage(index){
    current = (index + visibleItems.length) % visibleItems.length; 
    const item = visibleItems[current]; 
    lightboxImage.src = item.image; 
    lightboxImage.alt = item.title; 
    lightbox.querySelector('figcaption').textContent = item.title; 
    lightbox.querySelector('.lightbox-count').textContent = `${current+1} / ${visibleItems.length}`;
  }

  if(gallery) {
    gallery.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if(!item) return;
      showImage(+item.dataset.index);
      lightbox.showModal();
      document.body.classList.add('no-scroll');
    });
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close()); 
  lightbox.addEventListener('close', () => document.body.classList.remove('no-scroll')); 
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current-1)); 
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(current+1));

  document.addEventListener('keydown', e => {
    if(!lightbox.open) return;
    if(e.key === 'ArrowLeft') showImage(current-1);
    if(e.key === 'ArrowRight') showImage(current+1);
  }); 
  
  let touchStart = 0; 
  lightbox.addEventListener('touchstart', e => touchStart = e.changedTouches[0].screenX, {passive:true});
  lightbox.addEventListener('touchend', e => {
    let difference = e.changedTouches[0].screenX - touchStart;
    if(Math.abs(difference) > 40) showImage(current + (difference > 0 ? -1 : 1));
  }, {passive:true});
}

// Header scroll
const siteHeader = document.querySelector('.site-header');
const navSticky = document.querySelector('#main-nav-sticky');
const brandingHeader = document.querySelector('.main-branding-header');

if (navSticky && brandingHeader) {
  window.addEventListener('scroll', () => {
    const headerHeight = brandingHeader.offsetTop + brandingHeader.offsetHeight;
    if (window.scrollY > headerHeight) {
      navSticky.classList.add('sticky');
      document.body.style.paddingTop = navSticky.offsetHeight + 'px';
      document.querySelector('.mobile-brand').style.display = 'flex';
    } else {
      navSticky.classList.remove('sticky');
      document.body.style.paddingTop = '0px';
      document.querySelector('.mobile-brand').style.display = 'none';
    }
  }, {passive:true});
}

// Mobile Menu
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
const mobileMenu = window.matchMedia('(max-width: 768px)');

function setMenu(open){
  if(!links) return;
  links.classList.toggle('open', open);
  links.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
}

if(toggle) {
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', (e) => {
      // If it's a dropdown toggle and we're on mobile
      if (a.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
        e.preventDefault();
        const parentLi = a.closest('.dropdown');
        parentLi.classList.toggle('open');
        a.setAttribute('aria-expanded', parentLi.classList.contains('open'));
        return;
      }
      setMenu(false);
    });
  });
  
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && links.classList.contains('open')){
      setMenu(false);
      toggle.focus();
    }
  });
}

function syncMenuForViewport(){
  if(mobileMenu.matches) setMenu(false);
  else if(links) {
    links.classList.remove('open');
    links.setAttribute('aria-hidden','false');
    if(toggle) toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('no-scroll');
  }
}
mobileMenu.addEventListener('change', syncMenuForViewport);
syncMenuForViewport();

// Scroll Reveal
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Utility Bar Logic (Language & Accessibility)
document.addEventListener('DOMContentLoaded', () => {
  // Language Toggle
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      const activeLang = btn.dataset.lang;
      document.querySelectorAll(`.lang-btn[data-lang="${activeLang}"]`).forEach(b => b.classList.add('active'));
      document.body.setAttribute('data-lang', activeLang);
    });
  });

  // Accessibility Menu
  const a11yToggle = document.querySelector('.a11y-toggle');
  const a11yMenu = document.querySelector('.a11y-menu');
  if (a11yToggle && a11yMenu) {
    a11yToggle.addEventListener('click', (e) => {
      const isExpanded = a11yToggle.getAttribute('aria-expanded') === 'true';
      a11yToggle.setAttribute('aria-expanded', !isExpanded);
      e.stopPropagation();
    });
    
    document.addEventListener('click', (e) => {
      if (!a11yToggle.contains(e.target) && !a11yMenu.contains(e.target)) {
        a11yToggle.setAttribute('aria-expanded', 'false');
      }
    });

    const contrastBtn = document.getElementById('a11y-contrast');
    const incBtn = document.getElementById('a11y-text-inc');
    const decBtn = document.getElementById('a11y-text-dec');

    let contrastEnabled = false;
    contrastBtn.addEventListener('click', () => {
      contrastEnabled = !contrastEnabled;
      document.body.classList.toggle('high-contrast', contrastEnabled);
      a11yToggle.setAttribute('aria-expanded', 'false');
    });

    let textScale = 1;
    incBtn.addEventListener('click', () => {
      if(textScale < 1.4) {
        textScale += 0.1;
        document.documentElement.style.setProperty('--text-scale', textScale);
      }
    });
    
    decBtn.addEventListener('click', () => {
      if(textScale > 0.9) {
        textScale -= 0.1;
        document.documentElement.style.setProperty('--text-scale', textScale);
      }
    });
  }
});
