import { useEffect, useRef, useState } from 'react';

import { generateSpeech } from '../api/chat.api';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const speechVersionRef = useRef(0);

  function clearRemoteAudio() {
    audioRef.current?.pause();
    audioRef.current = null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  function cancelCurrentSpeech() {
    requestRef.current?.abort();
    requestRef.current = null;
    clearRemoteAudio();
    window.speechSynthesis?.cancel();
  }

  useEffect(() => {
    return () => {
      speechVersionRef.current += 1;
      requestRef.current?.abort();
      audioRef.current?.pause();

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      window.speechSynthesis?.cancel();
    };
  }, []);

  function speakWithBrowser(text: string, speechVersion: number) {
    if (
      speechVersion !== speechVersionRef.current ||
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      if (speechVersion === speechVersionRef.current) {
        console.error(
          'Speech Synthesis não é suportado neste navegador.',
        );
        setIsSpeaking(false);
      }

      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    utterance.onend = () => {
      if (speechVersion === speechVersionRef.current) {
        setIsSpeaking(false);
      }
    };

    utterance.onerror = event => {
      if (speechVersion === speechVersionRef.current) {
        console.error(
          'Erro ao reproduzir voz com Speech Synthesis:',
          event.error,
        );
        setIsSpeaking(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  async function speak(text: string) {
    stop();

    if (!text.trim()) return;

    const speechVersion = speechVersionRef.current;
    const request = new AbortController();
    let fallbackStarted = false;
    requestRef.current = request;

    const fallbackToBrowser = (error: unknown) => {
      if (
        fallbackStarted ||
        speechVersion !== speechVersionRef.current
      ) {
        return;
      }

      fallbackStarted = true;
      console.error('Erro ao reproduzir voz remota:', error);
      clearRemoteAudio();
      speakWithBrowser(text, speechVersion);
    };

    try {
      setIsSpeaking(true);

      const blob = await generateSpeech(text, request.signal);

      if (speechVersion !== speechVersionRef.current) return;

      requestRef.current = null;

      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      const audio = new Audio(objectUrl);
      audioRef.current = audio;

      audio.onended = () => {
        if (speechVersion !== speechVersionRef.current) return;

        clearRemoteAudio();
        setIsSpeaking(false);
      };

      audio.onerror = event => {
        fallbackToBrowser(event);
      };

      await audio.play();
    } catch (error) {
      if (requestRef.current === request) {
        requestRef.current = null;
      }

      fallbackToBrowser(error);
    }
  }

  function stop() {
    speechVersionRef.current += 1;
    cancelCurrentSpeech();
    setIsSpeaking(false);
  }

  return {
    isSpeaking,
    speak,
    stop,
  };
}
