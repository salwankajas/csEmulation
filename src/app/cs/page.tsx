// pages/index.js
'use client'
import { useState } from 'react';
import Link from 'next/link'


const Home = () => {
    // const [data, setData] = useState([]);

    const [id, setId] = useState('');

    return (
        <div className='flex flex-col'>
            <h1 className='text-center mb-4'>Enter ID</h1>
            <form className='flex flex-col space-y-6'>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value.replace(/\s/g, ''))}
                    required
                    className="border border-gray-300 p-2 rounded-md"
                    maxLength={22}
                    pattern="*\S.{21}"
                    placeholder="Enter ID"
                />
                <Link className='text-center'
                    href={{
                        pathname: '/cs/slots',
                        query: {
                            id:id
                        } // the data
                    }}
                >
                <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' type="submit">Submit</button>
                </Link>
            </form>
        </div>
    );
};

export default Home;
