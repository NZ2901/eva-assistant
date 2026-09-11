import {
  useEffect,
  useRef,
  useState,
} from 'react';

interface SpeechRecognitionEvent
  extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent
  extends Event {
  error: string;
}

interface SpeechRecognitionInstance
  extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start(): void;
  stop(): void;

  onstart:
    | (() => void)
    | null;

  onend:
    | (() => void)
    | null;

  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;

  onerror:
    | ((event: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseVoiceOptions {
  onTranscript?: (text: string) => void;
}

export function useVoice({
  onTranscript,
}: UseVoiceOptions = {}) {
  const [isListening, setIsListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState('');

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(
      null,
    );

  const onTranscriptRef =
    useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current =
      onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        'Speech Recognition não é suportado neste navegador.',
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = event => {
      const text =
        event.results[0][0].transcript.trim();

      if (!text) return;

      setTranscript(text);

      onTranscriptRef.current?.(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = event => {
      console.error(
        'Erro no reconhecimento de voz:',
        event.error,
      );

      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  function startListening() {
    const recognition =
      recognitionRef.current;

    if (!recognition) return;

    setTranscript('');

    try {
      recognition.start();
    } catch (error) {
      console.error(
        'Não foi possível iniciar o microfone:',
        error,
      );
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}