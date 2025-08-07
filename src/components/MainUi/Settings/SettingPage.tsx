import React from 'react'
import dynamic from 'next/dynamic'
import Skeleton from '@/components/Layouts/Skeleton'

const SettingHead = dynamic(()=> import("./SettingHead"),{
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

const AllSettings = dynamic(()=> import("./AllSettings"),{
    ssr:false,
    loading:() => (
        <Skeleton
        width='w-full'
        height='md:h-[50vh] h-[80vh]'
        animation='shimmer'
        rounded='rounded-lg'
        className='mt-2'
        />
    )
})

const SettingPage = () => {
  return (
    <div className='w-[100vw] md:w-[30vw] h-[calc(100vh-7vh)] md:h-[75vh] md:rounded-l-2xl md:p-[1vw] p-[1vh] bg-zinc-200 md:shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.1),inset_0_-8px_8px_-8px_rgba(0,0,0,0.1),inset_8px_0_8px_-8px_rgba(0,0,0,0.1)] md:border-r-2 md:border-zinc-300'>

        <div className="w-full">
          <SettingHead/>
        </div>

        <div className="w-full md:h-[62vh] h-[calc(100vh-21vh)] md:mt-[1.6vw] mt-[2vh] rounded-lg">
          <AllSettings/>
        </div>

    </div>
  )
}

export default SettingPage