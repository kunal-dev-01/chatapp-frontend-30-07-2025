import React from 'react'
import dynamic from 'next/dynamic'

const UserLayout = dynamic(() => import('./UserLayout'), {
  ssr: false,
})

const AllUsers = () => {
  return (
    <div className='w-full flex flex-col items-center overflow-y-scroll hide-scrollbar'>
      <div className="w-full">
        <UserLayout />
      </div>
    </div>
  )
}

export default AllUsers