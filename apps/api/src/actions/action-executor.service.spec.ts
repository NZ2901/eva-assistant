import { ActionExecutorService } from './action-executor.service';

describe('ActionExecutorService', () => {
  it('opens only the allowlisted URL resolved by the action', async () => {
    const launcher = {
      openWebsite: jest.fn().mockResolvedValue(undefined),
      openEvaProject: jest.fn(),
    };
    const executor = new ActionExecutorService(launcher as never);

    await expect(
      executor.execute({ name: 'open_website', website: 'github' }),
    ).resolves.toEqual({ response: 'Abri o GitHub.' });
    expect(launcher.openWebsite).toHaveBeenCalledWith('github');
  });

  it('opens the fixed EVA project and confirms it', async () => {
    const launcher = {
      openWebsite: jest.fn(),
      openEvaProject: jest.fn().mockResolvedValue(undefined),
    };
    const executor = new ActionExecutorService(launcher as never);

    await expect(
      executor.execute({ name: 'open_vscode_project' }),
    ).resolves.toEqual({ response: 'Abri o projeto EVA no VS Code.' });
    expect(launcher.openEvaProject).toHaveBeenCalledTimes(1);
  });

  it('returns the current date and time without launching a process', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-11T15:30:45-03:00'));
    const launcher = { openWebsite: jest.fn(), openEvaProject: jest.fn() };
    const executor = new ActionExecutorService(launcher as never);

    await expect(
      executor.execute({ name: 'get_current_time' }),
    ).resolves.toEqual({ response: 'Agora são 11/09/2026, 15:30:45.' });
    expect(launcher.openWebsite).not.toHaveBeenCalled();
    expect(launcher.openEvaProject).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
