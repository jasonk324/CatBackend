import React from 'react'

const AudioSpeak = () => {
  return (
    <>
      <div className='flex flex-row w-full justify-start items-center'>
        <div className='flex h-full items-center justify-center'>
          <button 
            onClick={buttonClick} 
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
          >
            <img src={CatPaw} className='w-[18px]'/>
          </button>
        </div>
        <div className='text-white font-bold ml-4'>{description}</div>
      </div>
    </>
  )
}

export default AudioSpeak