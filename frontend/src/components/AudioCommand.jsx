import React from 'react'
import { useButtons } from '../contexts/ButtonsContext';
import { setDoc, doc, serverTimestamp, collection, updateDoc } from 'firebase/firestore'
import { db } from "../firebase";
import AudioIcon from "../assets/AudioIcons/AudioOn.png"

const AudioCommand = ({description, actionName}) => {
	const { Modes, Disabled } = useButtons()
	const ref = doc(db, "Conversations", "WakieTalkie");

    const sendTranscript = async () => {
        await updateDoc(ref, {
			Output: description
		})
    }

  return (
    <>
      <div className='flex flex-row w-full justify-start items-center'>
        <div className='flex h-full items-center justify-center'>
          <button 
            onClick={sendTranscript} 
            className={`${!Modes["manual"].get || Disabled.get ? 'bg-[#b69082]' : 'bg-[#F5C3AF]'} hover:bg-[#b69082] text-norm text-black font-bold p-3 rounded focus:outline-none focus:shadow-outline w-full`}
            disabled={!Modes["manual"].get || Disabled.get}
          >
            <img src={AudioIcon} className='w-[18px]'/>
          </button>
        </div>
        <div className='text-white font-bold ml-4'>{description}</div>
      </div>
    </>
  )
}

export default AudioCommand