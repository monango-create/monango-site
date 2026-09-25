/* =========================================================
 *  RENDU DES FILIALES
 *  ========================================================= */


/* =========================================================
 *  CARTE FILIALE
 *  ========================================================= */

/**
 * Crée une carte à partir des données d'une filiale.
 *
 * Les données sont fournies par /data/filiales.json.
 * La carte entière constitue le lien vers la page de la filiale.
 */
function creerCarteFiliale(filiale) {

  const carte = document.createElement("a");

  carte.className = "m-card";

  carte.href = `/filiales/${filiale.slug}/`;

  carte.dataset.filialeSlug = filiale.slug;

  carte.style.setProperty(
    "--couleur-carte",
    filiale.couleur
  );

  carte.setAttribute(
    "aria-label",
    `Découvrir ${filiale.nom}`
  );

  carte.innerHTML = `

    <div
      class="m-card__accent"
      aria-hidden="true"
    ></div>


    <div class="m-card__entete">

      <img
        class="m-card__logo"
        src="${filiale.logo}"
        alt="${filiale.nom}"
        loading="lazy"
      >

      <span
        class="m-card__indicateur"
        aria-hidden="true"
      ></span>

    </div>


    <div
      class="m-card__visuel"
      aria-hidden="true"
    >

      <img
        class="m-card__illustration"
        src="${filiale.visuel}"
        alt=""
        loading="lazy"
      >

    </div>


    <div class="m-card__contenu">

      <p class="m-card__domaine">
        ${filiale.domaine}
      </p>

      <h3 class="m-card__titre">
        ${filiale.nom}
      </h3>

      <p class="m-card__description">
        ${filiale.description}
      </p>

    </div>


    <span class="m-card__action">

      <span>
        Découvrir
      </span>

      <span
        class="m-card__fleche"
        aria-hidden="true"
      >
        →
      </span>

    </span>

  `;

  return carte;
}


/* =========================================================
 *  HERO — ÉLÉMENT FILIALE
 *  ========================================================= */

/**
 * Crée un élément de navigation pour le Hero.
 *
 * Le Hero utilise exactement les mêmes données que la grille.
 *
 * Chaque élément est directement cliquable.
 */
function creerFilialeHero(filiale, index, total) {

  const lien = document.createElement("a");

  lien.className = "m-hero__domaine";

  lien.href = `/filiales/${filiale.slug}/`;

  lien.dataset.filialeSlug = filiale.slug;

  lien.style.setProperty(
    "--couleur-filiale",
    filiale.couleur
  );

  lien.setAttribute(
    "aria-label",
    `Découvrir ${filiale.nom}`
  );


  /*
   * Calcul de la position autour du noyau.
   *
   * On utilise des coordonnées polaires.
   * Le JS place donc automatiquement autant de
   * filiales que nécessaire autour de MONANGO.
   */
  const angle = (
    -90 +
    (360 / total) * index
  );


  lien.style.setProperty(
    "--angle",
    `${angle}deg`
  );


  lien.innerHTML = `

    <span class="m-hero__domaine-point"></span>


    <span class="m-hero__domaine-contenu">

      <img
        class="m-hero__domaine-logo"
        src="${filiale.logo}"
        alt=""
        aria-hidden="true"
      >

      <span class="m-hero__domaine-nom">
        ${filiale.nom.replace("MONANGO ", "")}
      </span>

      <span class="m-hero__domaine-domaine">
        ${filiale.domaine}
      </span>

    </span>

  `;


  return lien;
}


/* =========================================================
 *  HERO — AFFICHAGE
 *  ========================================================= */

/**
 * Affiche les filiales actives dans le Hero.
 *
 * La source est exactement la même que celle
 * utilisée pour la grille.
 */
function afficherFilialesHero(filialesActives) {

  const conteneur =
    document.getElementById("hero-filiales");


  if (!conteneur) {
    return;
  }


  /*
   * Nettoyage du contenu de chargement.
   */
  conteneur.innerHTML = "";


  if (!filialesActives.length) {

    const message =
      document.createElement("span");

    message.className =
      "m-hero__chargement";

    message.textContent =
      "Aucune expertise disponible";

    conteneur.appendChild(message);

    return;
  }


  /*
   * Création des éléments.
   */
  filialesActives.forEach(
    (filiale, index) => {

      const element =
        creerFilialeHero(
          filiale,
          index,
          filialesActives.length
        );

      conteneur.appendChild(element);

    }
  );

}


/* =========================================================
 *  ANIMATION DES CARTES
 *  ========================================================= */

/**
 * Anime les cartes lorsqu'elles entrent dans le viewport.
 */
function animerCartesFiliales(cartes) {

  if (!cartes.length) {
    return;
  }


  if (!("IntersectionObserver" in window)) {
    return;
  }


  cartes.forEach((carte, index) => {

    carte.dataset.index = index;

    carte.style.setProperty(
      "--delai-apparition",
      `${index * 80}ms`
    );

    carte.classList.add(
      "m-card--animation"
    );

  });


  const observateur =
    new IntersectionObserver(
      (entrees, observer) => {

        entrees.forEach((entree) => {

          if (!entree.isIntersecting) {
            return;
          }


          const carte =
            entree.target;


          carte.classList.add(
            "m-card--visible"
          );


          observer.unobserve(carte);

        });

      },
      {
        threshold: 0.12
      }
    );


  cartes.forEach((carte) => {

    observateur.observe(carte);

  });

}


/* =========================================================
 *  AFFICHAGE GLOBAL
 *  ========================================================= */

/**
 * Charge les filiales et construit :
 *
 * 1. le Hero
 * 2. la grille
 *
 * Seules les filiales ayant le statut "active"
 * sont publiées.
 */
async function afficherFiliales() {

  const conteneur =
    document.getElementById(
      "grille-filiales"
    );


  /*
   * La page peut éventuellement être utilisée
   * sans grille.
   *
   * On vérifie cependant aussi le Hero.
   */
  const hero =
    document.getElementById(
      "hero-filiales"
    );


  if (!conteneur && !hero) {
    return;
  }


  try {

    /*
     * Source unique des données.
     */
    const filiales =
      await chargerDonnees(
        "/data/filiales.json"
      );


    /*
     * On conserve la logique actuelle :
     *
     * - uniquement active
     * - ordre par ID
     */
    const filialesActives =
      filiales
        .filter(
          (filiale) =>
            filiale.statut === "active"
        )
        .sort(
          (a, b) =>
            a.id - b.id
        );


    /* =====================================================
     * HERO
     * ===================================================== */

    afficherFilialesHero(
      filialesActives
    );


    /* =====================================================
     * GRILLE
     * ===================================================== */

    if (conteneur) {

      conteneur.dataset.loading =
        "false";

      conteneur.innerHTML = "";


      const cartes =
        filialesActives.map(
          (filiale) => {

            const carte =
              creerCarteFiliale(
                filiale
              );

            conteneur.appendChild(
              carte
            );

            return carte;

          }
        );


      animerCartesFiliales(
        cartes
      );

    }


  } catch (erreur) {

    if (conteneur) {

      conteneur.dataset.loading =
        "false";

    }


    console.error(
      "Erreur lors du chargement des filiales :",
      erreur
    );

  }

}


/* =========================================================
 *  INITIALISATION
 *  ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  afficherFiliales
);