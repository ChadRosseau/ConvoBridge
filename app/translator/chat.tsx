import AudioRecorder from "./audioRecorder";
import { Message, Conversation, Person } from "@/lib/translator";
import { Dispatch, SetStateAction, useState } from "react";
import { LogIn } from "lucide-react";

type ChatProps = {
  convoHandler: Conversation;
  person: Person;
};

export enum RecordingStatus {
  Inactive = "inactive",
  Recording = "recording",
  Stored = "stored",
}

const Chat = ({ convoHandler, person }: ChatProps) => {
  const [convo, setConvo] = useState(person.conversation);
  const [recordingStatus, setRecordingStatus] = useState(
    RecordingStatus.Inactive
  );

  convoHandler.setUpdater(person, setConvo);

  return (
    <div className="w-full h-full">
      <div className="w-full h-[80%] flex flex-col justify-end items-start p-12 pb-0 overflow-hidden relative">
        <div className="absolute w-full h-[15%] top-0 left-0 bg-gradient-to-b from-white"></div>
        {convo.map((msg: Message, idx: number) => {
          return (
            <div
              className={
                "flex items-center w-full " +
                (msg.person.id == person.id ? "justify-start" : "justify-end")
              }
              key={idx}
            >
              <p
                className={
                  "rounded-full w-fit px-4 py-2 my-2 inline-block text-lg " +
                  (msg.person.id == 1 ? "bg-teal-300" : "bg-purple-300")
                }
              >
                {msg.text}
              </p>
            </div>
          );
        })}
      </div>
      <div className="w-1/2 m-auto h-[20%] flex justify-around items-center">
        {/* <div
          className="w-24 h-24 rounded-3xl bg-rose-500 flex justify-center items-center border-4 border-rose-800 cursor-pointer hover:bg-rose-800 transition-all"
          onClick={() => convoHandler.removeAudio()}
        >
          <RotateCcw size={50} stroke="brown" />
        </div> */}
        {/* <div
          className="w-24 h-24 rounded-full bg-orange-500"
          onClick={() => convoHandler.testData()}
        ></div> */}
        <AudioRecorder
          convoHandler={convoHandler}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
        <div
          className="w-24 h-24 rounded-3xl bg-green-400 flex justify-center items-center border-4 border-green-700 cursor-pointer hover:bg-green-700 transition-all"
          onClick={() => {
            convoHandler.say(person);
            setRecordingStatus(RecordingStatus.Inactive);
          }}
        >
          <LogIn size={50} stroke="green" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
