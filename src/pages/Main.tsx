import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import Arrow from '../assets/arrow.png';
import InputField from '../components/InputField';
import BookmarkBox from '../components/BookmarkBox';
import { userState } from '../context/userState';
import { signOut } from 'firebase/auth';
import { auth, db } from '../service/firebase';
import {
  onSnapshot,
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const initialLink = [
  {
    id: '1',
    title: 'Youtube',
    url: 'www.youtube.com',
  },
  {
    id: '2',
    title: 'Google',
    url: 'www.google.com',
  },
];

export type LinkType = (typeof initialLink)[0];

function Main() {
  const [user, setUser] = useRecoilState(userState);
  const [links, setLinks] = useState(initialLink);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addData, setAddData] = useState({
    title: '',
    url: '',
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (user.user.uid) {
      setLoading(true);
      return onSnapshot(
        collection(db, 'users', user.user.uid, 'links'),
        (snapshot) => {
          if (snapshot.docs.length > 0) {
            let links_doc = [];
            snapshot.docs.forEach((doc) => {
              const data = doc.data() as LinkType;
              links_doc.push(data);
            });
            setLinks(links_doc);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      );
    }
  }, [user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (addData.title.trim() === '' || addData.url.trim() === '') return;

    setAdding(true);

    // locally
    // setLinks((prev) => {
    //   const updated_links = [
    //     ...prev,
    //     { ...addData, id: (links.length + 1).toString() },
    //   ];
    //   // setDataLocally(updated_links);
    //   return updated_links;
    // });

    const id = crypto.randomUUID();

    await setDoc(doc(db, 'users', user.user.uid, 'links', id), {
      id: id,
      title: addData.title,
      url: addData.url,
    });

    setAddData({
      title: '',
      url: '',
    });
    dialogRef.current?.close();
    setAdding(false);
  };

  const setDataLocally = (data: LinkType[]) => {
    localStorage.setItem('saved', JSON.stringify(data));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removeCard = async (id: string) => {
    setLinks((prev) => {
      const updated_links = prev.filter((val) => val.id !== id);
      // setDataLocally(updated_links);
      return updated_links;
    });

    await deleteDoc(doc(db, 'users', user.user.uid, 'links', id));
  };

  useEffect(() => {
    const local_links = localStorage.getItem('saved');
    if (!local_links) return;
    const previous_links = JSON.parse(local_links);
    if (!previous_links) return;
    if (Array.isArray(previous_links)) {
      setLinks(previous_links);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-tr from-gray-950 to-slate-800 flex items-center justify-center flex-col gap-10 py-10 px-5">
      <div className="flex items-center gap-4 w-full max-w-5xl justify-between">
        <div></div>
        <div className="flex items-center gap-4 relative">
          <h1 className="text-3xl text-white font-bold">Link Bookmark</h1>
          <div
            onClick={() => {
              dialogRef.current?.showModal();
            }}
            className="w-7 h-7 items-center justify-center flex rounded-full bg-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <img
            src={Arrow}
            alt="arrow"
            className="absolute w-12 invert right-6 rotate-[55deg] -top-10 sm:rotate-180 sm:-right-12 sm:-top-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <img
            src={user.user.photoUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
          <div>
            <p className="text-white text-[13px]">{user.user.displayName}</p>
            <p className="text-white text-[13px]">{user.user.email}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 stroke-white cursor-pointer"
            onClick={async () => {
              await signOut(auth);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-5xl h-full max-h-[600px] rounded-md bg-gradient-to-br from-gray-900 to-slate-950 p-4 md:p-5 overflow-y-scroll scrollbar">
        <div className="flex flex-wrap gap-6">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : (
            links.map((link, i) => {
              let url = link.url.startsWith('http')
                ? link.url
                : `http://${link.url}`;
              return (
                <BookmarkBox
                  removeCard={removeCard}
                  key={`${i}-${link.url}`}
                  link={link}
                  url={url}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Add new link */}
      <dialog
        ref={dialogRef}
        className="w-full max-w-[400px] z-[999] border-none bg-transparent"
      >
        <div className="w-full bg-gradient-to-tr from-slate-900 to-slate-900 p-5 pb-10 relative rounded-lg">
          <h1 className="text-white">Add New Link</h1>

          <div
            onClick={() => {
              dialogRef.current?.close();
            }}
            className="w-7 h-7 items-center justify-center flex rounded-full bg-white cursor-pointer absolute right-5 top-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <InputField
              title="Title"
              placeholder="e.g Youtube"
              onChange={onChange}
              name="title"
              value={addData.title}
            />
            <InputField
              title="Url"
              placeholder="e.g www.youtube.com"
              onChange={onChange}
              name="url"
              span="(www.example.com)"
              value={addData.url}
            />
            <button
              disabled={adding}
              className="bg-white rounded-full py-2 mt-5"
            >
              {adding ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Main;
