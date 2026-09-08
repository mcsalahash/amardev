(function(){
  var overlay, imgEl, captionEl, closeBtn, prevBtn, nextBtn, compteurEl;
  var items = [];
  var currentIndex = 0;
  var lastFocused = null;
  var estArabe = (document.documentElement.getAttribute('lang') || 'fr').toLowerCase().indexOf('ar') === 0;

  var L = estArabe ? {
    fermer: 'إغلاق', prec: 'الصورة السابقة', suiv: 'الصورة التالية', agrandir: 'تكبير الصورة'
  } : {
    fermer: 'Fermer', prec: 'Image précédente', suiv: 'Image suivante', agrandir: "Agrandir l'image"
  };

  function buildOverlay(){
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-btn lightbox-fermer';
    closeBtn.setAttribute('aria-label', L.fermer);
    closeBtn.innerHTML = '&#10005;';

    prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'lightbox-btn lightbox-prec';
    prevBtn.setAttribute('aria-label', L.prec);
    prevBtn.innerHTML = estArabe ? '&#8250;' : '&#8249;';

    nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'lightbox-btn lightbox-suiv';
    nextBtn.setAttribute('aria-label', L.suiv);
    nextBtn.innerHTML = estArabe ? '&#8249;' : '&#8250;';

    var figure = document.createElement('div');
    figure.className = 'lightbox-figure';

    imgEl = document.createElement('img');
    imgEl.className = 'lightbox-img';

    captionEl = document.createElement('p');
    captionEl.className = 'lightbox-caption';

    compteurEl = document.createElement('p');
    compteurEl.className = 'lightbox-compteur';

    figure.appendChild(imgEl);
    figure.appendChild(captionEl);
    figure.appendChild(compteurEl);

    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(figure);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function(){ show(currentIndex + (estArabe ? 1 : -1)); });
    nextBtn.addEventListener('click', function(){ show(currentIndex + (estArabe ? -1 : 1)); });
    overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });

    document.addEventListener('keydown', function(e){
      if (!overlay || overlay.hidden) return;
      if (e.key === 'Escape'){ close(); }
      else if (e.key === 'ArrowRight'){ show(currentIndex + (estArabe ? -1 : 1)); }
      else if (e.key === 'ArrowLeft'){ show(currentIndex + (estArabe ? 1 : -1)); }
      else if (e.key === 'Tab'){
        var focusables = [closeBtn, prevBtn, nextBtn].filter(function(b){ return !b.hidden; });
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx === focusables.length - 1 ? 0 : idx + 1);
        focusables[next].focus();
      }
    });
  }

  function show(i){
    if (!items.length) return;
    currentIndex = (i + items.length) % items.length;
    imgEl.src = items[currentIndex].src;
    imgEl.alt = items[currentIndex].alt || '';
    captionEl.textContent = items[currentIndex].alt || '';
    var multi = items.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    compteurEl.hidden = !multi;
    if (multi){ compteurEl.textContent = (currentIndex + 1) + ' / ' + items.length; }
  }

  function open(list, index, triggerEl){
    items = list;
    lastFocused = triggerEl;
    if (!overlay) buildOverlay();
    show(index);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close(){
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused){ lastFocused.focus(); }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var cartes = document.querySelectorAll('.carte-actu');
    cartes.forEach(function(carte){
      var imgs = carte.querySelectorAll('.actu-cover, .galerie-actu img');
      if (!imgs.length) return;
      var list = Array.prototype.map.call(imgs, function(img){ return { src: img.src, alt: img.alt }; });
      imgs.forEach(function(img, idx){
        img.style.cursor = 'pointer';
        img.setAttribute('role', 'button');
        img.setAttribute('tabindex', '0');
        img.setAttribute('aria-label', (img.alt ? img.alt + ' — ' : '') + L.agrandir);
        function activer(){ open(list, idx, img); }
        img.addEventListener('click', activer);
        img.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activer(); }
        });
      });
    });
  });
})();
