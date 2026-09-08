(function(){
  var estArabe = (document.documentElement.getAttribute('lang') || 'fr').toLowerCase().indexOf('ar') === 0;
  var label = estArabe ? 'العودة إلى أعلى الصفحة' : 'Retourner en haut de la page';
  var seuil = 500;

  document.addEventListener('DOMContentLoaded', function(){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'retour-haut';
    btn.setAttribute('aria-label', label);
    btn.innerHTML = '&#8593;';
    btn.hidden = true;
    document.body.appendChild(btn);

    var reduireMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function verifier(){
      btn.hidden = window.scrollY < seuil;
    }
    window.addEventListener('scroll', verifier, { passive: true });
    verifier();

    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduireMotion ? 'auto' : 'smooth' });
      var cible = document.getElementById('contenu') || document.body;
      cible.setAttribute('tabindex', '-1');
      cible.focus({ preventScroll: true });
      cible.removeAttribute('tabindex');
    });
  });
})();
