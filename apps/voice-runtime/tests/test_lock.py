from pathlib import Path
import tempfile
import unittest

from eva_voice.lock import AlreadyRunningError, InstanceLock


class InstanceLockTest(unittest.TestCase):
    def test_rejects_second_listener(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "voice.lock"
            first = InstanceLock(path)
            second = InstanceLock(path)
            first.acquire()
            try:
                with self.assertRaises(AlreadyRunningError):
                    second.acquire()
            finally:
                first.release()

            second.acquire()
            second.release()


if __name__ == "__main__":
    unittest.main()
