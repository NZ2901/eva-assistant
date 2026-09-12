from pathlib import Path
from threading import Event
import unittest

from eva_voice.config import VoiceConfig
from eva_voice.runtime import VoiceRuntime


class FakeMicrophone:
    def chunks(self, cancelled=None):
        return iter([b"audio"])


class FakeRecognizer:
    def __init__(self, command: str, stop_results=None):
        self.command = command
        self.stop_results = iter(stop_results or [False])
        self.wake_calls = 0

    def wait_for_wake_word(self, chunks):
        next(chunks)
        self.wake_calls += 1

    def transcribe_command(self, chunks, start_timeout, command_timeout):
        next(chunks)
        return self.command

    def wait_for_stop_command(self, chunks, cancelled):
        next(chunks, None)
        return next(self.stop_results)


class FakeApi:
    def __init__(self):
        self.messages = []

    def chat(self, message):
        self.messages.append(message)
        return "Resposta da EVA"

    def speech(self, text):
        return b"wav"


class FakeSpeaker:
    def __init__(self, on_play=None):
        self.played = []
        self.on_play = on_play

    def play_wav(self, audio, stop_requested: Event):
        self.played.append(audio)
        if self.on_play:
            self.on_play(stop_requested)
        return stop_requested.is_set()


class VoiceRuntimeTest(unittest.TestCase):
    def config(self):
        return VoiceConfig(model_path=Path("."))

    def test_complete_voice_cycle_uses_api_and_speaker(self):
        recognizer = FakeRecognizer("abra o youtube")
        api = FakeApi()
        speaker = FakeSpeaker()
        logs = []
        runtime = VoiceRuntime(
            self.config(), FakeMicrophone(), recognizer, api, speaker, logs.append
        )

        self.assertTrue(runtime.run_once())
        self.assertEqual(api.messages, ["abra o youtube"])
        self.assertEqual(speaker.played, [b"wav"])
        self.assertEqual(
            [line.split()[1] for line in logs],
            [
                "state=idle",
                "state=wake_detected",
                "state=listening",
                "state=processing",
                "state=speaking",
            ],
        )
        self.assertNotIn("speech_interrupted", " ".join(logs))

    def test_empty_command_returns_to_idle_without_api_call(self):
        api = FakeApi()
        logs = []
        runtime = VoiceRuntime(
            self.config(), FakeMicrophone(), FakeRecognizer(""), api, FakeSpeaker(), logs.append
        )

        self.assertFalse(runtime.run_once())
        self.assertEqual(api.messages, [])
        self.assertIn("state=idle detail=command_timeout", logs[-1])

    def test_stop_command_interrupts_speech_and_returns_to_idle(self):
        logs = []
        runtime = VoiceRuntime(
            self.config(),
            FakeMicrophone(),
            FakeRecognizer("conte uma história", [True]),
            FakeApi(),
            FakeSpeaker(lambda stop: stop.wait(1)),
            logs.append,
        )

        self.assertTrue(runtime.run_once())
        self.assertEqual(logs[-1], "[voice] state=idle detail=speech_interrupted")

    def test_irrelevant_speech_does_not_interrupt_playback(self):
        logs = []
        speaker = FakeSpeaker()
        runtime = VoiceRuntime(
            self.config(),
            FakeMicrophone(),
            FakeRecognizer("responda", [False]),
            FakeApi(),
            speaker,
            logs.append,
        )

        self.assertTrue(runtime.run_once())
        self.assertEqual(speaker.played, [b"wav"])
        self.assertNotIn("speech_interrupted", " ".join(logs))

    def test_multiple_cycles_do_not_leave_runtime_stuck(self):
        logs = []
        recognizer = FakeRecognizer("responda", [True, False, True])
        speaker = FakeSpeaker(lambda stop: stop.wait(1))
        runtime = VoiceRuntime(
            self.config(), FakeMicrophone(), recognizer, FakeApi(), speaker, logs.append
        )

        self.assertTrue(runtime.run_once())
        self.assertTrue(runtime.run_once())
        self.assertTrue(runtime.run_once())
        self.assertEqual(len(speaker.played), 3)
        self.assertEqual(
            logs.count("[voice] state=idle detail=speech_interrupted"), 2
        )


if __name__ == "__main__":
    unittest.main()
