import { LinkType } from '../App';

type Props = {
  link: LinkType;
  url: string;
};

function BookmarkBox({ link, url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      className="w-max space-y-2 flex flex-col items-center h-max"
    >
      <div className="folder w-[60px] h-[60px] shadow-md border border-gray-800 hover:border-gray-700 rounded-lg flex items-center justify-center">
        <img
          src={`https://www.google.com/s2/favicons?sz=32&domain_url=${link.url}`}
          alt="fav"
          className=""
        />
      </div>
      <p className="text-[13px] text-center text-white">{link.title}</p>
    </a>
  );
}

export default BookmarkBox;
