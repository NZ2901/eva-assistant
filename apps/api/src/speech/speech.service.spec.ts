import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';

import { SpeechService } from './speech.service';

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
  const originalModelPath = process.env.PIPER_MODEL_PATH;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PIPER_MODEL_PATH = '/models/pt_BR-faber-medium.onnx';
  });

  afterAll(() => {
    if (originalModelPath === undefined) {
      delete process.env.PIPER_MODEL_PATH;
    } else {
      process.env.PIPER_MODEL_PATH = originalModelPath;
    }
  });

  it('passes text as a separate argument and returns the generated WAV', async () => {
    const piper = mockPiperProcess();
    const resultPromise = new SpeechService().generateSpeech('Olá; $(id)');

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

  it('terminates Piper when the request is aborted', async () => {
    const piper = mockPiperProcess();
    const controller = new AbortController();
    const resultPromise = new SpeechService().generateSpeech(
      'Texto',
      controller.signal,
    );

    controller.abort();

    await expect(resultPromise).rejects.toThrow('cancelada');
    expect(piper.kill).toHaveBeenCalledWith('SIGTERM');
  });
});
