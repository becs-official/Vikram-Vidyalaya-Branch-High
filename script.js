const galleryItems = [
  {image:'assets/independence-day-01.jpeg', category:'events', title:'Floral tribute ceremony'},
  {image:'assets/independence-day-02.jpeg', category:'events', title:'Independence Day assembly'},
  {image:'assets/independence-day-03.jpeg', category:'events', title:'Flag hoisting celebration'},
  {image:'assets/independence-day-04.jpeg', category:'cultural', title:'Patriotic dance performance'},
  {image:'assets/independence-day-05.jpeg', category:'cultural', title:'Student cultural performance'},
  {image:'assets/independence-day-06.jpeg', category:'cultural', title:'Traditional dance presentation'},
  {image:'assets/independence-day-07.jpeg', category:'student-life', title:'School courtyard performance'},
  {image:'assets/independence-day-08.jpeg', category:'events', title:'Independence Day gathering'},
  {image:'assets/independence-day-09.jpeg', category:'student-life', title:'Students with the national flag'}
];
const gallery = document.querySelector('#gallery-grid'); let visibleItems = galleryItems; let current = 0;
function renderGallery(filter='all') { visibleItems = filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter); gallery.innerHTML = visibleItems.map((item, i) => `<button class="gallery-item" data-index="${i}" aria-label="Open ${item.title}, ${item.category}"><img loading="lazy" src="${item.image}" width="900" height="700" alt="${item.title}" /><span>${item.title}</span></button>`).join(''); }
renderGallery();
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { document.querySelector('.filters .active').classList.remove('active'); button.classList.add('active'); renderGallery(button.dataset.filter); }));
const lightbox = document.querySelector('#lightbox'); const lightboxImage = lightbox.querySelector('img');
function showImage(index){current=(index+visibleItems.length)%visibleItems.length; const item=visibleItems[current]; lightboxImage.src=item.image; lightboxImage.alt=item.title; lightbox.querySelector('figcaption').textContent=`${item.title} · ${item.category.replace('-', ' ')}`; lightbox.querySelector('.lightbox-count').textContent=`${current+1} / ${visibleItems.length}`;}
gallery.addEventListener('click', e => {const item=e.target.closest('.gallery-item');if(!item)return;showImage(+item.dataset.index);lightbox.showModal();document.body.classList.add('no-scroll');});
lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close()); lightbox.addEventListener('close',()=>document.body.classList.remove('no-scroll')); lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(current-1)); lightbox.querySelector('.lightbox-next').addEventListener('click',()=>showImage(current+1));
document.addEventListener('keydown',e=>{if(!lightbox.open)return;if(e.key==='ArrowLeft')showImage(current-1);if(e.key==='ArrowRight')showImage(current+1);}); let touchStart=0; lightbox.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].screenX,{passive:true});lightbox.addEventListener('touchend',e=>{let difference=e.changedTouches[0].screenX-touchStart;if(Math.abs(difference)>40)showImage(current+(difference>0?-1:1));},{passive:true});
const notices = [{date:'To be updated',category:'Notice',title:'School notice information',description:'Official notices and announcements will be published here.'},{date:'To be updated',category:'Update',title:'Academic information',description:'Please contact the school office for current academic updates.'},{date:'To be updated',category:'Announcement',title:'Student activity updates',description:'Upcoming activities and participation information will be added here.'}];
document.querySelector('#notice-list').innerHTML=notices.map(n=>`<article class="notice"><div class="notice-date">${n.date}<small>${n.category}</small></div><div><h3>${n.title}</h3><p>${n.description}</p></div><a href="#contact">View notice →</a></article>`).join('');
const header=document.querySelector('.site-header');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
const homeBrand=document.querySelector('.site-header .brand[href="index.html#top"]');
homeBrand?.addEventListener('click',event=>{if(location.pathname.endsWith('/index.html')){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#top');}});
const backToTop=document.querySelector('.footer-bottom a[href="#top"]');
backToTop?.addEventListener('click',event=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#top');});
const toggle=document.querySelector('.menu-toggle'), links=document.querySelector('.nav-links');
const mobileMenu=matchMedia('(max-width: 1024px)');
function setMenu(open){
  links.classList.toggle('open',open);
  links.setAttribute('aria-hidden',String(!open));
  toggle.setAttribute('aria-expanded',String(open));
  toggle.querySelector('.sr-only').textContent=open?'Close menu':'Open menu';
  document.body.classList.toggle('no-scroll',open);
}
toggle.addEventListener('click',()=>setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&links.classList.contains('open')){setMenu(false);toggle.focus();}});
document.addEventListener('click',event=>{if(links.classList.contains('open')&&!links.contains(event.target)&&!toggle.contains(event.target))setMenu(false);});
function syncMenuForViewport(){
  if(mobileMenu.matches)setMenu(false);
  else {links.classList.remove('open');links.setAttribute('aria-hidden','false');toggle.setAttribute('aria-expanded','false');document.body.classList.remove('no-scroll');}
}
mobileMenu.addEventListener('change',syncMenuForViewport);
syncMenuForViewport();
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
