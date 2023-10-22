import React from 'react';
import { Button } from './ui/button';

type Props = {
  title: string;
  bodyText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const Modal = ({ title, bodyText, onConfirm, onCancel }: Props) => {
  const handleOuterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      onClick={handleOuterClick}
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-full bg-slate-500 bg-opacity-50 z-50 flex items-center'
    >
      <dialog className='block w-96 rounded-lg shadow-lg p-4 bg-slate-100'>
        <h3 className='text-xl font-semibold tracking-wide mb-4'>{title}</h3>
        <p>{bodyText}</p>
        <div className='mt-5 flex float-right gap-5'>
          <Button autoFocus onClick={onCancel} className='hover:bg-gray-700'>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant='outline'
            className='hover:text-slate-400'
          >
            Confirm
          </Button>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
