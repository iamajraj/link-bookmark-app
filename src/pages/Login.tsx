import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../service/firebase';
import { userState } from '../context/userState';
import { useRecoilState } from 'recoil';

type Props = {};

function Login({}: Props) {
  const [user, setUser] = useRecoilState(userState);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    const signedIn = await signInWithPopup(auth, provider);
    if (signedIn.user.uid) {
      setUser((state) => {
        return {
          user: {
            displayName: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
            photoUrl: auth.currentUser?.photoURL,
            uid: auth.currentUser?.uid,
          },
          isLoggedIn: true,
        };
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-t from-slate-900 to-gray-900">
      <div
        onClick={signIn}
        className="bg-white flex items-center gap-2 rounded-lg px-4 hover:cursor-pointer"
      >
        <img
          src="https://www.google.com/s2/favicons?sz=64&domain_url=www.google.com"
          className="rounded-full w-[40px] h-[40px]"
          alt=""
        />
        <p>Login with Google</p>
      </div>
    </div>
  );
}

export default Login;
