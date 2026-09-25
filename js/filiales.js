/* =========================================================
   ÉCOSYSTÈME MONANGO — HERO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    const ecosysteme =
      document.querySelector(
        ".m-hero__ecosysteme"
      );

    const domaines =
      document.querySelector(
        ".m-hero__domaines"
      );

    const connexions =
      document.querySelector(
        ".m-hero__connexions"
      );


    /*
     * Le composant n'existe pas sur cette page :
     * aucune action nécessaire.
     */
    if (
      !ecosysteme ||
      !domaines ||
      !connexions
    ) {
      return;
    }


    try {

      const reponse =
        await fetch(
          "/data/filiales.json",
          {
            cache: "no-cache"
          }
        );


      if (!reponse.ok) {
        throw new Error(
          `Impossible de charger filiales.json (${reponse.status})`
        );
      }


      const filiales =
        await reponse.json();


      /*
       * Vérification de la structure JSON.
       */
      if (!Array.isArray(filiales)) {
        throw new Error(
          "filiales.json doit contenir un tableau de filiales"
        );
      }


      /*
       * SOURCE DE VÉRITÉ :
       *
       * statut = visibilité
       * id     = ordre
       *
       * Une filiale active apparaît automatiquement.
       */
      const filialesActives =
        filiales
          .filter(
            (filiale) =>
              filiale.statut === "active"
          )
          .sort(
            (a, b) =>
              Number(a.id) -
              Number(b.id)
          );


      /*
       * Transmission du nombre réel de domaines
       * au système CSS.
       */
      ecosysteme.style.setProperty(
        "--nombre-domaines",
        filialesActives.length
      );


      /*
       * Nettoyage avant génération.
       */
      domaines.innerHTML = "";
      connexions.innerHTML = "";


      /*
       * Aucun domaine actif.
       */
      if (!filialesActives.length) {

        console.warn(
          "Aucune filiale active dans filiales.json"
        );

        return;
      }


      /*
       * Génération des filiales actives.
       */
      filialesActives.forEach(
        (filiale, index) => {

          const domaine =
            document.createElement("a");


          domaine.className =
            "m-hero__domaine";


          domaine.href =
            `/filiales/${filiale.slug}/`;


          domaine.style.setProperty(
            "--couleur-filiale",
            filiale.couleur
          );


          domaine.style.setProperty(
            "--index",
            index
          );


          domaine.setAttribute(
            "aria-label",
            `Découvrir ${filiale.nom}`
          );


          /*
           * Affichage court autour du noyau.
           *
           * Le JSON conserve le nom complet.
           */
          const nomCourt =
            filiale.nom.replace(
              /^MONANGO\s+/,
              ""
            );


          domaine.innerHTML = `

            <span
              class="m-hero__domaine-point"
              aria-hidden="true"
            ></span>

            <span
              class="m-hero__domaine-nom"
            >
              ${nomCourt}
            </span>

          `;


          domaines.appendChild(
            domaine
          );


          /*
           * Connexion vers le noyau.
           */
          const connexion =
            document.createElement("span");


          connexion.className =
            "m-hero__connexion";


          connexion.style.setProperty(
            "--index",
            index
          );


          connexions.appendChild(
            connexion
          );

        }
      );


      /*
       * Positionnement circulaire.
       */
      positionnerDomaines(
        filialesActives
      );


    } catch (erreur) {

      console.error(
        "Erreur lors du chargement de l’écosystème MONANGO :",
        erreur
      );

    }

  }
);


/* =========================================================
   POSITIONNEMENT DES DOMAINES
   ========================================================= */

/**
 * Positionne les filiales actives
 * autour du noyau MONANGO.
 *
 * L'ordre dépend exclusivement de l'id.
 */
function positionnerDomaines(
  filiales
) {

  const domaines =
    document.querySelectorAll(
      ".m-hero__domaine"
    );


  const nombre =
    filiales.length;


  if (!nombre) {
    return;
  }


  /*
   * Premier domaine en haut.
   */
  const angleDepart = 0;


  /*
   * Répartition régulière.
   */
  const pas =
    360 / nombre;


  domaines.forEach(
    (domaine, index) => {

      const angle =
        angleDepart +
        (pas * index);


      domaine.style.setProperty(
        "--angle",
        `${angle}deg`
      );

    }
  );

}