import React from 'react';

type Props = {
  title: string;
  placeholder?: string;
  span?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

function InputField({ onChange, name, placeholder, title, span }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white">
        {title}{' '}
        {span && <span className="text-[13px] text-gray-400">{span}</span>}
      </label>
      <input
        onChange={onChange}
        name={name}
        type="text"
        className="rounded-md py-2 px-2 outline-none border-none"
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputField;
