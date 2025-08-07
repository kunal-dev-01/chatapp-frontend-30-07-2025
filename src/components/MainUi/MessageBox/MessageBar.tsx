import { Plus, SendHorizonal, Smile } from 'lucide-react'
import React from 'react'
import dynamic from 'next/dynamic'

const EmojiPicker = dynamic(()=> import("../../EmojiPicker/EmojiPicker"),{
    ssr:false
})

const MessageBar = () => {
  return (
    <div className='w-full absolute bottom-0 md:h-[3.5vw] bg-transparent flex items-center justify-center  md:px-[1vw] px-[1vh] '>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full backdrop-blur-2xl relative px-1 py-0.5 flex items-center ">
            <input type="text" placeholder='Send message...' className='w-full md:pl-[5.5vw] md:pr-[3vw] md:py-[.4vw] md:text-[1vw] text-zinc-700 dark:text-zinc-200 outline-none rounded-full' />

            <div className="p-2 absolute top-[10%] left-2 hover:bg-zinc-300 rounded-full">
                <Plus size={25}/>
            </div>

            <div className="p-2 absolute top-[10%] left-13 hover:bg-zinc-300 rounded-full">
                <Smile size={25}/>
            </div>

            <div className="p-2 absolute top-[10%] right-2 hover:bg-zinc-300 rounded-full">
                <SendHorizonal size={25}/>
            </div>
        </div>
    </div>
  )
}

export default MessageBar