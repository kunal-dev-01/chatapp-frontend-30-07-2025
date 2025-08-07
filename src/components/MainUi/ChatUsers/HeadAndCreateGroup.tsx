import React from 'react'
import { EllipsisVertical,  Plus } from 'lucide-react'
import { useRipple } from '@/components/Layouts/UseRipple'

const HeadAndCreateGroup = () => {

    const plusRef = useRipple<HTMLDivElement>();
    const menuRef = useRipple<HTMLDivElement>();


  return (
    <div className='w-full flex items-center justify-between'>
        <h1 className='md:text-[1.2vw] text-[2.5vh] text-zinc-500 dark:text-zinc-200 font-semibold'>Chats</h1>

        <div className="flex items-center gap-1">
            <div ref={plusRef} className="p-2 rounded-lg hover:bg-zinc-300 transition-colors duration-200 cursor-pointer">
                <Plus size={25}/>
            </div>

            <div ref={menuRef} className="p-2 rounded-lg hover:bg-zinc-300 transition-colors duration-200 cursor-pointer">
                <EllipsisVertical size={25}/>
            </div>
        </div>
    </div>
  )
}

export default HeadAndCreateGroup