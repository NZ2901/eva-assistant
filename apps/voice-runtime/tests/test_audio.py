from io import BytesIO
import sys
from threading import Event
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import wave

from eva_voice.audio import Speaker


def wav_bytes(frame_count=2048):
    output = BytesIO()
    with wave.open(output, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(16000)
        wav.writeframes(b"\0\0" * frame_count)
    return output.getvalue()


class FakeOutputStream:
    def __init__(self, stop_requested=None, **_kwargs):
        self.stop_requested = stop_requested
        self.writes = 0
        self.closed = False

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        self.closed = True

    def write(self, _samples):
        self.writes += 1
        if self.stop_requested:
            self.stop_requested.set()


class FakeSamples:
    def __init__(self, frames):
        self.length = len(frames) // 2

    def __len__(self):
        return self.length

    def reshape(self, frame_count, _channels):
        self.length = frame_count
        return self


class SpeakerTest(unittest.TestCase):
    def play(self, stop_requested, stream):
        fake_sounddevice = SimpleNamespace(OutputStream=lambda **kwargs: stream)
        fake_numpy = SimpleNamespace(frombuffer=lambda frames, dtype: FakeSamples(frames))
        with patch.dict(
            sys.modules,
            {"sounddevice": fake_sounddevice, "numpy": fake_numpy},
        ):
            interrupted = Speaker(None).play_wav(wav_bytes(), stop_requested)
        return interrupted

    def test_plays_all_audio_and_closes_stream(self):
        stop_requested = Event()
        stream = FakeOutputStream()

        self.assertFalse(self.play(stop_requested, stream))
        self.assertEqual(stream.writes, 2)
        self.assertTrue(stream.closed)

    def test_stops_after_current_block_and_closes_stream(self):
        stop_requested = Event()
        stream = FakeOutputStream(stop_requested)

        self.assertTrue(self.play(stop_requested, stream))
        self.assertEqual(stream.writes, 1)
        self.assertTrue(stream.closed)


if __name__ == "__main__":
    unittest.main()
