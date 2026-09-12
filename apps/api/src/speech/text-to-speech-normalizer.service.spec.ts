import { TextToSpeechNormalizer } from './text-to-speech-normalizer.service';

describe('TextToSpeechNormalizer', () => {
  const normalizer = new TextToSpeechNormalizer();

  it.each([
    ['Agora são 17:42.', 'Agora são cinco e quarenta e dois da tarde.'],
    ['São 08:05.', 'São oito e cinco da manhã.'],
    ['É 01:30.', 'É uma e meia da manhã.'],
  ])('normalizes the time in %s', (input, expected) => {
    expect(normalizer.normalize(input)).toBe(expected);
  });

  it('removes Markdown and replaces URLs without discarding link labels', () => {
    expect(
      normalizer.normalize(
        '## Veja **a documentação** em [nosso site](https://example.com/uma/url/muito/longa?x=1).',
      ),
    ).toBe('Veja a documentação em nosso site.');
    expect(
      normalizer.normalize('Acesse https://example.com/caminho/enorme?q=1.'),
    ).toBe('Acesse link.');
  });

  it('turns hyphen-prefixed numbered items into spoken ordinals', () => {
    const result = normalizer.normalize(
      '- 1 Abra o aplicativo\n- 2 Clique em configurações\n- 3 Escolha a opção',
    );

    expect(result).toBe(
      'Primeiro, abra o aplicativo. Segundo, clique em configurações. Terceiro, escolha a opção.',
    );
    expect(result).not.toContain('menos dois');
    expect(result).not.toContain('- 2');
  });

  it('turns dot and parenthesis numbered lists into spoken ordinals', () => {
    expect(
      normalizer.normalize(
        '1. Abra o aplicativo\n2) Clique em configurações\n3. Escolha a opção',
      ),
    ).toBe(
      'Primeiro, abra o aplicativo. Segundo, clique em configurações. Terceiro, escolha a opção.',
    );
  });

  it('supports spoken ordinals through ten', () => {
    expect(normalizer.normalize('9. Revise\n10) Confirme')).toBe(
      'Nono, revise. Décimo, confirme.',
    );
  });

  it('removes simple bullet markers and keeps pauses between items', () => {
    expect(
      normalizer.normalize(
        '- Abra o aplicativo\n- Clique em configurações\n* Confirme',
      ),
    ).toBe('Abra o aplicativo. Clique em configurações. Confirme.');
  });

  it('removes Markdown heading markers and adds natural pauses', () => {
    expect(normalizer.normalize('## Configuração\n### Próximos passos')).toBe(
      'Configuração. Próximos passos.',
    );
  });

  it('replaces fenced code with a short spoken notice', () => {
    expect(
      normalizer.normalize(
        'Use este exemplo:\n```ts\nconst total = itens.length;\nconsole.log(total);\n```\nDepois, salve o arquivo.',
      ),
    ).toBe(
      'Use este exemplo: Há um exemplo de código na tela. Depois, salve o arquivo.',
    );
  });

  it('removes inline code backticks while preserving pronounceable content', () => {
    expect(normalizer.normalize('Use o comando `npm start`.')).toBe(
      'Use o comando npm start.',
    );
  });

  it('does not unnecessarily change ordinary text', () => {
    expect(normalizer.normalize('Posso ajudar você hoje.')).toBe(
      'Posso ajudar você hoje.',
    );
  });

  it('adds conservative pauses to a dry introductory phrase', () => {
    expect(normalizer.normalize('Claro João posso fazer isso')).toBe(
      'Claro, João, posso fazer isso',
    );
  });
});
