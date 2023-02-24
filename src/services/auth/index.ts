type RawAuth = {
  access_token: string;
  device_id: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

type Auth = {
  accessToken: string;
  expires: number;
};

export async function getAccessToken(): Promise<string> {
  let auth: Auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || Date.now() >= auth.expires) {
    auth = await requestBasicAccess();
    localStorage.setItem("auth", JSON.stringify(auth));
  }

  return auth.accessToken;
}

async function requestBasicAccess() {
  const rawAuth = await fetch(
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
    .then((res) => res.json() as Promise<RawAuth>);
  return transformAuth(rawAuth);
}

function transformAuth(rawAuth: RawAuth): Auth {
  return {
    accessToken: rawAuth.access_token,
    expires: Date.now() + rawAuth.expires_in * 1000,
  };
}
