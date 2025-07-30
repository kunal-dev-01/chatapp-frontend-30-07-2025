import React from 'react'
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'

const NavLogo = dynamic(() => import('./NavLogo'), { ssr: false ,loading: () => <Skeleton width="md:w-[6vw] w-[10vh]" height="md:h-[3.4vw] h-[5.5vh]" rounded="rounded-lg" animation="shimmer" />});

const HomeNavbar = () => {
  return (
    <nav className='w-full md:h-[4vw] h-[7vh] md:px-[10vw] px-[1vh] flex items-center justify-between'>
      <div className="w-full">
        <NavLogo/>
      </div>
    </nav>
  )
}

export default HomeNavbar