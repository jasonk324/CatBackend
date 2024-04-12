import React, { useEffect, useState } from 'react'
import MicOff from "../assets/AudioIcons/MicOff.png"
import MicOn from "../assets/AudioIcons/MicOn.png"
import Upload from "../assets/Buttons/Upload.png"
import { useButtons } from '../contexts/ButtonsContext'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import AudioCommand from "./AudioCommand"
import { db } from "../firebase";
import { getDoc, doc, updateDoc } from 'firebase/firestore'; 

const WalkieTalkie = () => {
    const { Audio, Modes } = useButtons()
    const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition
    } = useSpeechRecognition();
	const ref = doc(db, "Conversations", "WakieTalkie");

    const sendTranscript = async () => {
        await updateDoc(ref, {
			Output: Audio['transcript'].get
		})
    }

    useEffect(() => {
        Audio["transcript"].set(transcript)
    }, [transcript])

    useEffect(() => {
        Audio['listening'].set(listening)
        if (listening === false) {
            Audio['newConvo'].set(false);
        } 
    }, [listening])

	const handleMicOn = async () => {
		if (Modes['pcMic'].get === true) { // In laptop mode
			SpeechRecognition.startListening();
		} 
	}

	const handleMicOff = () => {
		if (Modes['pcMic'].get === true) { // In laptop mode
			SpeechRecognition.stopListening();
		} 
	}
  
    const handleTextChange = (e) => {
        const newText = e.target.value
        Audio['transcript'].set(newText)
    }

	return (
		<>
			<div className='flex flex-col gap-3 h-full'>
				<div className='flex flex-row gap-3 h-full'>
					<div className='flex flex-col gap-3'>
						{Audio['listening'].get ? (
								<button className='bg-[#F5C3AF] hover:bg-[#b69082] p-3 rounded-full' onClick={handleMicOff}>
									<img src={MicOff} className='w-12'/>
								</button>
							) : (
								<button className='bg-[#F5C3AF] hover:bg-[#b69082] p-3 rounded-full' onClick={handleMicOn}>
									<img src={MicOn} className='w-12'/>
								</button>
							)
						}
						<button 
							onClick={sendTranscript}
							className={"bg-[#F5C3AF] hover:bg-[#b69082] p-3 rounded-full"}
						>
							<img src={Upload} className='w-12'/>
						</button>
					</div>
					<div className='bg-[#FFFFFF] text-black rounded-md p-3 w-full h-full overflow-auto'>
						<textarea  
							className='w-full h-[95%]' 
							placeholder={"Transcript will appear here..."} 
							value={Audio["transcript"].get}
							onChange={(e) => handleTextChange(e)}
						/>
					</div>
				</div>
				<div className='flex flex-col mt-4 gap-3 h-[45%]'>
					<div className="w-full flex flex-col gap-4 pt-3 border-t-[1px] border-t-[#afafaf]">
						Basic Sample Audio Messages
					</div>
					<div className='flex flex-row'>
						<AudioCommand description={"Meow"}/>
						<AudioCommand description={"Hello There"}/>
					</div>
					<div className='flex flex-row'>
						<AudioCommand description={"Good Job"}/>
						<AudioCommand description={"Bad Job"}/>
					</div>
					<div className='flex flex-row'>
						<AudioCommand description={"I Love You"}/>
						<AudioCommand description={"I Hate You"}/>
					</div>
				</div>
			</div>
		</>
	)
}

export default WalkieTalkie