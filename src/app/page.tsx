"use client"
import React from 'react'
import dynamic from 'next/dynamic';
import Skeleton from '@/components/Layouts/Skeleton';

const HomeNavbar = dynamic(() => import("@/components/Navbars/HomeNavbar/HomeNavbar"), {
  loading: () => <Skeleton width="w-full" height="md:h-[4vw] h-[7vh]" rounded="rounded-b-md" animation="shimmer" />,
});

const FirstArea = dynamic(() => import("@/components/Home/FirstArea/FirstArea"), {
  loading: () => <Skeleton width="w-full" height="md:h-[80vh] h-[60vh]" rounded="rounded-md" animation="shimmer" className='mt-2'/>,
});

const Home = () => {
  return (
    <main className='w-full h-screen'>
      <HomeNavbar/>
      <div className="w-full min-h-screen md:px-[10vw] px-[1vh] mt-2">
        <FirstArea/>
      </div>
    </main>
  )
}

export default Home