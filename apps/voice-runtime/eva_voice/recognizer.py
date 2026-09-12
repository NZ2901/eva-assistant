from __future__ import annotations

import json
from threading import Event
import time
from typing import Iterable


class VoskRecognizer:
    STOP_COMMANDS = ("eva pare", "eva parar", "eva pode parar")

    def __init__(self, model_path: str, sample_rate: int, wake_word: str):
        from vosk import Model

        self.model = Model(model_path)
        self.sample_rate = sample_rate
        self.wake_word = wake_word.lower()

    @staticmethod
    def _text(result: str, key: str) -> str:
        value = json.loads(result).get(key, "")
        return value.strip().lower() if isinstance(value, str) else ""

    def wait_for_wake_word(self, chunks: Iterable[bytes]) -> None:
        from vosk import KaldiRecognizer

        grammar = json.dumps([self.wake_word, "[unk]"], ensure_ascii=False)
        recognizer = KaldiRecognizer(self.model, self.sample_rate, grammar)
        for chunk in chunks:
            if recognizer.AcceptWaveform(chunk):
                text = self._text(recognizer.Result(), "text")
            else:
                text = self._text(recognizer.PartialResult(), "partial")
            if self.wake_word in text.split():
                return

    def transcribe_command(
        self,
        chunks: Iterable[bytes],
        start_timeout_seconds: float,
        command_timeout_seconds: float,
    ) -> str:
        from vosk import KaldiRecognizer

        recognizer = KaldiRecognizer(self.model, self.sample_rate)
        started_at = time.monotonic()
        heard_speech = False

        for chunk in chunks:
            elapsed = time.monotonic() - started_at
            if elapsed >= command_timeout_seconds:
                break
            if recognizer.AcceptWaveform(chunk):
                text = self._text(recognizer.Result(), "text")
                if text:
                    return text
            else:
                partial = self._text(recognizer.PartialResult(), "partial")
                heard_speech = heard_speech or bool(partial)
            if not heard_speech and elapsed >= start_timeout_seconds:
                return ""

        return self._text(recognizer.FinalResult(), "text")

    def wait_for_stop_command(
        self, chunks: Iterable[bytes], cancelled: Event
    ) -> bool:
        from vosk import KaldiRecognizer

        grammar = json.dumps([*self.STOP_COMMANDS, "[unk]"], ensure_ascii=False)
        recognizer = KaldiRecognizer(self.model, self.sample_rate, grammar)
        for chunk in chunks:
            if cancelled.is_set():
                return False
            if recognizer.AcceptWaveform(chunk):
                text = self._text(recognizer.Result(), "text")
            else:
                text = self._text(recognizer.PartialResult(), "partial")
            if text in self.STOP_COMMANDS:
                return True

        return False
