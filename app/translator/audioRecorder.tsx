import { useState, useRef, SetStateAction, Dispatch } from "react";
import { Conversation, Translator } from "@/lib/translator";
import { Loader, Mic, StopCircle, ActivitySquare } from "lucide-react";
import { RecordingStatus } from "./chat";

type AudioRecorderProps = {
  convoHandler: Conversation;
  recordingStatus: RecordingStatus;
  setRecordingStatus: Dispatch<SetStateAction<RecordingStatus>>;
};

const AudioRecorder = ({
  convoHandler,
  recordingStatus,
  setRecordingStatus,
}: AudioRecorderProps) => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  let mimeType: string = "";

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus(RecordingStatus.Recording);
    // Create new Media recorder instance using the stream
    if (!stream) return;
    let media = null;
    try {
      media = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mimeType = "audio/webm";
    } catch (err1) {
      try {
        // Fallback for iOS
        media = new MediaRecorder(stream, { mimeType: "video/mp4" });
        mimeType = "video/mp4";
      } catch (err2) {
        // If fallback doesn't work either. Log / process errors.
        console.error({ err1 });
        console.error({ err2 });
      }
    }
    // Set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    if (!mediaRecorder.current) return;
    // Invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    setRecordingStatus(RecordingStatus.Inactive);
    // Stops the recording instance
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      // Creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });

      // Updates convo
      convoHandler.setAudio(audioBlob);

      // Creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
    setRecordingStatus(RecordingStatus.Stored);
  };

  return (
    <div>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button
              onClick={getMicrophonePermission}
              type="button"
              className="w-24 h-24 rounded-3xl bg-yellow-300 flex justify-center items-center border-4 border-[#8B8000]"
            >
              <Loader size={50} stroke="#8B8000" />
            </button>
          ) : null}
          {permission && recordingStatus === RecordingStatus.Inactive ? (
            <button
              onClick={startRecording}
              type="button"
              className="w-24 h-24 rounded-3xl bg-teal-300 flex justify-center items-center border-4 border-teal-500 hover:bg-teal-500 transition-all"
            >
              <Mic size={50} stroke="#138579" />
            </button>
          ) : null}
          {recordingStatus === RecordingStatus.Recording ? (
            <button
              onClick={stopRecording}
              type="button"
              className="w-24 h-24 rounded-3xl bg-purple-300 flex justify-center items-center border-4 border-purple-500 hover:bg-purple-500 transition-all"
            >
              <StopCircle size={50} stroke="#663497" />
            </button>
          ) : null}
          {recordingStatus === RecordingStatus.Stored ? (
            <button
              onClick={startRecording}
              type="button"
              className="w-24 h-24 rounded-3xl bg-teal-300 flex justify-center items-center border-4 border-teal-500 hover:bg-teal-500 transition-all"
            >
              <ActivitySquare size={50} stroke="#138579" />
            </button>
          ) : null}
        </div>

        {/* {audio ? (
          <div className="audio-container">
            <audio src={audio} controls></audio>
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        ) : null} */}
      </main>
    </div>
  );
};
export default AudioRecorder;
