import { Plus } from 'lucide-react'
import React from 'react'

const MessageBar = () => {
  return (
    <div className='w-full absolute bottom-0 md:h-[3.5vw] bg-transparent flex items-center justify-center  md:px-[1vw] px-[1vh] '>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full backdrop-blur-2xl relative px-1 py-0.5">
            <input type="text" placeholder='Send message...' className='w-full md:pl-[6vw] md:pr-[1vw] md:py-[.4vw] md:text-[1vw] text-zinc-700 dark:text-zinc-200 outline-none rounded-full' />

            <div className="px-2 py-1.5 absolute top-[10%] left-2 bg-zinc-300 rounded-full">
                <Plus size={25}/>
            </div>
        </div>
    </div>
  )
}

export default MessageBar