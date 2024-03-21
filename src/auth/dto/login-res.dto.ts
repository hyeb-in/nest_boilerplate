export type LoginTokenDto = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type LoginResDto = {
  id: string;
  name: string;
  email: string;
};
