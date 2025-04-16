export const getLogin = async ({
  user,
  pass,
}: {
  user: string;
  pass: string;
}): Promise<{ status: number; sesion: { token: string; params: string } }> => {
  console.log("user", user, pass);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, sesion: { token: "1234567890", params: "" } });
    }, 2000);
  });
};

export const getCheckToken = async ({
  token,
}: {
  token: string;
}): Promise<{ status: number; sesion: { token: string; params: string } }> => {
  console.log("token", token);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, sesion: { token: "1234567890", params: "" } });
    }, 2000);
  });
};
