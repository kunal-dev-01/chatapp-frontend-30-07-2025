import React from 'react'
import dynamic from 'next/dynamic'
import Skeleton from '@/components/Layouts/Skeleton'

const ChatUserSearch = dynamic(() => import('@/components/Chats/ChatUserSearch'), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="w-full"
      height="h-12"
      rounded="rounded-md"
      animation="shimmer"
    />
  ),
})

const ChatUsers = () => {
  return (
    <div className='w-full md:w-[30vw] h-screen md:h-[75vh] rounded-l-xl md:p-[1vw] p-[1vh] bg-zinc-100'>
        <div className="w-full md:w-[30vw]">
            <ChatUserSearch />
        </div>
    </div>
  )
}

export default ChatUsers