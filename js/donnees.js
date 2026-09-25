async function chargerDonnees(cheminJson) {
  // async : cette fonction fait une opération qui prend du temps (fetch), donc on doit "attendre"
  try {
    // try/catch : si le fichier n'existe pas ou que le réseau échoue, on gère l'erreur proprement
    const reponse = await fetch(cheminJson);
    // await : met la fonction en pause jusqu'à ce que fetch() ait une réponse du serveur
    if (!reponse.ok) {
      // reponse.ok est false si le serveur renvoie une erreur (ex. fichier introuvable, code 404)
      throw new Error(`Erreur de chargement : ${reponse.status}`);
      // On déclenche volontairement une erreur, qui sera récupérée par le catch ci-dessous
    }
    return await reponse.json();
    // .json() transforme le texte brut de la réponse en objet JavaScript utilisable
  } catch (erreur) {
    console.error('Impossible de charger', cheminJson, erreur);
    // On affiche l'erreur dans la console pour le développeur, sans faire planter la page
    return [];
    // On renvoie un tableau vide plutôt que "rien" : le reste du code peut continuer sans planter
  }
}
