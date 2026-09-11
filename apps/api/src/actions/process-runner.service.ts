import { Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

@Injectable()
export class ProcessRunnerService {
  async run(executable: string, args: readonly string[]): Promise<void> {
    await execFileAsync(executable, [...args], {
      shell: false,
      windowsHide: true,
      timeout: 10_000,
    });
  }
}
