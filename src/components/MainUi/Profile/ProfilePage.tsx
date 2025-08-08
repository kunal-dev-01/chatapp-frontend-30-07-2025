import React from 'react'
import dynamic from 'next/dynamic'
import Skeleton from '@/components/Layouts/Skeleton'

const ProfileHead = dynamic(()=> import("./ProfileHead"),{
    ssr:false,
    loading:() => (
        <Skeleton
        width='w-full'
        height='h-12'
        animation='shimmer'
        rounded='rounded-lg'
        />
    )
})

const ProfilePage = () => {
  return (
    <div className='w-[100vw] md:w-[30vw] h-[calc(100vh-7vh)] md:h-[75vh] md:rounded-l-2xl md:p-[1vw] p-[1vh] bg-zinc-200 md:shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.1),inset_0_-8px_8px_-8px_rgba(0,0,0,0.1),inset_8px_0_8px_-8px_rgba(0,0,0,0.1)] md:border-r-2 md:border-zinc-300'>

      <div className="w-full">
        <ProfileHead/>
      </div>
      
    </div>
  )
}

export default ProfilePage