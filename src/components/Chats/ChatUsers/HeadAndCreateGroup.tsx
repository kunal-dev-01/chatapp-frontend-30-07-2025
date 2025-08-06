import { LucideMenu, PlusSquareIcon } from 'lucide-react'
import { addRipple } from '@/components/Layouts/RippleEffect'
import React,{useEffect,useRef} from 'react'

const HeadAndCreateGroup = () => {

    const plusRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        if(plusRef.current){
            addRipple(plusRef.current)
        }
    },[])

    useEffect(()=>{
        if(menuRef.current){
            addRipple(menuRef.current)
        }
    },[])

  return (
    <div className='w-full flex items-center justify-between'>
        <h1 className='md:text-[1.2vw] text-[2.5vh] text-zinc-500 dark:text-zinc-200 font-semibold'>Chats</h1>

        <div className="flex items-center gap-1">
            <div ref={plusRef} className="p-2 rounded-lg hover:bg-zinc-300 transition-colors duration-200 cursor-pointer">
                <PlusSquareIcon size={25}/>
            </div>

            <div ref={menuRef} className="p-2 rounded-lg hover:bg-zinc-300 transition-colors duration-200 cursor-pointer">
                <LucideMenu size={25}/>
            </div>
        </div>
    </div>
  )
}

export default HeadAndCreateGroup