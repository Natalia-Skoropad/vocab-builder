export type AppUser = {
  id?: string;
  name: string;
  email: string;
};

export type BackendAuthResponse = {
  name: string;
  email: string;
  token: string;
};

export type BackendCurrentUserResponse = {
  _id: string;
  name: string;
  email: string;
  token: string;
};
