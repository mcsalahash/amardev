(function(){
  var racine = document.documentElement;
  var CLE_TAILLE = 'amardev-taille-texte';
  var CLE_CONTRASTE = 'amardev-contraste';
  var langue = (racine.getAttribute('lang') || 'fr').toLowerCase();
  var estArabe = langue.indexOf('ar') === 0;
  var prefixeVoix = estArabe ? 'ar' : 'fr';

  var textes = estArabe ? {
    pasDeVoix: 'خاصية القراءة الصوتية غير متوفرة في هذا المتصفح.',
    pasDeVoixLangue: 'لم يتم العثور على صوت عربي على هذا الجهاز. يمكنكم تفعيل قراءة صوتية بالعربية من إعدادات المتصفح أو الجهاز.',
    ecouter: '🔊 استماع للصفحة',
    arreter: '⏹ إيقاف القراءة'
  } : {
    pasDeVoix: "La lecture audio n'est pas disponible sur ce navigateur.",
    pasDeVoixLangue: "Aucune voix française n'a été trouvée sur cet appareil. Vous pouvez en installer une dans les paramètres de votre navigateur ou de votre système.",
    ecouter: '🔊 Écouter la page',
    arreter: '⏹ Arrêter la lecture'
  };

  /* --- Préférences mémorisées --- */
  var tailleEnregistree = parseInt(localStorage.getItem(CLE_TAILLE), 10);
  var taille = (tailleEnregistree >= 16 && tailleEnregistree <= 32) ? tailleEnregistree : 20;
  racine.style.fontSize = taille + 'px';

  if (localStorage.getItem(CLE_CONTRASTE) === 'actif'){
    document.body.classList.add('contraste');
  }

  /* --- Sélection d'une voix correspondant réellement à la langue de la page ---
     Sans cela, un navigateur sans voix arabe installée utilise sa voix par
     défaut (souvent anglaise/française) pour lire un texte arabe : le résultat
     est incompréhensible plutôt que silencieux. On préfère prévenir clairement. */
  function trouverVoix(callback){
    if (!('speechSynthesis' in window)){ callback(null); return; }
    var voix = window.speechSynthesis.getVoices();
    if (voix && voix.length){
      callback(choisirMeilleureVoix(voix));
      return;
    }
    // Sur certains navigateurs, la liste des voix se charge de façon asynchrone.
    var tenteFallback = setTimeout(function(){
      callback(choisirMeilleureVoix(window.speechSynthesis.getVoices()));
    }, 400);
    window.speechSynthesis.onvoiceschanged = function(){
      clearTimeout(tenteFallback);
      callback(choisirMeilleureVoix(window.speechSynthesis.getVoices()));
    };
  }

  function choisirMeilleureVoix(liste){
    if (!liste || !liste.length) return null;
    var correspondances = liste.filter(function(v){
      return v.lang && v.lang.toLowerCase().indexOf(prefixeVoix) === 0;
    });
    if (!correspondances.length) return null;
    // Préférence pour une variante régionale plausible, sinon la première trouvée.
    var preferees = estArabe ? ['ar-sa', 'ar-ma', 'ar-eg'] : ['fr-fr', 'fr-ca'];
    for (var i = 0; i < preferees.length; i++){
      var m = correspondances.find(function(v){ return v.lang.toLowerCase() === preferees[i]; });
      if (m) return m;
    }
    return correspondances[0];
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

      function arreterLecture(){
        window.speechSynthesis.cancel();
        enLecture = false;
        btnEcouter.setAttribute('aria-pressed', 'false');
        btnEcouter.textContent = textes.ecouter;
      }

      btnEcouter.addEventListener('click', function(){
        if (!('speechSynthesis' in window)){
          alert(textes.pasDeVoix);
          return;
        }
        if (enLecture){
          arreterLecture();
          return;
        }
        trouverVoix(function(voix){
          if (!voix){
            alert(textes.pasDeVoixLangue);
            return;
          }
          var zone = document.getElementById('contenu') || document.body;
          var enonce = new SpeechSynthesisUtterance(zone.innerText);
          enonce.voice = voix;
          enonce.lang = voix.lang;
          enonce.rate = 0.95;
          enonce.onend = arreterLecture;
          enonce.onerror = arreterLecture;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(enonce);
          enLecture = true;
          btnEcouter.setAttribute('aria-pressed', 'true');
          btnEcouter.textContent = textes.arreter;
        });
      });

      window.addEventListener('beforeunload', function(){
        if ('speechSynthesis' in window){ window.speechSynthesis.cancel(); }
      });
    }
  });
})();
