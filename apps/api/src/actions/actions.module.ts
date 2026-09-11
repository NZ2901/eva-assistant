import { Module } from '@nestjs/common';

import { ActionExecutorService } from './action-executor.service';
import { ActionResolverService } from './action-resolver.service';
import { ProcessRunnerService } from './process-runner.service';
import { WindowsLauncherService } from './windows-launcher.service';

@Module({
  providers: [
    ActionResolverService,
    ActionExecutorService,
    ProcessRunnerService,
    WindowsLauncherService,
  ],
  exports: [ActionResolverService, ActionExecutorService],
})
export class ActionsModule {}
