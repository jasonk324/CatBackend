import React from 'react'
import CameraIcon from "../assets/Buttons/Camera.png"
import ButtonCommand from '../components/ButtonCommand'
import ArtificialIntelligence from "../components/ArtificialIntelligence"
import SwitchMode from '../components/SwitchMode';
import DPad from '../components/DPad';
import ToPath from '../components/ToPath';
import SignOut from '../components/SignOut';
import WalkieTalkie from '../components/WalkieTalkie';
import { useButtons } from '../contexts/ButtonsContext';

const Home = () => {
	const { Modes } = useButtons();

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
				</div>
				<div className='darkGray-box lg:w-[33%] flex flex-col gap-4 p-6 rounded-2xl'>
					<div className='blue-box p-2 rounded-md text-center font-bold'>
						Movements
					</div>
					<div>
						One action must be run until completion before the next one can be called.
					</div>
					<div className="w-full flex justify-between items-center flex-col gap-4 py-6 border-t-[1px] border-t-[#afafaf] border-b-[1px] border-b-[#afafaf]">
						<DPad />
					</div>
					<div>
						Additional Movements
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Stand"} actionName={"a"}/>
						<ButtonCommand description={"Walk"} actionName={"8"}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Backward"} actionName={"b"}/>
						<ButtonCommand description={"Stand Tall"} actionName={"s"}/>
					</div>
					<div className='flex flex-row'>
						<ButtonCommand description={"Forwards"} actionName={"w"}/>
						<ButtonCommand description={"Happy"} actionName={"h"}/>
					</div>
				</div>

				<div className='darkGray-box lg:w-[33%] flex flex-col gap-4 p-6 rounded-2xl'>
					<div className='blue-box p-2 rounded-md text-center font-bold'>
						Audio Controls
					</div>
					<div className='lg:flex-1 h-96'>
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