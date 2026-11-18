import { useCallback, useEffect, useRef } from "react";

import moktakSound from "../assets/moktak.mp3";

type AudioContextConstructor = typeof AudioContext;

/** 이보다 작은 소리는 앞쪽 무음으로 봐요(가장 큰 소리 대비). */
const SILENCE_RATIO = 0.02;
/** 소리가 커지기 시작하는 앞부분까지 살려 딸깍 소리 없이 시작하도록 조금 앞에서 틀어요(초). */
const LEAD_IN = 0.005;

const getAudioContext = (): AudioContextConstructor | undefined =>
  window.AudioContext ??
  (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;

/** 소리 파일 앞쪽 무음 길이(초)예요. `moktak.mp3`는 약 0.3초 비어 있어서 그만큼 건너뛰고 틀어요. */
const getLeadingSilence = (buffer: AudioBuffer) => {
  const samples = buffer.getChannelData(0);
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const start = samples.findIndex(sample => Math.abs(sample) > peak * SILENCE_RATIO);
  return start > 0 ? Math.max(0, start / buffer.sampleRate - LEAD_IN) : 0;
};

/**
 * 목탁 소리예요. 칠 때마다 원본 mp3를 그대로 새로 재생해서, 연타하면 앞 소리와 자연스럽게 겹쳐요.
 * 반환하는 함수는 부르는 즉시 소리를 내요.
 */
export const useMoktakSound = () => {
  const context = useRef<AudioContext | null>(null);
  const sound = useRef<{ buffer: AudioBuffer; offset: number } | null>(null);

  useEffect(() => {
    const Context = getAudioContext();
    if (!Context) return;
    let audio: AudioContext;
    try {
      // 탭에 바로 반응하도록 지연이 가장 짧은 모드로 열어요.
      audio = new Context({ latencyHint: "interactive" });
    } catch {
      // 오디오를 열지 못해도(컨텍스트 개수 한도 등) 소리 없이 칠 수 있어요.
      return;
    }
    context.current = audio;
    // 터치는 손을 뗄 때(pointerup)부터 소리를 켤 수 있어요. 바로 들어와 처음 칠 때도 소리가 나게 여기서도 깨워요.
    const unlock = () => {
      if (audio.state === "suspended") void audio.resume();
    };
    window.addEventListener("pointerup", unlock);

    fetch(moktakSound)
      .then(response => response.arrayBuffer())
      // 낮은 WebView는 Promise형 decodeAudioData를 몰라서 콜백형으로 불러요.
      .then(
        data =>
          new Promise<AudioBuffer>((resolve, reject) =>
            audio.decodeAudioData(data, resolve, reject),
          ),
      )
      .then(buffer => {
        if (context.current === audio)
          sound.current = { buffer, offset: getLeadingSilence(buffer) };
      })
      .catch(() => {
        // 소리를 못 불러와도 목탁은 칠 수 있어요.
      });

    return () => {
      window.removeEventListener("pointerup", unlock);
      context.current = null;
      sound.current = null;
      void audio.close();
    };
  }, []);

  return useCallback(() => {
    const audio = context.current;
    if (!audio) return;
    // WebView는 사용자가 누르는 순간에만 소리를 켤 수 있어서, 칠 때마다 깨워요.
    if (audio.state === "suspended") void audio.resume();
    if (!sound.current) return;
    const source = audio.createBufferSource();
    source.buffer = sound.current.buffer;
    source.connect(audio.destination);
    source.start(0, sound.current.offset);
  }, []);
};
