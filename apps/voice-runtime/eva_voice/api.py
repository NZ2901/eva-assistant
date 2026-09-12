from __future__ import annotations

import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class EvaApiError(RuntimeError):
    pass


class EvaApiClient:
    def __init__(self, base_url: str, timeout_seconds: float):
        self.base_url = base_url.rstrip("/")
        self.timeout_seconds = timeout_seconds

    def chat(self, message: str) -> str:
        payload = self._post_json("/conversation", {"message": message})
        response = payload.get("message")
        if not isinstance(response, str) or not response.strip():
            raise EvaApiError("A API retornou uma resposta de conversa inválida.")
        return response

    def speech(self, text: str) -> bytes:
        return self._post("/speech", {"text": text}, accept="audio/wav")

    def _post_json(self, path: str, payload: dict[str, str]) -> dict[str, object]:
        raw = self._post(path, payload, accept="application/json")
        try:
            value = json.loads(raw)
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise EvaApiError("A API retornou JSON inválido.") from error
        if not isinstance(value, dict):
            raise EvaApiError("A API retornou um payload inválido.")
        return value

    def _post(self, path: str, payload: dict[str, str], accept: str) -> bytes:
        request = Request(
            f"{self.base_url}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Accept": accept},
            method="POST",
        )
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                return response.read()
        except HTTPError as error:
            detail = error.read(1024).decode("utf-8", errors="replace")
            raise EvaApiError(f"API respondeu HTTP {error.code}: {detail}") from error
        except (URLError, TimeoutError) as error:
            raise EvaApiError(f"Não foi possível acessar a API em {self.base_url}: {error}") from error
