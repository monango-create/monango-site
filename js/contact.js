/**
 * Gestion du formulaire de contact MONANGO.
 */

document.addEventListener('DOMContentLoaded', () => {
  const formulaire = document.getElementById('formulaire-contact');

  if (!formulaire) {
    return;
  }

  const bouton = formulaire.querySelector('button[type="submit"]');

  const message = document.createElement('div');
  message.className = 'm-formulaire__message';
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');
  message.hidden = true;

  formulaire.appendChild(message);

  formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();

    if (!formulaire.checkValidity()) {
      formulaire.reportValidity();
      return;
    }

    const texteOriginal = bouton.textContent;

    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';

    message.hidden = true;
    message.className = 'm-formulaire__message';

    try {
      const donnees = new FormData(formulaire);

      const reponse = await fetch(formulaire.action, {
        method: 'POST',
        body: donnees,
        headers: {
          Accept: 'application/json'
        }
      });

      const resultat = await reponse.json();

      if (!reponse.ok || !resultat.success) {
        throw new Error('Échec de l’envoi');
      }

      message.textContent =
        'Votre demande a bien été envoyée. Merci pour votre confiance. L’équipe MONANGO vous répondra dans les meilleurs délais.';

      message.classList.add('m-formulaire__message--succes');
      message.hidden = false;

      formulaire.reset();

    } catch (erreur) {
      message.textContent =
        'Votre demande n’a pas pu être envoyée. Vérifiez votre connexion puis réessayez. Vous pouvez également nous contacter directement sur WhatsApp.';

      message.classList.add('m-formulaire__message--erreur');
      message.hidden = false;

    } finally {
      bouton.disabled = false;
      bouton.textContent = texteOriginal;
    }
  });
});