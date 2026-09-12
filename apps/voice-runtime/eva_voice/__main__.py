from __future__ import annotations

import sys

from .api import EvaApiClient
from .audio import Microphone, Speaker
from .config import VoiceConfig
from .lock import AlreadyRunningError, InstanceLock
from .recognizer import VoskRecognizer
from .runtime import VoiceRuntime


def main() -> int:
    try:
        config = VoiceConfig.from_env()
        config.validate()
        with InstanceLock(config.lock_path):
            runtime = VoiceRuntime(
                config=config,
                microphone=Microphone(config.sample_rate, config.block_size, config.input_device),
                recognizer=VoskRecognizer(
                    str(config.model_path), config.sample_rate, config.wake_word
                ),
                api=EvaApiClient(config.api_url, config.request_timeout_seconds),
                speaker=Speaker(config.output_device),
            )
            runtime.run_forever()
        return 0
    except (ValueError, AlreadyRunningError) as error:
        print(f"[voice] startup_error detail={error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
