import { Injectable } from '@nestjs/common';

import type { ActionRequest, ActionResult, Website } from './action.types';
import { WindowsLauncherService } from './windows-launcher.service';

@Injectable()
export class ActionExecutorService {
  constructor(private readonly launcher: WindowsLauncherService) {}

  async execute(action: ActionRequest): Promise<ActionResult> {
    switch (action.name) {
      case 'open_website':
        await this.launcher.openWebsite(action.website);
        return { response: `Abri o ${this.websiteLabel(action.website)}.` };
      case 'get_current_time':
        return {
          response: `Agora são ${new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'America/Sao_Paulo',
          }).format(new Date())}.`,
        };
      case 'open_vscode_project':
        await this.launcher.openEvaProject();
        return { response: 'Abri o projeto EVA no VS Code.' };
    }
  }

  private websiteLabel(website: Website): string {
    return website === 'github'
      ? 'GitHub'
      : website === 'youtube'
        ? 'YouTube'
        : 'Google';
  }
}
