import React from 'react'
import { Link } from "react-router-dom"

const ToPath = ({Path, Icon, Name, }) => {
  return (
    <Link to={Path}>
        <button 
            className="bg-[#EA89D7] hover:bg-[#a35f96] text-norm text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-shadow flex flex-row items-center gap-2"
        >
            <img src={Icon} className='w-6'/>
            {Name}
        </button>
    </Link>
  )
}

export default ToPath