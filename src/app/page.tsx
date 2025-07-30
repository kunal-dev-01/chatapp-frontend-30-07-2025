"use client"
import React from 'react'
import dynamic from 'next/dynamic';
import Skeleton from '@/components/Layouts/Skeleton';

const HomeNavbar = dynamic(() => import("@/components/Navbars/HomeNavbar/HomeNavbar"), {
  loading: () => <Skeleton width="w-full" height="md:h-[4vw] h-[7vh]" rounded="rounded-b-md" animation="shimmer" />,
});


const Home = () => {
  return (
    <main className='w-full h-screen'>
      <HomeNavbar/>
      <div className="w-full min-h-screen">

      </div>
    </main>
  )
}

export default Home