"use client";
import React, { useState, useRef, useEffect } from "react";

const audioCtx = new window.AudioContext();
let audioAnalyser = audioCtx.createAnalyser();
let mediaRecorder;

export default function RedeemForm({ afterSave, productID, productName }) {
  const [recording, setRecording] = useState(false);

  const player = useRef();
  const downloadLink = useRef();
  let canvasCtx;

  useEffect(() => {
    canvasCtx = player.current.getContext("2d");
  }, [player]);

  const visualizeSineWave = (
    width,
    height,
    backgroundColor = "#ffffff",
    strokeColor = "#000000"
  ) => {
    if (player.current) {
      console.log("We got current", player.current);
    }
    const bufferLength = audioAnalyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      requestAnimationFrame(draw);
      audioAnalyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = strokeColor;

      canvasCtx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
    }

    draw();
  };

  const handleSuccessRecord = (stream) => {
    const options = { mimeType: "audio/webm" };
    const recordedChunks = [];

    if (!mediaRecorder) {
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/wav" });
        player.src = URL.createObjectURL(blob);
        if (stream) {
          // get all tracks from the MediaStream
          stream.getAudioTracks().forEach((track) => track.stop());
        }
        audioAnalyser = audioCtx.createAnalyser();
        setRecording(false);
      };
    }

    setRecording(true);
    if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    } else {
      audioCtx.resume().then(() => {
        mediaRecorder.start(10);
        const sourceNode = audioCtx.createMediaStreamSource(stream);
        sourceNode.connect(audioAnalyser);
      });
      visualizeSineWave(600, 120);
    }
  };

  const startRecord = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccessRecord);
  };

  const stopRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder = null;
    }
  };

  const [form, setForm] = useState({
    name: "",
    biometricID: "",
  });

  const createAccount = () => {
    console.log("Create account");
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value });
  };

  return (
    <form className="mx-auto rounded-lg border border-gray-200 p-5 dark:border-gray-700 md:w-1/3">
      <div className="mb-6 pt-5">
        <p className="my-2 text-sm text-gray-900 dark:text-gray-300">Beneficiary Approval</p>

        <div className="relative mb-2">
          <input
            type="text"
            id="name"
            name="name"
            className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            required
            value={form.name}
            onChange={handleChange}
          />
          <label
            htmlFor="name"
            className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Name
          </label>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            id="biometricID"
            name="biometricID"
            className="peer my-2 block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
            required
            value={form.biometricID}
            onChange={handleChange}
          />
          <label
            htmlFor="biometricID"
            className="absolute top-4 left-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Password
          </label>
        </div>

        <div>
          <canvas ref={player} height={120} width={600} />
          <button className="mx-2" onClick={() => startRecord()}>
            Start
          </button>
          <button className="mx-2" onClick={() => stopRecord()}>
            Stop
          </button>
          <a id="download" ref={downloadLink}>
            Download
          </a>
        </div>

        <div className="relative mb-2">
          <button
            type="button"
            onClick={() => console.log("capture speaker approval")}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-4 text-center items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            Authenticate Transaction
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => createAccount()}
        className="float-right w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Save Beneficiary
      </button>
    </form>
  );
}
