import { ActionResolverService } from './action-resolver.service';

describe('ActionResolverService', () => {
  const resolver = new ActionResolverService();

  it.each([
    ['Abra o YouTube', { name: 'open_website', website: 'youtube' }],
    ['acesse o GitHub', { name: 'open_website', website: 'github' }],
    ['Vá para o Google', { name: 'open_website', website: 'google' }],
    ['Que horas são agora?', { name: 'get_current_time' }],
    ['Abra o projeto EVA no VS Code', { name: 'open_vscode_project' }],
  ])('resolves %s', (message, expected) => {
    expect(resolver.resolve(message)).toEqual(expected);
  });

  it.each([
    'Abra https://example.com',
    'Execute rm -rf /',
    'Gosto de vídeos no YouTube',
    'Abra o VS Code em outro projeto',
  ])('rejects unsupported or non-action input: %s', (message) => {
    expect(resolver.resolve(message)).toBeNull();
  });
});
