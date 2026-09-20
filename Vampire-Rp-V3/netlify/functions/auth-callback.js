const fetch = require("node-fetch"); // Netlify le gère déjà

exports.handler = async (event) => {
  const params = event.queryStringParameters;

  // 1. Vérification OpenID
  const verificationParams = new URLSearchParams({
    ...params,
    "openid.mode": "check_authentication"
  });

  const steamResponse = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verificationParams.toString()
  });

  const text = await steamResponse.text();

  if (!text.includes("is_valid:true")) {
    return {
      statusCode: 302,
      headers: { Location: "https://vampire-rp-v3.netlify.app/?error=steam" }
    };
  }

  // 2. Récupération du SteamID
  const claimedId = params["openid.claimed_id"];
  const steamId = claimedId.split("/").pop();

  // 3. Récupération du profil (pseudo + avatar)
  const apiKey = process.env.STEAM_API_KEY; // on va le mettre juste après
  const profileRes = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
  );
  const profileData = await profileRes.json();
  const player = profileData.response.players[0];

  // 4. On redirige vers le site avec les infos
  const redirectUrl = new URL("https://vampire-rp-v3.netlify.app/");
  redirectUrl.searchParams.set("steamid", steamId);
  redirectUrl.searchParams.set("name", player.personaname);
  redirectUrl.searchParams.set("avatar", player.avatarfull);

  return {
    statusCode: 302,
    headers: {
      Location: redirectUrl.toString()
    }
  };
};