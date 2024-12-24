"use client"

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function HomePage() {

  const { data: session, status } = useSession();

  const router = useRouter();

  const [text, setText] = useState('');

  const [bitTreeExists, setBitTreeExists] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBitTree() {
      const response = await fetch(`/api/mybitTree/${session.user.id}`);

      const data = await response.json();

      if (data.success === true) {
        setBitTreeExists(true);
      }
      else {
        setBitTreeExists(false)
      }

      setLoading(false);
    }
    if (status === 'unauthenticated') {
      setLoading(false);
    }
    if (session?.user?.id) {
      fetchBitTree();
    }
  }, [status, session?.user?.id])

  function handleClick(event) {
    event.preventDefault();

    router.push(`/generate?handle=${text}`)
  }

  const Loading = () => {
    return (
      <div role="status">
        <svg aria-hidden="true" className="w-16 h-16 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <section className="bg-green-600 px-5 md:px-16 pt-40 md:pt-52 w-full min-h-screen flex gap-5 md:flex-row flex-col justify-between">

      <div className="md:w-2/3 flex flex-col gap-5 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Everything you are. In one, simple link in bio.</h1>
        <p className="text-md font-semibold tracking-wider font-mono">Join 50M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.</p>

        {loading && <Loading />}

        {(!loading && bitTreeExists) && (
          <Link href={'/myhandle'} className='text-center bg-green-200 text-black py-4 px-6 text-md font-semibold tracking-wider rounded-full'>My LinkTree</Link>
        )}

        {(!loading && !bitTreeExists) && (
          <form onSubmit={handleClick} className="flex md:flex-row flex-col gap-3 mt-5">
            <input type="text" required value={text} onChange={(event) => { setText(event.target.value) }} name="handle" placeholder='Enter Your Handle' className="rounded-lg p-3 text-gray-500 tracking-wider border-none outline-none" />
            <button className='bg-pink-200 text-black py-4 px-6 text-md font-semibold tracking-wider rounded-full'>Claim Your Linktree</button>
          </form>
        )}
      </div>

      <div className='md:w-1/3'>
        <Image src="/HERO_IMAGE.avif" alt="Hero_Image" width={200} height={200} className="w-full rounded-3xl" />
      </div>
    </section >
  );
}

export default HomePage;