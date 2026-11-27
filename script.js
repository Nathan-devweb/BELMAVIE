/*
 * Interactions optionnelles du site BELMAVI.
 * Chaque fonctionnalite verifie la presence de ses elements : une section
 * HTML peut ainsi etre retiree sans arreter les autres comportements.
 */

/* La classe permet au CSS d'afficher le menu mobile uniquement avec JavaScript. */
document.documentElement.classList.add("js");

const entete = document.querySelector("header");
const menu = document.getElementById("menu");
const boutonMenu = document.getElementById("menu-bouton");
const boutonHaut = document.getElementById("haut");

/* Menu mobile : ouverture, fermeture par lien, clic exterieur ou touche Echap. */
if (menu && boutonMenu) {
  function fermerMenu() {
    menu.classList.remove("ouvert");
    boutonMenu.setAttribute("aria-expanded", "false");
    boutonMenu.setAttribute("aria-label", "Ouvrir le menu");
  }

  boutonMenu.addEventListener("click", () => {
    const ouvert = menu.classList.toggle("ouvert");
    boutonMenu.setAttribute("aria-expanded", String(ouvert));
    boutonMenu.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
  });

  menu.querySelectorAll("a").forEach(lien => {
    lien.addEventListener("click", fermerMenu);
  });

  document.addEventListener("click", evenement => {
    if (
      menu.classList.contains("ouvert") &&
      !menu.contains(evenement.target) &&
      !boutonMenu.contains(evenement.target)
    ) {
      fermerMenu();
    }
  });

  document.addEventListener("keydown", evenement => {
    if (evenement.key === "Escape") fermerMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) fermerMenu();
  });
}

/* Ombre de l'entete et bouton de retour, si ces elements existent. */
if (entete || boutonHaut) {
  function surDefilement() {
    if (entete) entete.classList.toggle("ombre", window.scrollY > 10);
    if (boutonHaut) boutonHaut.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", surDefilement, { passive: true });
  surDefilement();

  if (boutonHaut) {
    boutonHaut.addEventListener("click", () => {
      const mouvementReduit = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({
        top: 0,
        behavior: mouvementReduit ? "auto" : "smooth"
      });
    });
  }
}

/* Apparition des blocs : sans observateur ou avec mouvement reduit, tout reste visible. */
const elementsANePasMasquer = document.querySelectorAll("[data-reveal]");
const mouvementReduit = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!("IntersectionObserver" in window) || mouvementReduit) {
  elementsANePasMasquer.forEach(element => element.classList.add("visible"));
} else {
  const observateurApparition = new IntersectionObserver((entrees, observateur) => {
    entrees.forEach(entree => {
      if (!entree.isIntersecting) return;
      entree.target.classList.add("visible");
      observateur.unobserve(entree.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elementsANePasMasquer.forEach(element => observateurApparition.observe(element));
}

/* Suit les sections presentes : leur absence n'empeche pas le menu de fonctionner. */
if (menu && "IntersectionObserver" in window) {
  const sections = document.querySelectorAll("main section[id]");
  const observateurSections = new IntersectionObserver(entrees => {
    entrees.forEach(entree => {
      if (!entree.isIntersecting) return;

      menu.querySelectorAll("a").forEach(lien => {
        const correspond = lien.getAttribute("href") === `#${entree.target.id}`;
        lien.classList.toggle("actif", correspond);
        if (correspond) {
          lien.setAttribute("aria-current", "location");
        } else {
          lien.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-90px 0px -65% 0px" });

  sections.forEach(section => observateurSections.observe(section));
}

/* Image de secours uniquement pour les images de contenu, jamais pour le logo. */
const IMAGE_SECOURS =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23a9cdb5'/%3E%3C/svg%3E";

document.querySelectorAll(".cadre img").forEach(img => {
  img.addEventListener("error", () => {
    if (img.src !== IMAGE_SECOURS) img.src = IMAGE_SECOURS;
  }, { once: true });
});

/*
 * Erreurs accessibles par champ. La validation HTML native continue de
 * fonctionner sans JavaScript; les messages ci-dessous la completent.
 */
const formulaire = document.getElementById("formulaire");
if (formulaire) {
  const messageErreur = champ => {
    if (champ.validity.valueMissing) return "Ce champ est obligatoire.";
    if (champ.validity.typeMismatch) return "Veuillez saisir une adresse email valide.";
    if (champ.id === "depart" && champ.validity.rangeUnderflow) {
      return "La date de départ doit être après la date d'arrivée.";
    }
    if (champ.validity.rangeUnderflow) return `La valeur doit etre au moins egale a ${champ.min}.`;
    if (champ.validity.rangeOverflow) return `La valeur ne peut pas depasser ${champ.max}.`;
    return "Veuillez verifier cette information.";
  };

  formulaire.addEventListener("invalid", evenement => {
    const champ = evenement.target;
    const erreur = document.getElementById(`erreur-${champ.id}`);
    if (erreur) erreur.textContent = messageErreur(champ);
    champ.setAttribute("aria-invalid", "true");
  }, true);

  formulaire.addEventListener("input", evenement => {
    const champ = evenement.target;
    if (!(champ instanceof HTMLInputElement || champ instanceof HTMLTextAreaElement || champ instanceof HTMLSelectElement)) {
      return;
    }

    const erreur = document.getElementById(`erreur-${champ.id}`);
    if (erreur && champ.validity.valid) {
      erreur.textContent = "";
      champ.removeAttribute("aria-invalid");
    }
  });

  const arrivee = document.getElementById("arrivee");
  const depart = document.getElementById("depart");
  if (arrivee && depart) {
    function actualiserDateMinimum() {
      if (!arrivee.value) {
        depart.removeAttribute("min");
        return;
      }

      const lendemain = new Date(`${arrivee.value}T12:00:00`);
      lendemain.setDate(lendemain.getDate() + 1);
      depart.min = `${lendemain.getFullYear()}-${String(lendemain.getMonth() + 1).padStart(2, "0")}-${String(lendemain.getDate()).padStart(2, "0")}`;
      if (depart.value && depart.value < depart.min) {
        depart.value = "";
        const erreurDepart = document.getElementById("erreur-depart");
        if (erreurDepart) erreurDepart.textContent = "";
        depart.removeAttribute("aria-invalid");
      }
    }

    arrivee.addEventListener("change", actualiserDateMinimum);
    actualiserDateMinimum();
  }
}

/* Mise a jour facultative de l'annee : le reste du site marche sans cet element. */
const annee = document.getElementById("annee");
if (annee) annee.textContent = new Date().getFullYear();
