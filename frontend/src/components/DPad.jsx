import React from 'react'
import Up from "../assets/Directions/Up.png"
import Down from "../assets/Directions/Down.png"
import Right from "../assets/Directions/RightTurn.png"
import Left from "../assets/Directions/LeftTurn.png"
import { setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'
import { useButtons } from '../contexts/ButtonsContext'
import { db } from "../firebase";

const DPad = () => {
	const { Modes, Disabled } = useButtons()
  const actionRef = collection(db, "Actions");

  const buttonClickUp = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "w",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  const buttonClickRight = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "r",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  const buttonClickLeft = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "l",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  const buttonClickDown = async () => {
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: "b",
      priority: 1,
      createdAt: serverTimestamp()
    })

    setTimeout(() => {
      Disabled.set(false)
    }, 1000)
  }

  return (
    <div className='flex flex-row items-center gap-4 w-full'>
        <div className="grid grid-cols-3 gap-1 pb-2">
          <div/>
            <button 
							className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : ''} bg-[#F5C3AF] hover:bg-[#b69082] rounded p-2`} 
              onClick={buttonClickUp}
							disabled={!Modes["manual"].get}
						>
              <img src={Up} className='w-6 h-6'/>
            </button>
            <div/>
            <button 
							className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : ''} bg-[#F5C3AF] hover:bg-[#b69082] rounded p-2`}
							disabled={!Modes["manual"].get}
              onClick={buttonClickLeft}
						>
              <img src={Left} className='w-6 h-6'/>
            </button>
            <div 
							className={`bg-[#b69082] rounded p-2`}
						/>
            <button 
							className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : ''} bg-[#F5C3AF] hover:bg-[#b69082] rounded p-2`}
							disabled={!Modes["manual"].get}
              onClick={buttonClickRight}
						>
              <img src={Right} className='w-6 h-6'/>
            </button>
            <div/>
            <button 
							className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : ''} bg-[#F5C3AF] hover:bg-[#b69082] rounded p-2`}
							disabled={!Modes["manual"].get}
              onClick={buttonClickDown}
						>
              <img src={Down} className='w-6 h-6'/>
            </button>
          <div />
        </div>
        <div className='flex-1'>
            <span className='font-bold'>Control Robot Movements</span> <br></br>
            (Once movement is selected use the center button to the end the action.)
        </div>
    </div>
  )
}

export default DPad