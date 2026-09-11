import { Injectable } from '@nestjs/common';
import { resolve } from 'node:path';

import type { Website } from './action.types';
import { WEBSITE_URLS } from './action.types';
import { ProcessRunnerService } from './process-runner.service';

@Injectable()
export class WindowsLauncherService {
  private readonly projectPath = resolve(__dirname, '../../../../');

  constructor(private readonly processRunner: ProcessRunnerService) {}

  openWebsite(website: Website): Promise<void> {
    return this.processRunner.run('cmd.exe', [
      '/d',
      '/c',
      'start',
      '',
      WEBSITE_URLS[website],
    ]);
  }

  openEvaProject(): Promise<void> {
    return this.processRunner.run('code', [this.projectPath]);
  }
}
