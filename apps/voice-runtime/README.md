# EVA Voice Runtime

Listener local e independente do navegador. Ele usa Vosk offline para detectar
"EVA" e transcrever o comando, encaminha o texto à API existente e reproduz o
WAV gerado pelo Piper da API.

## Instalação (Ubuntu/WSL)

```bash
sudo apt update
sudo apt install python3-venv libportaudio2 portaudio19-dev unzip
cd apps/voice-runtime
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Baixe e extraia o modelo português pequeno `vosk-model-small-pt-0.3` da página
de modelos do Vosk: https://alphacephei.com/vosk/models

```bash
export EVA_VOSK_MODEL_PATH=/caminho/para/vosk-model-small-pt-0.3
export EVA_API_URL=http://127.0.0.1:3000
```

No Windows nativo, crie o ambiente com `py -m venv .venv`, ative com
`.venv\\Scripts\\activate` e use os mesmos nomes de variáveis (via `$env:` no
PowerShell). O pacote `sounddevice` instala o PortAudio junto com seu wheel.

## Execução

Primeiro inicie a API Nest normalmente, com `PIPER_MODEL_PATH` e, se necessário,
`PIPER_EXECUTABLE` configurados. Depois, em outro terminal:

```bash
cd apps/voice-runtime
source .venv/bin/activate
python -m eva_voice
```

Espere `state=idle`, diga **"EVA"**, faça uma pausa curta e diga o comando. Os
estados esperados são `idle`, `wake_detected`, `listening`, `processing` e
`speaking`. Durante `processing`, a captura do microfone fica fechada. Durante
`speaking`, uma gramática Vosk restrita aceita somente **"EVA, pare"**,
**"EVA, parar"** e **"EVA, pode parar"**; qualquer outra fala é ignorada e não é
enviada à API. Ao interromper ou terminar a reprodução, o runtime volta à escuta
normal da wake word.

Uma trava em `~/.eva/voice-runtime.lock` impede dois listeners simultâneos. O
arquivo pode permanecer após uma queda, mas a trava é liberada pelo sistema
operacional e não impede a próxima inicialização.

### Áudio no WSL

Em WSLg atualizado, entrada e saída aparecem via PulseAudio. Confira os devices:

```bash
python -m sounddevice
```

Se o default não for correto, configure `EVA_INPUT_DEVICE` e
`EVA_OUTPUT_DEVICE` com o índice ou nome mostrado. Se o microfone não aparecer no
WSL, rode o runtime no Python do Windows; a API ainda pode ficar no WSL e costuma
ser acessível por `http://localhost:3000`.

## Testes

Os testes não precisam de modelo nem hardware de áudio:

```bash
cd apps/voice-runtime
PYTHONPATH=. python -m unittest discover -s tests -v
```
