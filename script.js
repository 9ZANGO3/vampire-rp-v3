const authButton = document.getElementById("auth-button");

function updateAuthButton() {
  const isLoggedIn = localStorage.getItem("steamLoggedIn") === "true";
  const avatar =
    localStorage.getItem("steamAvatar") ||
    "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
  const name = localStorage.getItem("steamName") || "Joueur";

  if (isLoggedIn) {
    // Affiche la photo de profil
    authButton.innerHTML = `
      <button class="profile-btn" id="profile-btn" title="${name} — Se déconnecter" aria-label="Profil Steam - Se déconnecter">
        <img src="${avatar}" alt="Photo de profil Steam">
      </button>
    `;

    document.getElementById("profile-btn").addEventListener("click", () => {
      if (confirm("Voulez-vous vous déconnecter ?")) {
        localStorage.removeItem("steamLoggedIn");
        localStorage.removeItem("steamAvatar");
        localStorage.removeItem("steamName");
        localStorage.removeItem("steamId");
        updateAuthButton();
      }
    });
  } else {
    // Affiche le bouton Se connecter
    authButton.innerHTML = `
      <button class="login-btn" id="login-btn">
        Se connecter
      </button>
    `;

    document.getElementById("login-btn").addEventListener("click", () => {
      // Redirige vers la fonction Netlify qui envoie vers Steam
      window.location.href = "/.netlify/functions/auth-steam";
    });
  }
}

// ===== Gestion du retour de Steam =====
function handleSteamCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const steamid = urlParams.get("steamid");
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");

  if (steamid && name && avatar) {
    localStorage.setItem("steamLoggedIn", "true");
    localStorage.setItem("steamId", steamid);
    localStorage.setItem("steamName", name);
    localStorage.setItem("steamAvatar", avatar);

    // Nettoie l’URL pour enlever les paramètres
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Lance au chargement
handleSteamCallback();
updateAuthButton();

// ===== Menu mobile (hamburger) =====
const navToggle = document.getElementById("nav-toggle");
const mobileNav = document.getElementById("mobile-nav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
  });
}