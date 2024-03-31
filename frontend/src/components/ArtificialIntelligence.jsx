import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import MicOff from "../assets/AudioIcons/MicOff.png"
import MicOn from "../assets/AudioIcons/MicOn.png"
import Garbage from "../assets/Buttons/Garbage.png"
import Upload from "../assets/Buttons/Upload.png"
import HelloKitty from "../assets/Logos/HelloKittyBlackIcon.png"
import { useButtons } from '../contexts/ButtonsContext'
import { setDoc, doc, serverTimestamp, collection, onSnapshot  } from 'firebase/firestore'
import { db } from "../firebase";

const ArtificialIntelligence = () => {
    const { Audio, Modes } = useButtons()
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();
	const messageRef = collection(db, "Messages")

    const sendTranscript = async () => {
        let formData = new FormData()

        formData.append("transcript", Audio["transcript"].get)
        formData.append("personality", Modes["selectedVoice"].get)

        await fetch(`/chatGPTResponse`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
                Audio["response"].set(data['Response']);
                console.log(data);
            })
            .catch((error) => console.log(error));
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

    const listenEnding = async () => {
        let heardString = ""
        console.log("listening for the ending")
      
        return new Promise((resolve, reject) => {
            const unsubscribe = onSnapshot(messageRef, (snapshot) => {
                const changes = snapshot.docChanges();
                for (const change of changes) {
                    const newDocument = change.doc.data();

                    let createdAt = newDocument.createdAt; 
                    
                    if (createdAt && typeof createdAt.toMillis === 'function') {
                        createdAt = createdAt.toMillis();
                        console.log(createdAt);
                      } else {
                        console.log('CreatedAt is null or undefined.');
                      }

                    const oneMinAgo = Date.now() - 10 * 1000;

                    if (createdAt > oneMinAgo) { 

                        console.log('New Document:', newDocument);
                        if (newDocument['message'] === 'complete1') {
                            Audio['listening'].set(false);
                            Audio['transcript'].set(heardString);
                            resolve(newDocument);
                            unsubscribe(); 
                        } else if (newDocument['message'] !== 'listen1') {
                            heardString = newDocument['message']
                        }

                    }
                }   
            }, (error) => {
                reject(error);
            });
        });
    };

    const handleClear = async () => {
        let formData = new FormData()
        formData.append("personality", Modes["selectedVoice"].get)

        await fetch(`/chatGPTReset`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
                Audio["response"].set(data['Response']);
                console.log(data);
            })
            .catch((error) => console.log(error));
        Audio['newConvo'].set(true);
        Audio["response"].set("");
        Audio["transcript"].set("");
        resetTranscript();        
    }

	const handleMicOn = async () => {
		if (Modes['pcMic'].get === true) { // In laptop mode
			SpeechRecognition.startListening();
		} else { // cat mic
            Audio['listening'].set(true);
			const messageDocRef = doc(messageRef);
			setDoc(messageDocRef, {
			  message: "listen1",
			  location: "React",
			  createdAt: serverTimestamp()
			})
            listenEnding();
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

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
      <>
        <div className='flex flex-col gap-3 h-full'>
            <div className='flex flex-row gap-3 h-[45%]'>
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
                    {/* {Audio["transcript"].get ? (
                        <textarea  
                            className='' 
                            placeholder={"e.g. Elon"} 
                            value={Audio["transcript"].get}
                        />
                    ) : (
                        <p>Transcript will appear here...</p>
                    )} */}
                </div>
            </div>
            <div className='flex flex-row gap-3 h-[45%]'>
                <div className='bg-[#FFFFFF] text-black rounded-md p-3 w-full h-full overflow-auto'>
                    {Audio["response"].get ? (
                        <p>{Audio["response"].get}</p>
                    ) : (
                        <p>Cat's Response...</p>
                    )}
                </div>
                <div>
                    <div className='bg-[#b69082] p-3 rounded-full'>
                        <img src={HelloKitty} className='w-12'/>
                    </div>
                </div>
            </div>
            <div className='flex justify-center gap-2'>
                <button 
                    onClick={handleClear}
                    className="bg-[#F5C3AF] hover:bg-[#b69082] text-norm text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-shadow flex flex-row items-center gap-2"
                >
                    <img src={Garbage} className='w-6'/>
                    Clear History
                </button>
            </div>
        </div>
      </>
    );
  };
  export default ArtificialIntelligence;