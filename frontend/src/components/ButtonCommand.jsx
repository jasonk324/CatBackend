import React from 'react'
import { useButtons } from '../contexts/ButtonsContext';
import { setDoc, doc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from "../firebase";
import CatPaw from "../assets/Buttons/CatPaw.png"

const ButtonCommand = ({description, actionName, timer}) => {
  const { Modes, Disabled } = useButtons()
  const actionRef = collection(db, "Actions");

  const buttonClick = async () => {
    console.log("It worked")
    Disabled.set(true)

    const actionDocRef = doc(actionRef);
    setDoc(actionDocRef, {
      action: actionName,
      priority: 1,
      createdAt: serverTimestamp()
    })

    // let timer = 100;
    // // Different timers for different buttons
    // if (description == "Get up") {
    //   timer = 100;
    // }  else if (description == "Smell") {
    //   timer = 100;
    // } else if (description == "Raise Leg") {
    //   timer = 100;
    // } else if (description == "Spin 360") {
    //   timer = 100;
    // } else if (description == "Head Left") {
    //   timer = 100;
    // } else if (description == "Head Right") {
    //   timer = 100;
    // }

    setTimeout(() => {
      Disabled.set(false)
    }, timer)
  }

  return (
    <>
      <div className='flex flex-row w-full justify-start items-center'>
        <div className='flex h-full items-center justify-center'>
          <button 
            onClick={buttonClick} 
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
          >
            <img src={CatPaw} className='w-[12px]'/>
          </button>
        </div>
        <div className='text-white font-bold ml-4'>{description}</div>
      </div>
    </>
  )
}

export default ButtonCommand