import React, { useEffect } from 'react'
import CameraIcon from "../assets/Buttons/Camera.png"
import ButtonCommand from '../components/ButtonCommand'
import ArtificialIntelligence from "../components/ArtificialIntelligence"
import SwitchMode from '../components/SwitchMode';
import DPad from '../components/DPad';
import ToPath from '../components/ToPath';
import SignOut from '../components/SignOut';
import WalkieTalkie from '../components/WalkieTalkie';
import { useButtons } from '../contexts/ButtonsContext';
import ClimbStair from '../components/ClimbStair';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { setDoc, getDoc, doc, serverTimestamp, collection, updateDoc } from 'firebase/firestore'
import { db } from "../firebase";

const Home = () => {
	const { Modes, Smell } = useButtons();

    const updateSmell = async () => {
		try {
		  const docRef = await getDoc(doc(db, "Smell_Distance", "Default"));
		  const data = docRef.data();
		  Smell['C2H5CH'].set(data.C2H5CH)
		  Smell['CO'].set(data.CO)
		  Smell['NO2'].set(data.NO2)
		  Smell['VOC'].set(data.VOC)
		} catch (error) {
		  console.error("Error getting document:", error);
		}
	  }

	useEffect(() => {
		updateSmell()
	}, [])

  return (
    <>
		<div className='mt-24 px-2'>
			<div className='w-full flex lg:flex-row flex-col gap-2'>

				<div className='darkGray-box lg:w-[33%] flex flex-col gap-4 p-6 rounded-2xl'>
					<div className='blue-box p-2 rounded-md text-center font-bold'>
						Primary Settings
					</div>
					{/* <div>
						Select Control Mode for the Robot ⚙️
					</div>
						<SwitchMode description={"Manual Mode"} keyName={"manual"} />
						<SwitchMode description={"Automatic Mode"} keyName={"automatic"} /> */}
					<div className="w-full flex flex-col gap-4 pt-3">
						Audio Settings
					</div>
					<div>
						This robot has been implemented with built in personalities and with the ability for audio to be delivered through this controller to speak through the cat like a Walkie-Talkie. Select which mode below:
					</div>
					<SwitchMode description={"Artificial Intelligence Mode"} keyName={"aiMode"} />
					<SwitchMode description={"Walkie Talkie Mode"} keyName={"talkieMode"} />
					<div className="w-full flex flex-col gap-4 pt-3 border-t-[1px] border-t-[#afafaf]">
						Voice Settings (Usable only while in AI mode)
					</div>
					<SwitchMode description={"Cat Mode"} keyName={"voiceCat"} />
					<SwitchMode description={"Gym Bro Mode"} keyName={"voiceGym"} />
					<SwitchMode description={"Pirate Mode"} keyName={"voicePirate"} />
					<div>
						<span className='font-bold'>Movement Discliamer</span>: Once a movement is selected it will run until completion any selected during will be queued to execute next
					</div>
				</div>
				<div className='darkGray-box lg:w-[33%] flex flex-col gap-4 p-6 rounded-2xl'>
					<div className='blue-box p-2 rounded-md text-center font-bold'>
						Movements
					</div>
					{/* <div>
						One action must be run until completion before the next one can be called.
					</div> */}
					<div className="w-full flex flex-row justify-between items-center pb-4 border-b-[1px] border-[#afafaf]">
						<div className='flex w-full'>
							<DPad />
						</div>
						<div className='flex flex-col w-full gap-2'>
							<ButtonCommand description={"Avoid Collisions"} actionName={"C"} timer={1000}/>
							<span className='font-bold mt-2'>Climb Stair Sequence</span>
							<ClimbStair/>
						</div>
					</div>
					{/* <div>
						Additional Movements
					</div> */}
					<div className='flex flex-row'>
						<ButtonCommand description={"Lean Forward"} actionName={"P"} timer={1000}/>
						<ButtonCommand description={"Stand Tall"} actionName={"s"} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Nod Yes"} actionName={"]"} timer={1000}/>
						<ButtonCommand description={"Nod No"} actionName={"["} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Sit"} actionName={"y"} timer={1000}/>
						<ButtonCommand description={"Wag Tail"} actionName={"t"} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Left Paw"} actionName={"k"} timer={1000}/>
						<ButtonCommand description={"Right Paw"} actionName={"g"} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Happy Mode"} actionName={"h"} timer={1000}/>
						<ButtonCommand description={"Wave Paw"} actionName={"i"} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Left Recover"} actionName={"c"} timer={1000}/>
						<ButtonCommand description={"Right Recover"} actionName={"v"} timer={1000}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Lie On Belly"} actionName={"-"} timer={1000}/>
						<ButtonCommand description={"Fall Recovery"} actionName={"X"} timer={1000}/>
					</div>
				</div>

				<div className='darkGray-box lg:w-[33%] flex flex-col gap-4 p-6 rounded-2xl'>
					<div className='blue-box p-2 rounded-md text-center font-bold'>
						Audio Controls
					</div>
					<div className='lg:flex-1 h-96 lg:pb-0 pb-8'>
						{Modes["aiMode"].get ? <ArtificialIntelligence /> : <WalkieTalkie />}
					</div>
				</div>

			</div>
			<div className='flex justify-between my-3'>
				<SignOut />
				<ToPath Path={"/video"} Icon={CameraIcon} Name={"Camera View"}/>
			</div>

		</div>
	</>
  )
}

export default Home