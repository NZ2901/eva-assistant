import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';

import { SpeechService } from './speech.service';
import { TextToSpeechNormalizer } from './text-to-speech-normalizer.service';

jest.mock('node:child_process', () => ({ spawn: jest.fn() }));
jest.mock('node:fs/promises', () => ({
  mkdtemp: jest.fn().mockResolvedValue('/tmp/eva-piper-test'),
  readFile: jest.fn().mockResolvedValue(Buffer.from('wav')),
  rm: jest.fn().mockResolvedValue(undefined),
}));

function mockPiperProcess() {
  const child = new EventEmitter() as EventEmitter & {
    stderr: EventEmitter & { setEncoding: jest.Mock };
    kill: jest.Mock;
  };
  child.stderr = Object.assign(new EventEmitter(), {
    setEncoding: jest.fn(),
  });
  child.kill = jest.fn();
  (spawn as unknown as jest.Mock).mockReturnValue(child);
  return child;
}

describe('SpeechService', () => {
  const piperEnvironmentVariables = [
    'PIPER_MODEL_PATH',
    'PIPER_LENGTH_SCALE',
    'PIPER_NOISE_SCALE',
    'PIPER_NOISE_W_SCALE',
    'PIPER_SPEAKER',
  ] as const;
  const originalEnvironment = Object.fromEntries(
    piperEnvironmentVariables.map((name) => [name, process.env[name]]),
  );

  beforeEach(() => {
    jest.clearAllMocks();
    for (const name of piperEnvironmentVariables) delete process.env[name];
    process.env.PIPER_MODEL_PATH = '/models/pt_BR-faber-medium.onnx';
  });

  afterAll(() => {
    for (const name of piperEnvironmentVariables) {
      const originalValue = originalEnvironment[name];
      if (originalValue === undefined) delete process.env[name];
      else process.env[name] = originalValue;
    }
  });

  it('passes text as a separate argument and returns the generated WAV', async () => {
    const piper = mockPiperProcess();
    const resultPromise = new SpeechService(
      new TextToSpeechNormalizer(),
    ).generateSpeech('Olá; $(id)');

    await new Promise((resolve) => setImmediate(resolve));

    expect(spawn).toHaveBeenCalledWith(
      'piper',
      [
        '-m',
        '/models/pt_BR-faber-medium.onnx',
        '-f',
        '/tmp/eva-piper-test/speech.wav',
        '--',
        'Olá; $(id)',
      ],
      expect.objectContaining({ shell: false }),
    );

    piper.emit('close', 0, null);

    await expect(resultPromise).resolves.toEqual(Buffer.from('wav'));
    expect(readFile).toHaveBeenCalledWith('/tmp/eva-piper-test/speech.wav');
  });

  it('passes configured native voice options to Piper', async () => {
    process.env.PIPER_LENGTH_SCALE = '0.9';
    process.env.PIPER_NOISE_SCALE = '0.7';
    process.env.PIPER_NOISE_W_SCALE = '0.85';
    process.env.PIPER_SPEAKER = '2';
    const piper = mockPiperProcess();

    const resultPromise = new SpeechService(
      new TextToSpeechNormalizer(),
    ).generateSpeech('Texto');

    await new Promise((resolve) => setImmediate(resolve));
    expect(spawn).toHaveBeenCalledWith(
      'piper',
      [
        '-m',
        '/models/pt_BR-faber-medium.onnx',
        '-f',
        '/tmp/eva-piper-test/speech.wav',
        '--length-scale',
        '0.9',
        '--noise-scale',
        '0.7',
        '--noise-w-scale',
        '0.85',
        '--speaker',
        '2',
        '--',
        'Texto',
      ],
      expect.objectContaining({ shell: false }),
    );

    piper.emit('close', 0, null);
    await expect(resultPromise).resolves.toEqual(Buffer.from('wav'));
  });

  it('terminates Piper when the request is aborted', async () => {
    const piper = mockPiperProcess();
    const controller = new AbortController();
    const resultPromise = new SpeechService(
      new TextToSpeechNormalizer(),
    ).generateSpeech('Texto', controller.signal);

    controller.abort();

    await expect(resultPromise).rejects.toThrow('cancelada');
    expect(piper.kill).toHaveBeenCalledWith('SIGTERM');
  });

  it('normalizes only the text passed to Piper', async () => {
    const piper = mockPiperProcess();
    const resultPromise = new SpeechService(
      new TextToSpeechNormalizer(),
    ).generateSpeech('Agora são 17:42.');

    await new Promise((resolve) => setImmediate(resolve));
    expect(spawn).toHaveBeenCalledWith(
      'piper',
      expect.arrayContaining(['Agora são cinco e quarenta e dois da tarde.']),
      expect.any(Object),
    );

    piper.emit('close', 0, null);
    await expect(resultPromise).resolves.toEqual(Buffer.from('wav'));
  });
});
