(function(){
  var racine = document.documentElement;
  var CLE_TAILLE = 'amardev-taille-texte';
  var CLE_CONTRASTE = 'amardev-contraste';
  var langue = (racine.getAttribute('lang') || 'fr').toLowerCase();
  var estArabe = langue.indexOf('ar') === 0;

  var textes = estArabe ? {
    pasDeVoix: 'خاصية القراءة الصوتية غير متوفرة في هذا المتصفح.',
    ecouter: '🔊 استماع للصفحة',
    arreter: '⏹ إيقاف القراءة',
    voix: 'ar-SA'
  } : {
    pasDeVoix: "La lecture audio n'est pas disponible sur ce navigateur.",
    ecouter: '🔊 Écouter la page',
    arreter: '⏹ Arrêter la lecture',
    voix: 'fr-FR'
  };

  var tailleEnregistree = parseInt(localStorage.getItem(CLE_TAILLE), 10);
  var taille = (tailleEnregistree >= 16 && tailleEnregistree <= 32) ? tailleEnregistree : 20;
  racine.style.fontSize = taille + 'px';

  if (localStorage.getItem(CLE_CONTRASTE) === 'actif'){
    document.body.classList.add('contraste');
  }

  document.addEventListener('DOMContentLoaded', function(){
    var btnPlus = document.getElementById('btn-plus');
    var btnMoins = document.getElementById('btn-moins');
    var btnContraste = document.getElementById('btn-contraste');
    var btnEcouter = document.getElementById('btn-ecouter');

    if (btnContraste){
      btnContraste.setAttribute('aria-pressed', document.body.classList.contains('contraste') ? 'true' : 'false');
    }

    if (btnPlus){
      btnPlus.addEventListener('click', function(){
        if (taille < 32){
          taille += 2;
          racine.style.fontSize = taille + 'px';
          localStorage.setItem(CLE_TAILLE, taille);
        }
      });
    }
    if (btnMoins){
      btnMoins.addEventListener('click', function(){
        if (taille > 16){
          taille -= 2;
          racine.style.fontSize = taille + 'px';
          localStorage.setItem(CLE_TAILLE, taille);
        }
      });
    }
    if (btnContraste){
      btnContraste.addEventListener('click', function(){
        var actif = document.body.classList.toggle('contraste');
        btnContraste.setAttribute('aria-pressed', actif ? 'true' : 'false');
        localStorage.setItem(CLE_CONTRASTE, actif ? 'actif' : 'inactif');
      });
    }

    if (btnEcouter){
      var enLecture = false;
      btnEcouter.addEventListener('click', function(){
        if (!('speechSynthesis' in window)){
          alert(textes.pasDeVoix);
          return;
        }
        if (enLecture){
          window.speechSynthesis.cancel();
          enLecture = false;
          btnEcouter.setAttribute('aria-pressed', 'false');
          btnEcouter.textContent = textes.ecouter;
          return;
        }
        var zone = document.getElementById('contenu') || document.body;
        var enonce = new SpeechSynthesisUtterance(zone.innerText);
        enonce.lang = textes.voix;
        enonce.rate = 0.95;
        enonce.onend = function(){
          enLecture = false;
          btnEcouter.setAttribute('aria-pressed', 'false');
          btnEcouter.textContent = textes.ecouter;
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(enonce);
        enLecture = true;
        btnEcouter.setAttribute('aria-pressed', 'true');
        btnEcouter.textContent = textes.arreter;
      });

      window.addEventListener('beforeunload', function(){
        if ('speechSynthesis' in window){ window.speechSynthesis.cancel(); }
      });
    }
  });
})();
