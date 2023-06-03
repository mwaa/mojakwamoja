import { useEffect, useState } from 'react';
let mediaRecorder;

export default function Audio({ saveAudio }) {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(25);

  useEffect(() => {
    let intervalId = 0;
    if (recording) {
      intervalId = setInterval(() => {
        const value = timer - 1;
        setTimer(value);
      }, 1000); // every second
    }
    
    return () => clearInterval(intervalId);
  }, [recording, timer]);

  const handleSuccessRecord = (stream) => {
    const options = { mimeType: 'audio/webm' };
    const recordedChunks = [];

    if (!mediaRecorder) {
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.onstart = () => {
        setRecording(true);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        saveAudio(new Blob(recordedChunks, { type: 'audio/webm' }));
        if (stream) {
          // stop all tracks from the MediaStream
          stream.getAudioTracks().forEach((track) => track.stop());
        }
        setRecording(false);
      };
    }

    if (mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
    } else {
      mediaRecorder.start(10);
    }
  };

  const startRecord = (e) => {
    e.preventDefault();
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccessRecord);
  };

  const stopRecord = (e) => {
    e.preventDefault();
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder = null;
    }
  };

  return (
    <div className="mx-auto my-4">
      <button
        className="mx-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-6 py-4 text-center items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        onClick={startRecord}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <title>Record</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        Start
      </button>
      <button
        className="mx-2 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-4 text-center items-center mr-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        onClick={stopRecord}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" version="1.1">
          <title>Stop</title>
          <path d="M0 6.563v18.875c0 0.531 0.438 0.969 0.969 0.969h18.875c0.531 0 0.969-0.438 0.969-0.969v-18.875c0-0.531-0.438-0.969-0.969-0.969h-18.875c-0.531 0-0.969 0.438-0.969 0.969z" />
        </svg>
        Stop
      </button>

      <span className="mx-2 my-2 text-5xl text-gray-900 dark:text-gray-300"> :{timer} </span>
      <p className="my-2 text-xs italic text-gray-900 dark:text-gray-300">
        Please note you have maximum of 25 seconds once you click start
      </p>
    </div>
  );
}
