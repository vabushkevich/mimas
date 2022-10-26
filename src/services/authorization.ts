type AuthData = {
  "access_token": string;
  "token_type": string;
  "device_id": string;
  "expires_in": number;
  "scope": string;
};

export async function getAccessToken(): Promise<string> {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth && Date.now() < auth.expires) {
    return auth.accessToken;
  }

  const authData = await requestBasicAccess();
  localStorage.setItem("auth", JSON.stringify({
    accessToken: authData.access_token,
    expires: Date.now() + authData.expires_in,
  }));

  return authData.access_token;
}

async function requestBasicAccess(): Promise<AuthData> {
  return await fetch(
    "https://www.reddit.com/api/v1/access_token",
    {
      method: "POST",
      body: new URLSearchParams([
        ["grant_type", "https://oauth.reddit.com/grants/installed_client"],
        ["device_id", "DO_NOT_TRACK_THIS_DEVICE"],
      ]),
      headers: {
        "Authorization": "Basic CREDENTIALS",
      },
    }
  )
    .then((res) => res.json());
}
