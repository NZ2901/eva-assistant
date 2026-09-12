from __future__ import annotations

from enum import Enum
from threading import Event, Thread
import time
from typing import Callable, Protocol

from .api import EvaApiClient
from .config import VoiceConfig


class RuntimeState(str, Enum):
    IDLE = "idle"
    WAKE_DETECTED = "wake_detected"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"


class Recognizer(Protocol):
    def wait_for_wake_word(self, chunks: object) -> None: ...
    def transcribe_command(self, chunks: object, start_timeout_seconds: float, command_timeout_seconds: float) -> str: ...
    def wait_for_stop_command(self, chunks: object, cancelled: Event) -> bool: ...


class VoiceRuntime:
    def __init__(
        self,
        config: VoiceConfig,
        microphone: object,
        recognizer: Recognizer,
        api: EvaApiClient,
        speaker: object,
        logger: Callable[[str], None] = print,
    ):
        self.config = config
        self.microphone = microphone
        self.recognizer = recognizer
        self.api = api
        self.speaker = speaker
        self.log = logger

    def set_state(self, state: RuntimeState, detail: str = "") -> None:
        suffix = f" detail={detail}" if detail else ""
        self.log(f"[voice] state={state.value}{suffix}")

    def run_once(self) -> bool:
        self.set_state(RuntimeState.IDLE)
        self.recognizer.wait_for_wake_word(self.microphone.chunks())
        self.set_state(RuntimeState.WAKE_DETECTED)
        self.set_state(RuntimeState.LISTENING)
        command = self.recognizer.transcribe_command(
            self.microphone.chunks(),
            self.config.speech_start_timeout_seconds,
            self.config.command_timeout_seconds,
        ).strip()
        if not command:
            self.set_state(RuntimeState.IDLE, "command_timeout")
            return False

        self.set_state(RuntimeState.PROCESSING, f'command="{command}"')
        response = self.api.chat(command)
        audio = self.api.speech(response)
        self.set_state(RuntimeState.SPEAKING)
        self._play_with_interrupt_listener(audio)
        return True

    def _play_with_interrupt_listener(self, audio: bytes) -> None:
        playback_finished = Event()
        stop_requested = Event()

        def listen_for_stop() -> None:
            chunks = self.microphone.chunks(playback_finished)
            if self.recognizer.wait_for_stop_command(chunks, playback_finished):
                if not playback_finished.is_set():
                    stop_requested.set()

        listener = Thread(target=listen_for_stop, name="eva-stop-listener", daemon=True)
        listener.start()
        try:
            interrupted = self.speaker.play_wav(audio, stop_requested)
        finally:
            playback_finished.set()
            listener.join()

        if interrupted:
            self.set_state(RuntimeState.IDLE, "speech_interrupted")

    def run_forever(self) -> None:
        while True:
            try:
                self.run_once()
            except KeyboardInterrupt:
                self.log("[voice] stopped")
                return
            except Exception as error:
                self.log(f"[voice] error={type(error).__name__} detail={error}")
                time.sleep(self.config.retry_seconds)
