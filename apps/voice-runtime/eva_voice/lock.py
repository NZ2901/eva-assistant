from __future__ import annotations

import os
from pathlib import Path
from typing import IO


class AlreadyRunningError(RuntimeError):
    pass


class InstanceLock:
    """Non-blocking process lock that works on Linux/WSL and Windows."""

    def __init__(self, path: Path):
        self.path = path
        self._file: IO[str] | None = None

    def acquire(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        lock_file = self.path.open("a+", encoding="utf-8")
        try:
            if os.name == "nt":
                import msvcrt

                lock_file.seek(0)
                if lock_file.read(1) == "":
                    lock_file.write(" ")
                    lock_file.flush()
                lock_file.seek(0)
                msvcrt.locking(lock_file.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl

                fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except (BlockingIOError, OSError) as error:
            lock_file.close()
            raise AlreadyRunningError(
                "Já existe uma instância do listener de voz da EVA em execução."
            ) from error

        lock_file.seek(0)
        lock_file.truncate()
        lock_file.write(str(os.getpid()))
        lock_file.flush()
        self._file = lock_file

    def release(self) -> None:
        if not self._file:
            return
        try:
            if os.name == "nt":
                import msvcrt

                self._file.seek(0)
                msvcrt.locking(self._file.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                import fcntl

                fcntl.flock(self._file.fileno(), fcntl.LOCK_UN)
        finally:
            self._file.close()
            self._file = None

    def __enter__(self) -> "InstanceLock":
        self.acquire()
        return self

    def __exit__(self, *_: object) -> None:
        self.release()
