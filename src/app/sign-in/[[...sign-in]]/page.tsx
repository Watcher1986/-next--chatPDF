import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xl font-bold tracking-widest uppercase leading-none select-none'>
      <SignIn />
    </div>
  );
}
