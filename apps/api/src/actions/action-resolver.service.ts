import { Injectable } from '@nestjs/common';

import type { ActionRequest, Website } from './action.types';

@Injectable()
export class ActionResolverService {
  resolve(message: string): ActionRequest | null {
    const normalized = message
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    if (
      /\b(que horas|hora agora|horas agora|data e hora|data hora)\b/.test(
        normalized,
      )
    ) {
      return { name: 'get_current_time' };
    }

    if (
      /\b(abra|abrir|abre|inicie|iniciar)\b/.test(normalized) &&
      /\b(vscode|vs code|visual studio code)\b/.test(normalized) &&
      /\b(eva|projeto|workspace)\b/.test(normalized) &&
      !/\b(outro|outra)\b/.test(normalized)
    ) {
      return { name: 'open_vscode_project' };
    }

    const asksToOpen = /\b(abra|abrir|abre|acesse|acessar|va para)\b/.test(
      normalized,
    );

    if (asksToOpen) {
      for (const website of ['youtube', 'github', 'google'] as Website[]) {
        if (new RegExp(`\\b${website}\\b`).test(normalized)) {
          return { name: 'open_website', website };
        }
      }
    }

    return null;
  }
}
