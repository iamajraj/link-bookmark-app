import { FormEvent, useRef, useState } from 'react';
import Arrow from './assets/arrow.png';
import InputField from './components/InputField';
import BookmarkBox from './components/BookmarkBox';

const initialLink = [
  {
    title: 'Youtube',
    url: 'www.youtube.com',
  },
  {
    title: 'Google',
    url: 'www.google.com',
  },
];

export type LinkType = (typeof initialLink)[0];

function App() {
  const [links, setLinks] = useState(initialLink);
  const [addData, setAddData] = useState({
    title: '',
    url: '',
  });

  const dialogRef = useRef<HTMLDialogElement>(null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (addData.title.trim() === '' || addData.url.trim() === '') return;

    console.log(addData);
    setLinks((prev) => [...prev, { ...addData }]);
    dialogRef.current?.close();

    setAddData({
      title: '',
      url: '',
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-tr from-gray-950 to-slate-800 flex items-center justify-center flex-col gap-10 py-5 px-5">
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
          className="absolute w-12 invert rotate-180 -right-12 -top-8"
        />
      </div>
      <div className="w-full max-w-5xl h-[600px] rounded-md bg-gradient-to-br from-gray-900 to-slate-950 p-5 flex gap-4 flex-wrap overflow-y-scroll scrollbar">
        {links.map((link, i) => {
          let url = link.url.startsWith('http')
            ? link.url
            : `http://${link.url}`;
          return <BookmarkBox key={`${i}-${link.url}`} link={link} url={url} />;
        })}
      </div>

      {/* Add new link */}
      <dialog
        ref={dialogRef}
        className="w-full max-w-[400px] rounded-lg z-[999] border-none outline-none bg-gradient-to-tr from-gray-800 to-slate-800 p-5 pb-10 relative"
      >
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
          />
          <InputField
            title="Url"
            placeholder="e.g www.youtube.com"
            onChange={onChange}
            name="url"
            span="(www.example.com)"
          />
          <button className="bg-white rounded-full py-2 mt-5">Save</button>
        </form>
      </dialog>
    </div>
  );
}

export default App;
