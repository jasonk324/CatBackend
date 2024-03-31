import React from 'react'
import HelloKitty from '../assets/Logos/HelloKittyIcon.png'
import Tmu from "../assets/Logos/TmuIcon.png"

const Header = () => {
  return (
    <>
      <div className='flex flex-row bg-top text-white fixed w-full z-30 justify-between items-center'>
        <div className='flex flex-row items-center justify-center gap-4 text-title font-bold ml-16'>
          <img src={HelloKitty} className='w-16'/>
          <div className='text-white hidden lg:block'>Robotic Cat</div>
        </div>
        <div className='mr-8 flex-row text-small font-bold'>
          <div className='flex justify-end items-center gap-4'>
            <span className='hidden lg:block'>Electrical Engineering Capstone (ELE70A/B)</span>
            <img src={Tmu} className='w-12 my-1'/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header