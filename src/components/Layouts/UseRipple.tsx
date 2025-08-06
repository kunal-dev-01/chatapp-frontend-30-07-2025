import { addRipple } from "./RippleEffect"
import {  useEffect,useRef } from "react"

interface props {
    ele: 
}

const UseRipple = ({ele}:props) => {

    useEffect(()=>{
        if(ele.current){
            addRipple(ele.current)
        }
    },[])

    return
  
}

export default UseRipple