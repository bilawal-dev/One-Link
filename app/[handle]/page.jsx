"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';

const HandlePage = ({ params }) => {
    const { handle } = React.use(params);

    const [bitTree, setBitTree] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBitTree() {
            const response = await fetch(`/api/${handle}`);

            const data = await response.json();

            if (data.success === true) {
                setBitTree(data.bitTree);
            }
            else {
                setBitTree(false)
            }

            setLoading(false);
        }

        fetchBitTree();
    }, [])

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
        <section className="overflow-hidden bg-gradient-to-tr from-pink-200 via-yellow-400 to-sky-400 px-5 md:px-16 pt-5 md:pt-10 w-full h-screen flex flex-col items-center justify-between gap-5">
            {/* If The bitTree Exists */}
            {bitTree && (
                <div className="photo flex flex-col justify-center items-center gap-3 bg-white/30 p-5 rounded-md">
                    <img src={`data:${bitTree.pic.contentType};base64,${Buffer.from(bitTree.pic.data).toString('base64')}`} alt="Profile Image" className='rounded-full h-24 w-24 object-cover border-2 border-white' />
                    <span className="font-bold text-xl">@ {bitTree.handle}</span>
                    <span className="desc sm:w-96 text-center font-mono">{bitTree.desc}</span>
                    <div className="links flex flex-col gap-3 mt-3">
                        {bitTree.links.map((item, index) => {
                            return (
                                <a key={index} href={item.link} target='_blank'>
                                    <div className="bg-purple-100 bg-opacity-80 backdrop-blur-lg py-4 px-2 min-w-96 font-mono flex justify-center shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-orange-100">{item.linktext}</div>
                                </a>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Loading State To Be Displayed Until We Have Fetched */}
            {loading && <Loading />}

            {/* If The bitTree Doesn't Exists */}
            {(!bitTree && !loading) && (
                <div className="w-full h-screen text-center">
                    <h1 className="text-6xl font-bold text-gray-800">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
                    <p className="text-gray-600 mt-2">The page you are looking for doesn&apos;t exist or has been moved.</p>
                    <div className="my-8">
                        <Image src="/404.png" alt="404 Image" width={400} height={300} className="mx-auto" />
                    </div>
                    <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-300">Go to Homepage</Link>
                </div>
            )}
        </section>
    )
}

export default HandlePage