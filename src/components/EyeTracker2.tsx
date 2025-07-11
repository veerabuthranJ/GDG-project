"use client";

import { useEffect, useRef, useState } from "react";

// ✅ UMD Camera import still works this way
// @ts-ignore
import CameraUtils from "@mediapipe/camera_utils";
const Camera = CameraUtils.Camera;

export default function EyeTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [eyeErratic, setEyeErratic] = useState(false);
  const eyeHistory = useRef<number[]>([]);
  const MAX_HISTORY = 15;

  useEffect(() => {
    let faceMeshInstance: any;

    const initFaceMesh = async () => {
      const FaceMesh = (window as any).FaceMesh;

      if (!FaceMesh || !Camera) {
        console.error("FaceMesh or Camera not available on window.");
        return;
      }

      faceMeshInstance = new FaceMesh({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMeshInstance.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMeshInstance.onResults((results: any) => {
        const landmarks = results.multiFaceLandmarks?.[0];
        if (!landmarks) return;

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const eyeDirection = leftEye.x - rightEye.x;

        eyeHistory.current.push(eyeDirection > 0 ? 1 : -1);
        if (eyeHistory.current.length > MAX_HISTORY) {
          eyeHistory.current.shift();
        }

        const changes = eyeHistory.current.reduce(
          (acc, val, i, arr) =>
            i > 0 && arr[i - 1] !== val ? acc + 1 : acc,
          0
        );

        setEyeErratic(changes >= 6);
      });

      const camera = new Camera(videoRef.current!, {
        onFrame: async () => {
          await faceMeshInstance.send({ image: videoRef.current! });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    if (videoRef.current) {
      initFaceMesh();
    }

    return () => {
      faceMeshInstance?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 border bg-black rounded shadow-md">
      <video
        ref={videoRef}
        className="w-40 h-28 object-cover rounded"
        autoPlay
        muted
        playsInline
      />
      <div className="text-xs text-white p-1 text-center">
        Eye Status:{" "}
        <span className={eyeErratic ? "text-red-400" : "text-green-400"}>
          {eyeErratic ? "Erratic" : "Stable"}
        </span>
      </div>
    </div>
  );
}
