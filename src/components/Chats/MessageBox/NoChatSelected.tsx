import { MessageCircle } from 'lucide-react'
import React from 'react'

const NoChatSelected = () => {
  return (
    <div className='w-[100vw] h-[calc(100vh-7vh)] md:w-[calc(100vw-33.3vw)] md:h-[75vh] flex flex-col items-center justify-center'>
        <MessageCircle className='text-zinc-300 text-[4vh] md:size-[20vw]'/>
        <h2 className='text-prime text-[3vh] md:text-[1.5vw] font-second'>Select a chat to start messaging</h2>
    </div>
  )
}

export default NoChatSelected