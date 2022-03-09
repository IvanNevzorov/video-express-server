import { useState, useEffect, useCallback } from 'react';
import * as VideoExpress from '@vonage/video-express';

export default function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
  });

  const getDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.warn('enumerateDevices() not supported.');
      return;
    }
    try {
      const devices = await VideoExpress.getDevices();
      let audioOutputDevices = await VideoExpress.getAudioOutputDevices();
      const defaultDeviceIndex = audioOutputDevices.findIndex(
        (device) => device.deviceId === 'default'
      );

      audioOutputDevices[defaultDeviceIndex].label = 'System Default';
      console.log(audioOutputDevices);
      const audioInputDevices = devices.filter(
        (d) => d.kind.toLowerCase() === 'audioinput'
      );
      const videoInputDevices = devices.filter(
        (d) => d.kind.toLowerCase() === 'videoinput'
      );
      setDeviceInfo({
        audioInputDevices,
        videoInputDevices,
        audioOutputDevices,
      });
      // });
    } catch (err) {
      console.log('[loadDevices] - ', err);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  return { deviceInfo, getDevices };
}
