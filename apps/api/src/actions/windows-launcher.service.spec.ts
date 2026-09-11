import { resolve } from 'node:path';

import { WindowsLauncherService } from './windows-launcher.service';

describe('WindowsLauncherService', () => {
  it('uses fixed process arguments to open an allowlisted URL in Windows', async () => {
    const runner = { run: jest.fn().mockResolvedValue(undefined) };
    const launcher = new WindowsLauncherService(runner as never);

    await launcher.openWebsite('youtube');

    expect(runner.run).toHaveBeenCalledWith('cmd.exe', [
      '/d',
      '/c',
      'start',
      '',
      'https://www.youtube.com',
    ]);
  });

  it('opens only the fixed EVA workspace with the VS Code WSL command', async () => {
    const runner = { run: jest.fn().mockResolvedValue(undefined) };
    const launcher = new WindowsLauncherService(runner as never);

    await launcher.openEvaProject();

    expect(runner.run).toHaveBeenCalledWith('code', [
      resolve(__dirname, '../../../../'),
    ]);
  });
});
