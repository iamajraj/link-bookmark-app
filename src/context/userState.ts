import { atom, selector } from 'recoil';

type User = {
  uid: string | null;
  displayName: string | null;
  photoUrl: string | null;
  email: string | null;
};

interface UserState {
  user: User;
  isLoggedIn: boolean;
}

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    user: {
      displayName: null,
      email: null,
      photoUrl: null,
      uid: null,
    },
    isLoggedIn: false,
  },
});

export const logInState = selector({
  key: 'logInState',
  get: ({ get }) => {
    return get(userState).isLoggedIn;
  },
});
