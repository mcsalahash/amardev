(function(){
  var racine = document.documentElement;
  var CLE_TAILLE = 'amardev-taille-texte';
  var CLE_CONTRASTE = 'amardev-contraste';

  /* --- Appliquer les préférences mémorisées dès le chargement --- */
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
          alert("La lecture audio n'est pas disponible sur ce navigateur.");
          return;
        }
        if (enLecture){
          window.speechSynthesis.cancel();
          enLecture = false;
          btnEcouter.setAttribute('aria-pressed', 'false');
          btnEcouter.textContent = '🔊 Écouter la page';
          return;
        }
        var zone = document.getElementById('contenu') || document.body;
        var enonce = new SpeechSynthesisUtterance(zone.innerText);
        enonce.lang = 'fr-FR';
        enonce.rate = 0.95;
        enonce.onend = function(){
          enLecture = false;
          btnEcouter.setAttribute('aria-pressed', 'false');
          btnEcouter.textContent = '🔊 Écouter la page';
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(enonce);
        enLecture = true;
        btnEcouter.setAttribute('aria-pressed', 'true');
        btnEcouter.textContent = '⏹ Arrêter la lecture';
      });

      window.addEventListener('beforeunload', function(){
        if ('speechSynthesis' in window){ window.speechSynthesis.cancel(); }
      });
    }
  });
})();
