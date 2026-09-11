import { Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PIPER_TIMEOUT_MS = 60_000;

@Injectable()
export class SpeechService {
  async generateSpeech(text: string, signal?: AbortSignal): Promise<Buffer> {
    const modelPath = process.env.PIPER_MODEL_PATH;

    if (!modelPath) {
      throw new Error('PIPER_MODEL_PATH não está configurado.');
    }

    const temporaryDirectory = await mkdtemp(join(tmpdir(), 'eva-piper-'));
    const outputPath = join(temporaryDirectory, 'speech.wav');

    try {
      await this.runPiper(text, modelPath, outputPath, signal);
      return await readFile(outputPath);
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  }

  private runPiper(
    text: string,
    modelPath: string,
    outputPath: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const executable = process.env.PIPER_EXECUTABLE || 'piper';
      const child = spawn(
        executable,
        ['-m', modelPath, '-f', outputPath, '--', text],
        { shell: false, stdio: ['ignore', 'ignore', 'pipe'] },
      );
      let stderr = '';
      let settled = false;

      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        signal?.removeEventListener('abort', abort);
        error ? reject(error) : resolve();
      };
      const abort = () => {
        child.kill('SIGTERM');
        finish(new Error('Síntese de voz cancelada.'));
      };
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        finish(new Error('Piper excedeu o tempo limite de execução.'));
      }, PIPER_TIMEOUT_MS);

      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk: string) => {
        stderr = (stderr + chunk).slice(-4_096);
      });
      child.once('error', (error) => finish(error));
      child.once('close', (code, terminationSignal) => {
        if (code === 0) {
          finish();
          return;
        }

        const detail = stderr.trim() || terminationSignal || `código ${code}`;
        finish(new Error(`Piper falhou: ${detail}`));
      });

      if (signal?.aborted) {
        abort();
        return;
      }

      signal?.addEventListener('abort', abort, { once: true });
    });
  }
}
