import React, { useContext, useState } from "react";

const ButtonsContext = React.createContext();

export function useButtons() {
  return useContext(ButtonsContext);
}

export function ButtonsProvider({ children }) {
  const [manual, setManual] = useState(true)
  const [automatic, setAutomatic] = useState(false)
  const [pcMic, setPcMic] = useState(true)
  const [catMic, setCatMic] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const [talkieMode, setTalkieMode] = useState(true)
  const [voiceCat, setVoiceCat] = useState(true)
  const [voiceGym, setVoiceGym] = useState(false)
  const [voicePirate, setVoicePirate] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState("Cat")

  const Modes = {
    manual: { get: manual, set: setManual },
    automatic: { get: automatic, set: setAutomatic },
    aiMode: { get: aiMode, set: setAiMode },
    talkieMode: { get: talkieMode, set: setTalkieMode },
    pcMic: { get: pcMic, set: setPcMic },
    catMic: { get: catMic, set: setCatMic },
    voiceCat: { get: voiceCat, set: setVoiceCat },
    voiceGym: { get: voiceGym, set: setVoiceGym },
    voicePirate: { get: voicePirate, set: setVoicePirate },
    selectedVoice : { get: selectedVoice, set: setSelectedVoice }
  }

  const [up, setUp] = useState(false)
  const [down, setDown] = useState(false)
  const [left, setLeft] = useState(false)
  const [right, setRight] = useState(false)
  const [getUp, setGetUp] = useState(false)
  const [raiseLeg, setRaiseleg] = useState(false)
  const [spinBody, setSpinBody] = useState(false)
  const [headLeft, setHeadLeft] = useState(false)
  const [headRight, setHeadRight] = useState(false)

  const Movements = {
    up: { get: up, set: setUp },
    down: { get: down, set: setDown },
    left: { get: left, set: setLeft },
    right: { get: right, set: setRight },
    getUp: { get: getUp, set: setGetUp },
    raiseLeg: { get: raiseLeg, set: setRaiseleg },
    spinBody: { get: spinBody, set: setSpinBody },
    headLeft: { get: headLeft, set: setHeadLeft },
    headRight: { get: headRight, set: setHeadRight }
  }

  const [newConvo, setNewConvo] = useState(true)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setReponse] = useState("")

  const Audio = {
    newConvo: { get: newConvo, set: setNewConvo },
    listening: { get: listening, set: setListening },
    transcript: { get: transcript, set: setTranscript },
    response: { get: response, set: setReponse }
  }

  const [C2H5CH, setC2H5CH]  = useState("C2H5CH: 100 ppm");
  const [CO, setCO] = useState("CO: 100 ppm");
  const [NO2, setNO2] = useState("NO2: 100 ppm");
  const [VOC, setVOC] = useState("VOC: 100 ppm");
  const [smell, setSmell] = useState("NO SMELL DETECTED");

  const Smell = {
    C2H5CH: { get: C2H5CH, set: setC2H5CH },
    CO: { get: CO, set: setCO },
    NO2: { get: NO2, set: setNO2 },
    VOC: { get: VOC, set: setVOC },
    smell: { get: smell, set: setSmell }
  }

  const [disabled, setDisabled] = useState(false)

  const Disabled = { get: disabled, set: setDisabled }

  const value = {
    Modes,
    Movements,
    Audio,
    Smell,
    Disabled
  };

  return (
    <ButtonsContext.Provider value={value}>
      {children}
    </ButtonsContext.Provider>
  );
}
