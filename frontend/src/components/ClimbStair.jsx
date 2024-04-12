import React from 'react'
import Up from "../assets/Directions/Up.png"
import Down from "../assets/Directions/Down.png"
import Right from "../assets/Directions/RightTurn.png"
import Left from "../assets/Directions/LeftTurn.png"
import CatPaw from "../assets/Buttons/CatPaw.png"
import { setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'
import { useButtons } from '../contexts/ButtonsContext'
import { db } from "../firebase";

const ClimbStair = () => {
  const { Modes, Disabled } = useButtons()
  const actionRef = collection(db, "Actions");

  const buttonClick = async (actionID) => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: actionID,
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  return (
    <div className='flex flex-row items-center gap-1 w-full'>
        <div>
            <button 
            onClick={() => buttonClick('n')} 
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
            >
                <img src={CatPaw} className='w-[12px]'/>
            </button>
        </div>
        <div>
            <button 
            onClick={() => buttonClick('m')}
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
            >
                <img src={CatPaw} className='w-[12px]'/>
            </button>
        </div>
        <div>
            <button 
            onClick={() => buttonClick(',')}
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
            >
                <img src={CatPaw} className='w-[12px]'/>
            </button>
        </div>
        <div>
            <button 
            onClick={() => buttonClick('.')}
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
            >
                <img src={CatPaw} className='w-[12px]'/>
            </button>
        </div>
        <div>
            <button 
            onClick={() => buttonClick('/')}
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
            >
                <img src={CatPaw} className='w-[12px]'/>
            </button>
        </div>
    </div>
  )
}

export default ClimbStair