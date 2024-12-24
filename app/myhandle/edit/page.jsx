"use client"

import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiX } from 'react-icons/fi';

const MyHandle = () => {

  const { data: session, status } = useSession();

  const [linkTreeExists, setLinkTreeExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [handle, setHandle] = useState('');
  const [links, setLinks] = useState([{ link: "", linktext: "" }]);
  const [pic, setPic] = useState(null);
  const [desc, setDesc] = useState("");
  const bitTreeMongoID = useRef('');
  const [linkAddError, setLinkAddError] = useState(false);
  const [handleError, setHandleError] = useState(false);

  async function fetchUserBitTree() {
    const response = await fetch(`/api/edit/${session.user.id}`)

    const data = await response.json();

    if (data.success) {
      toast.success(data.message, {
        style: {
          width: '300px',
        },
        position: 'top-right'
      })

      const { bitTree } = data;

      setLinkTreeExists(true);
      setHandle(bitTree.handle);
      setLinks(bitTree.links);
      setDesc(bitTree.desc);
      setPic(bitTree.pic);
      bitTreeMongoID.current = bitTree._id;
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserBitTree();
    }
  }, [session?.user?.id])

  useEffect(() => {
    async function isHandleAvailable() {
      const response = await fetch(`/api/edit/handle/${handle}`)

      const data = await response.json();

      if (data.handleExists) {
        toast.error(data.message, {
          style: {
            width: '300px',
          },
          position: 'top-right'
        })

        setHandleError(true);
      }
      else {
        setHandleError(false);
      }
    }

    isHandleAvailable();

    if (handle === '') {
      setHandleError(false);
    }

    //Adding Session.user.id As Dependency Because It Is Not Immediately Avaialabe, ANd Changes From Loading To Other State
  }, [handle]);

  const handleLinkChange = (index, link, linktext) => {
    setLinks((prevLinks) => {
      return prevLinks.map((prevLink, prevLinkIndex) => {
        if (prevLinkIndex === index) {
          return { link, linktext }
        }
        else {
          return prevLink
        }
      })
    })
  }

  const addLink = () => {
    const size = links.length;

    if (links[size - 1].link === '' || links[size - 1].linktext === '') {
      setLinkAddError(true);
      return;
    }

    setLinkAddError(false);

    setLinks((prevLinks) => [...prevLinks, { link: '', linktext: '' }]);
  }

  const removeLink = (index) => {
    const size = links.length;

    if (size === 1) {
      return;
    }

    if (index === size - 1 && linkAddError) {
      setLinkAddError(false);
    }

    setLinks((prevLinks) => {
      return prevLinks.filter((prevLink, prevLinkIndex) => {
        if (prevLinkIndex !== index) {
          return prevLink
        }
      })
    })
  }


  const submitLinks = async (event) => {
    event.preventDefault();

    const data = new FormData();

    let isNewPic = true;
    if (pic?.data?.type === 'Buffer') {
      isNewPic = false;
    }

    data.append('handle', handle);
    data.append('links', JSON.stringify(links)); //JSON.stringify(links) converts the links array into a JSON string. This is necessary because FormData can only send simple data types like strings, numbers, and files.
    data.append('isNewPic', isNewPic);

    if (isNewPic) { //Checking if it is the Default (old) image from db
      data.append('pic', pic); //Form Data Can Handle File Type (pic) , So no need to stringify
    }
    else {
      data.append('pic', JSON.stringify(pic)); //We need to stringify it, because its an object, and in form data we need to stringify Arrays And Objects.
    }

    data.append('desc', desc);
    data.append('userId', session.user.id)

    const response = await fetch(`/api/edit/submit/${bitTreeMongoID.current}`, {
      method: 'PATCH',
      body: data,
    });

    const result = await response.json();

    if (result.success === true) {
      toast.success(result.message)

      fetchUserBitTree();
    }
    else {
      toast.error(result.message, {
        style: {
          width: '300px', // Adjust this value to your desired width
        },
        position: 'top-right'
      })
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling
    });
  }

  function Loading() {
    return (
      <div role="status">
        <svg aria-hidden="true" className="absolute top-[45%] left-[50%] w-16 h-16 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-tr from-pink-200 via-yellow-400 to-sky-400 min-h-screen px-5 md:px-16 pt-20 md:pt-40">
      {(status === 'loading') && <Loading />}

      {/* If User Is Not Authenticated */}
      {status === 'unauthenticated' && (
        <div className='flex flex-col items-center gap-6 pt-20'>
          <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-4 rounded-xl shadow-2xl transform rotate-2">
            <strong className="text-2xl font-extrabold">Access Denied!</strong>
            <div className="text-center">
              Please <span className='font-bold underline'>log in</span> and create your linkTree to view this page.
            </div>
          </div>
          <button onClick={() => signIn()} className='font-bold bg-white text-pink-500 py-3 px-10 rounded-full shadow-lg hover:bg-pink-500 hover:text-white hover:shadow-2xl transform hover:scale-105 transition duration-300'>
            Log In
          </button>
        </div>
      )}

      {(status === 'authenticated' && !isLoading && linkTreeExists) && (
        <div className='pt-20 max-sm:pb-10 grid gap-32 max-sm:gap-10 grid-cols-2 max-sm:grid-cols-1'>
          <div className="col1 flex flex-col justify-center items-center text-gray-900">

            <form onSubmit={submitLinks} className='w-full flex flex-col gap-5'>
              <h1 className='font-bold text-4xl'>Edit your BitTree</h1>

              <div className="item">
                <h2 className='font-semibold text-2xl'>Step 1: Edit your Handle</h2>
                <div>
                  <input required value={handle || ""} onChange={(e) => { setHandle(e.target.value) }} className={`px-4 py-2 my-2 font-bold ${handleError ? 'text-red-500' : ''} focus:outline-pink-500 rounded-full`} type="text" placeholder='Choose a Handle' />
                  {handleError && <p className='text-red-500 font-mono'>*Please Choose Another Handle</p>}
                </div>
              </div>

              <div className="item">
                <h2 className='font-semibold text-2xl'>Step 2: Edit Links</h2>
                {links && links.map((item, index) => {
                  return (
                    <div key={index} className='flex items-center max-sm:gap-5'>
                      <div className='flex max-sm:flex-col'>
                        <input disabled={handleError} required value={item.linktext || ""} onChange={e => { handleLinkChange(index, item.link, e.target.value) }} className={`px-4 py-2 my-2 ${linkAddError && links.length - 1 === index ? 'placeholder-red-500' : ''} focus:outline-pink-500 rounded-full`} type="text" placeholder='Enter Platform Name' />
                        <input disabled={handleError} required value={item.link || ""} onChange={e => { handleLinkChange(index, e.target.value, item.linktext) }} className={`px-4 py-2 sm:mx-2 my-2 ${linkAddError && links.length - 1 === index ? 'placeholder-red-500' : ''} focus:outline-pink-500 rounded-full`} type="text" placeholder='Enter Platform Link' />
                      </div>
                      {links.length > 1 && (<FiX onClick={() => { removeLink(index) }} className='text-xl font-bold p-2 box-content rounded-full bg-slate-100 cursor-pointer' />)}
                    </div>
                  )
                })}
                {linkAddError && <p className='text-red-500 font-mono'>*Please Enter Platform Name And Links</p>}
                <button disabled={handleError} type='button' onClick={() => addLink()} className='disabled:opacity-60 p-5 py-2 my-2 bg-slate-900 text-white font-bold rounded-3xl'>+ Add Link</button>
              </div>

              <div className="item">
                <h2 className='font-semibold text-2xl'>Step 3: Edit Picture or Description</h2>
                <div className='flex flex-col'>
                  <input disabled={handleError} type='file' name='pic' onChange={(e) => { setPic(e.target.files[0]) }} className='px-4 py-2 my-2 border-none outline-none bg-slate-50 rounded-full' />
                  <input disabled={handleError} value={desc || ""} required onChange={e => { setDesc(e.target.value) }} className='px-4 py-2  my-2 focus:outline-pink-500 rounded-full' type="text" placeholder='Enter Description' />
                  <button disabled={handleError} type='submit' className='disabled:opacity-60 p-5 py-2 w-fit my-3 bg-slate-900 text-white font-bold rounded-3xl'>Update your BitTree</button>
                </div>
              </div>
            </form>
          </div>

          <div className="col2 w-full h-screen max-sm:h-[50vh] max-sm:rounded-lg">
            <img className='w-full h-full rounded-2xl' src="/GENERATE_IMAGE.jpg" alt="Generate your links" />
            <ToastContainer />
          </div>
        </div>
      )}
    </section >
  )
}

export default MyHandle