"use client";

import { useEffect, useRef, useState } from "react";

// @ts-ignore
import CameraUtils from "@mediapipe/camera_utils";
const Camera = CameraUtils.Camera;

export default function EyeTracker({
  flag,
  setFlag,
}: {
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [eyeStable, setEyeStable] = useState(false); // ✅ Inverted meaning
  const eyeHistory = useRef<number[]>([]);
  const sideHoldCounter = useRef(0);
  const previousDirection = useRef<number | null>(null);

  const MAX_HISTORY = 15;
  const SIDE_GAZE_THRESHOLD = 0.08;
  const MAX_SIDE_HOLD_FRAMES = 20;

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
        const leftEye = landmarks[39];
        const rightEye = landmarks[263];
        const eyeDirection = leftEye.x - rightEye.x;
        const directionMagnitude = Math.abs(eyeDirection);

        // Record direction (left/right) in history
        eyeHistory.current.push(eyeDirection > 0 ? 1 : -1);
        if (eyeHistory.current.length > MAX_HISTORY) {
          eyeHistory.current.shift();
        }

        // Detect prolonged side gaze
        if (directionMagnitude > SIDE_GAZE_THRESHOLD) {
          const currentDirection = eyeDirection > 0 ? 1 : -1;
          if (previousDirection.current === currentDirection) {
            sideHoldCounter.current += 1;
          } else {
            previousDirection.current = currentDirection;
            sideHoldCounter.current = 1;
          }

          if (sideHoldCounter.current >= MAX_SIDE_HOLD_FRAMES) {
            if (!eyeStable) {
              console.log("Unstable (Eye Movement Detected ❌)");
              setEyeStable(false);
              setFlag(true);
            }
          }
        } else {
          sideHoldCounter.current = 0;
          setEyeStable(true); // ❌ Not looking away means Unstable
        }
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
        <span className={eyeStable ? "text-red-400" : "text-green-400"}>
          {!eyeStable ? "Stable (No Eye Movement ✅)" : "Unstable (Eye Movement Detected ❌)"}
        </span>
      </div>
    </div>
  );
}
