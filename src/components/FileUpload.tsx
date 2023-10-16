'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Inbox, Loader2 } from 'lucide-react';
import { uploadToS3 } from '@/lib/s3';

const FileUpload = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        toast.error('File size is too big');
        return;
      }

      try {
        setLoading(true);

        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error('Something went wrong');
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success('Chat created successfully!');
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error('Error creating chat');
            console.error(err);
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
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
        {loading || isLoading ? (
          <>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
            <p className='mt-2 text-sm text-slate-400'>Spilling to GPT...</p>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-blue-500' />
            <p className='mt-2 text-slate-400 text-sm'>Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
