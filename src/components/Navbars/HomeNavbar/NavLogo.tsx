import Link from 'next/link'
import React from 'react'

const NavLogo = () => {
  return (
    <div className='md:text-[2.5vw] text-[4vh] cursor-pointer '>
        <Link href="/" className='font-prime text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500'>Sova</Link>
    </div>
  )
}

export default NavLogo