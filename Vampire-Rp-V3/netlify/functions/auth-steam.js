exports.handler = async () => {
  const returnUrl = "https://vampire-rp-v3.netlify.app/.netlify/functions/auth-callback";
  const realm = "https://vampire-rp-v3.netlify.app";

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://steamcommunity.com/openid/login?${params.toString()}`
    }
  };
};