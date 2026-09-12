# eva-assistant
An AI-powered personal assistant inspired by virtual assistants from science fiction, built with TypeScript, NestJS and modern AI technologies.

## Runtime local de voz

O listener independente do navegador está em
[`apps/voice-runtime`](apps/voice-runtime/README.md). Ele detecta a wake word
"EVA", transcreve localmente com Vosk, usa o fluxo existente da API/BrainService
e reproduz a resposta gerada pelo Piper.
