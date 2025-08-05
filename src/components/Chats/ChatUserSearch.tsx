import React from 'react'
import { useAppDispatch,useAppSelector } from '@/Redux/Hooks/reduxHook'
import { logoutUser } from '@/Redux/UserServices/Slices/auth.slice'

const ChatUserSearch = () => {

  const dispatch = useAppDispatch()

  const handleLogout = async() => {
    await dispatch(logoutUser()).unwrap()
  }



  return (
    <div onClick={handleLogout} className=''>
      Logout
    </div>
  )
}

export default ChatUserSearch