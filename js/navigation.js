/* =========================================================
   NAVIGATION — MONANGO
   ========================================================= */


/* =========================================================
   NORMALISATION DES CHEMINS
   ========================================================= */

function normaliserChemin(chemin) {

  if (chemin === '/') {
    return '/';
  }

  return chemin.replace(/\/+$/, '');
}


/* =========================================================
   INITIALISATION DE LA NAVIGATION
   ========================================================= */

let navigationInitialisee = false;

function initialiserNavigation() {

  
  const bouton =
    document.getElementById('nav-toggle');

  const menu =
    document.getElementById('nav-mobile');

  const liens =
    document.querySelectorAll('.m-nav__liste a');

  if (navigationInitialisee) {
    return;
  }

  const header =
    document.getElementById('site-header');


  /* ========================================================
     VÉRIFICATION
     ======================================================== */

  if (!header) {
    return;
  }

  navigationInitialisee = true;


  /* ========================================================
     MENU MOBILE
     ======================================================== */

  if (bouton && menu) {

    bouton.addEventListener('click', () => {

      const ouvert =
        bouton.getAttribute('aria-expanded') === 'true';

      bouton.setAttribute(
        'aria-expanded',
        String(!ouvert)
      );

      menu.classList.toggle(
        'm-nav--ouvert',
        !ouvert
      );

    });

  }


  /* ========================================================
     PAGE ACTIVE
     ======================================================== */

  const cheminActuel =
    normaliserChemin(
      window.location.pathname
    );


  liens.forEach((lien) => {

    const urlLien =
      new URL(
        lien.href,
        window.location.origin
      );

    const cheminLien =
      normaliserChemin(
        urlLien.pathname
      );

    let actif =
      cheminLien === cheminActuel;


    if (
      cheminLien !== '/' &&
      cheminActuel.startsWith(
        `${cheminLien}/`
      )
    ) {
      actif = true;
    }


    if (actif) {

      lien.setAttribute(
        'aria-current',
        'page'
      );

    } else {

      lien.removeAttribute(
        'aria-current'
      );

    }

  });


  /* ========================================================
     ÉTAT DU HEADER AU DÉFILEMENT
     ======================================================== */

  const mettreAJourHeader = () => {

    const estDefile =
      window.scrollY > 8;

    header.classList.toggle(
      'm-header--scrolled',
      estDefile
    );

  };


  /* État initial */

  mettreAJourHeader();


  /* Mise à jour pendant le défilement */

  window.addEventListener(
    'scroll',
    mettreAJourHeader,
    { passive: true }
  );

}


/* =========================================================
   CHARGEMENT DU COMPOSANT HEADER
   ========================================================= */

document.addEventListener(
  'composants-charges',
  initialiserNavigation
);


/* =========================================================
   SÉCURITÉ
   Si le header est déjà présent au moment du chargement
   ========================================================= */

if (document.getElementById('site-header')) {
  initialiserNavigation();
}