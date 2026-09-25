/**
 * Charge un composant HTML externe
 * et l'insère dans un élément de la page.
 *
 * @param {string} selecteur - Élément cible
 * @param {string} chemin - Chemin du composant HTML
 * @returns {Promise<void>}
 */
async function chargerComposant(selecteur, chemin) {
  const cible = document.querySelector(selecteur);

  if (!cible) {
    return;
  }

  try {
    const reponse = await fetch(chemin);

    if (!reponse.ok) {
      throw new Error(
        `Impossible de charger le composant : ${chemin}`
      );
    }

    cible.innerHTML = await reponse.text();

  } catch (erreur) {
    console.error(erreur);
  }
}


/**
 * Initialise les composants communs du site.
 */
async function initialiserComposants() {

  await Promise.all([
    chargerComposant(
      '#composant-header',
      '/COMPOSANTS/header.html'
    ),

    chargerComposant(
      '#composant-footer',
      '/COMPOSANTS/footer.html'
    )
  ]);

  document.dispatchEvent(
    new Event('composants-charges')
  );
}

initialiserComposants();