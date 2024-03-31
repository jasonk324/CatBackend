import React from 'react'
import { Link } from "react-router-dom"
import LogoutIcon from "../assets/Buttons/Logout.png"

const SignOut = () => {
  return (
    <Link to={"/login"}>
        <button 
            className="bg-[#EA89D7] hover:bg-[#a35f96] text-norm text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-shadow flex flex-row items-center gap-2"
        >
            <img src={LogoutIcon} className='w-6'/>
            Sign Out
        </button>
    </Link>
  )
}

export default SignOut