import { CircleQuestionMark } from 'lucide-react'
import React from 'react'

const ProfileHead = () => {
  return (
    <div className='w-full'>
      <div className="w-full flex items-center justify-between">
        <h2 className='md:text-[1.2vw] text-[2.5vh] text-zinc-600 dark:text-zinc-200 font-semibold'>Profile</h2>

        <CircleQuestionMark size={20} className='text-zinc-600 dark:text-zinc-200'/>
      </div>
    </div>
  )
}

export default ProfileHead