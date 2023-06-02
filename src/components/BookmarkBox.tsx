import { LinkType } from '../pages/Main';

type Props = {
  link: LinkType;
  url: string;
  removeCard: (id: string) => void;
};
//
function BookmarkBox({ link, url, removeCard }: Props) {
  return (
    <div className="relative space-y-2 flex flex-col w-[calc((100%/4)-20px)] mx-auto sm:mx-0 sm:w-[calc((100%/6)-20px)] min-w-[60px] h-max">
      <svg
        onClick={() => removeCard(link.id.toString())}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        className="w-4 h-4 stroke-white absolute top-1 -right-1 cursor-pointer hover:scale-110 transition-[scale]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <a
        href={url}
        target="_blank"
        className="folder w-full h-[60px] shadow-md border border-gray-800 hover:border-gray-700 rounded-lg flex items-center justify-center"
      >
        <img
          src={`https://www.google.com/s2/favicons?sz=32&domain_url=${link.url}`}
          alt="fav"
          className=""
        />
      </a>
      <p className="text-[13px] text-center text-white">{link.title}</p>
    </div>
  );
}

export default BookmarkBox;
