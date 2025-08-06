import React from 'react'

const ChatIndex = () => {
  return (
    <div 
      className='w-[100vw] h-[calc(100vh-7vh)] md:w-[calc(100vw-33.3vw)] md:h-[75vh] md:rounded-r-xl bg-zinc-200 dark:bg-zinc-800'
      style={{
        boxShadow: window.innerWidth >= 768 ? 
          'inset 0 8px 8px -8px rgba(0,0,0,0.1), inset 0 -8px 8px -8px rgba(0,0,0,0.1), inset -8px 0 8px -8px rgba(0,0,0,0.1)' 
          : 'none'
      }}
    >
    </div>
  )
}

export default ChatIndex