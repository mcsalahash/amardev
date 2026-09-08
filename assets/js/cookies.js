(function(){
  var CLE = 'amardev-cookies-vu';

  document.addEventListener('DOMContentLoaded', function(){
    var bandeau = document.getElementById('bandeau-cookies');
    var btnOk = document.getElementById('btn-cookies-ok');
    var btnGerer = document.getElementById('btn-gerer-cookies');
    if (!bandeau) return;

    function afficher(){
      bandeau.hidden = false;
      document.body.classList.add('bandeau-cookies-visible');
    }
    function masquer(){
      bandeau.hidden = true;
      document.body.classList.remove('bandeau-cookies-visible');
    }

    if (!localStorage.getItem(CLE)){
      afficher();
    }

    if (btnOk){
      btnOk.addEventListener('click', function(){
        localStorage.setItem(CLE, 'vu');
        masquer();
      });
    }
    if (btnGerer){
      btnGerer.addEventListener('click', afficher);
    }
  });
})();
