import React from 'react'
import Switch from 'react-switch';
import { useButtons } from '../contexts/ButtonsContext';

const SwitchMode = ({keyName, description}) => {
  const { Modes } = useButtons()

  const handleSwitch = () => {
    let m = !Modes[keyName].get
    Modes[keyName].set(m)

    switch (keyName) { 
      case "automatic": 
        Modes['manual'].set(Modes[keyName].get);
        break;
      case "manual": 
        Modes['automatic'].set(true);
        break;
      case "aiMode":
        console.log(Modes["talkieMode"].get)
        if (m) {
          Modes["talkieMode"].set(false);
        } else {
          Modes["talkieMode"].set(true);
        }
        break;
      case "talkieMode":
        console.log(Modes["aiMode"].get)
        if (m) {
          Modes["aiMode"].set(false);
        } else {
          Modes["aiMode"].set(true);
        }
      case "pcMic":
        if (m) {
          Modes["catMic"].set(false);
        } else {
          Modes["catMic"].set(true);
        }
        break;
      case "catMic":
        if (m) {
          Modes["pcMic"].set(false);
        } else {
          Modes["pcMic"].set(true);
        }
        break;
      case "voiceCat":
        Modes["selectedVoice"].set("Cat")
        if (m) {
          Modes["voiceGym"].set(false);
          Modes["voicePirate"].set(false);
        } else {
          Modes["voiceGym"].set(true);
        }
        break;
      case "voiceGym":
        Modes["selectedVoice"].set("Gym Bro")
        if (m) {
          Modes["voiceCat"].set(false);
          Modes["voicePirate"].set(false);
        } else {
          Modes["voiceCat"].set(true);
        }
        break;
      case "voicePirate":
        Modes["selectedVoice"].set("Pirate")
        if (m) {
          Modes["voiceCat"].set(false);
          Modes["voiceGym"].set(false);
        } else {
          Modes["voiceCat"].set(true);
        }
        break;
    }
    // console.log(Modes["selectedVoice"].get)
  }

  return (
    <>
      {keyName !== "automatic" && 
        <div className='flex items-center justify-start gap-3'>
          <Switch 
            onChange={handleSwitch} 
            checked={Modes[keyName].get} 
            disabled={!Modes["manual"].get}
          />
          <span>{description}</span>
        </div>
      }
      {keyName === "automatic" && 
        <div className='flex items-center justify-start gap-3'>
          <Switch 
            onChange={handleSwitch} 
            checked={Modes[keyName].get}   
          />
          <span>{description}</span>
        </div>
      }
    </>
  )
}

export default SwitchMode