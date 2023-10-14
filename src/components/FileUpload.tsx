'use client';
import { Inbox } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        console.log(data);
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className:
            'border-2 border-dashed border-gray-300 py-8 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        <>
          <Inbox className='w-10 h-10 text-blue-500' />
          <p className='mt-2 text-slate-400 text-sm'>Drop PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
