from __future__ import annotations

from io import BytesIO
import queue
from threading import Event
import wave
from typing import Iterator


class Microphone:
    def __init__(self, sample_rate: int, block_size: int, device: str | int | None):
        self.sample_rate = sample_rate
        self.block_size = block_size
        self.device = device

    def chunks(self, cancelled: Event | None = None) -> Iterator[bytes]:
        import sounddevice as sd

        audio_queue: queue.Queue[bytes] = queue.Queue(maxsize=32)

        def callback(indata: bytes, _frames: int, _time: object, status: object) -> None:
            if status:
                print(f"[voice] audio_warning detail={status}", flush=True)
            try:
                audio_queue.put_nowait(bytes(indata))
            except queue.Full:
                try:
                    audio_queue.get_nowait()
                except queue.Empty:
                    pass
                audio_queue.put_nowait(bytes(indata))

        with sd.RawInputStream(
            samplerate=self.sample_rate,
            blocksize=self.block_size,
            device=self.device,
            dtype="int16",
            channels=1,
            callback=callback,
        ):
            while not (cancelled and cancelled.is_set()):
                try:
                    yield audio_queue.get(timeout=0.1)
                except queue.Empty:
                    pass


class Speaker:
    def __init__(self, device: str | int | None):
        self.device = device

    def play_wav(self, audio: bytes, stop_requested: Event) -> bool:
        import numpy as np
        import sounddevice as sd

        with wave.open(BytesIO(audio), "rb") as wav:
            if wav.getcomptype() != "NONE":
                raise ValueError("O Piper retornou WAV comprimido não suportado.")
            channels = wav.getnchannels()
            width = wav.getsampwidth()
            sample_rate = wav.getframerate()
            frame_count = wav.getnframes()

            dtype_by_width = {1: "uint8", 2: "int16", 4: "int32"}
            dtype = dtype_by_width.get(width)
            if dtype is None:
                raise ValueError(f"Largura de amostra WAV não suportada: {width}")

            with sd.OutputStream(
                samplerate=sample_rate,
                device=self.device,
                dtype=dtype,
                channels=channels,
            ) as stream:
                remaining_frames = frame_count
                while remaining_frames and not stop_requested.is_set():
                    frames = wav.readframes(min(1024, remaining_frames))
                    samples = np.frombuffer(frames, dtype=dtype)
                    if channels > 1:
                        samples = samples.reshape(-1, channels)
                    stream.write(samples)
                    remaining_frames -= len(samples)

        return stop_requested.is_set()
