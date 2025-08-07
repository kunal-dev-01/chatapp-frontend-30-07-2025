import React from 'react'
import dynamic from 'next/dynamic'

const UserLayout = dynamic(() => import('./UserLayout'), {
  ssr: false,
})

const AllUsers = () => {
  return (
    <div className='w-full md:h-[60vh] h-[calc(100vh-20vh)] flex flex-col items-center overflow-y-scroll scrollbar-hide pb-5'>

        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
        <UserLayout />
    </div>
  )
}

export default AllUsers