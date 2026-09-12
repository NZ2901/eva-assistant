from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path
from urllib.parse import urlparse


def _positive_float(name: str, default: float) -> float:
    value = float(os.getenv(name, default))
    if value <= 0:
        raise ValueError(f"{name} deve ser maior que zero.")
    return value


@dataclass(frozen=True)
class VoiceConfig:
    model_path: Path
    api_url: str = "http://127.0.0.1:3000"
    wake_word: str = "eva"
    sample_rate: int = 16_000
    block_size: int = 4_000
    input_device: str | int | None = None
    output_device: str | int | None = None
    command_timeout_seconds: float = 12.0
    speech_start_timeout_seconds: float = 5.0
    request_timeout_seconds: float = 120.0
    retry_seconds: float = 3.0
    lock_path: Path = Path.home() / ".eva" / "voice-runtime.lock"

    @classmethod
    def from_env(cls) -> "VoiceConfig":
        model = os.getenv("EVA_VOSK_MODEL_PATH")
        if not model:
            raise ValueError("EVA_VOSK_MODEL_PATH não está configurado.")

        api_url = os.getenv("EVA_API_URL", "http://127.0.0.1:3000").rstrip("/")
        parsed = urlparse(api_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("EVA_API_URL deve ser uma URL HTTP(S) válida.")

        def device(name: str) -> str | int | None:
            value = os.getenv(name)
            if value is None or not value.strip():
                return None
            return int(value) if value.isdigit() else value

        return cls(
            model_path=Path(model).expanduser().resolve(),
            api_url=api_url,
            wake_word=os.getenv("EVA_WAKE_WORD", "eva").strip().lower(),
            sample_rate=int(os.getenv("EVA_SAMPLE_RATE", "16000")),
            block_size=int(os.getenv("EVA_AUDIO_BLOCK_SIZE", "4000")),
            input_device=device("EVA_INPUT_DEVICE"),
            output_device=device("EVA_OUTPUT_DEVICE"),
            command_timeout_seconds=_positive_float("EVA_COMMAND_TIMEOUT", 12.0),
            speech_start_timeout_seconds=_positive_float(
                "EVA_SPEECH_START_TIMEOUT", 5.0
            ),
            request_timeout_seconds=_positive_float("EVA_REQUEST_TIMEOUT", 120.0),
            retry_seconds=_positive_float("EVA_RETRY_SECONDS", 3.0),
            lock_path=Path(
                os.getenv("EVA_VOICE_LOCK_PATH", str(Path.home() / ".eva" / "voice-runtime.lock"))
            ).expanduser(),
        )

    def validate(self) -> None:
        if not self.model_path.is_dir():
            raise ValueError(f"Modelo Vosk não encontrado: {self.model_path}")
        if not self.wake_word:
            raise ValueError("EVA_WAKE_WORD não pode ser vazia.")
        if self.sample_rate <= 0 or self.block_size <= 0:
            raise ValueError("Sample rate e block size devem ser positivos.")
