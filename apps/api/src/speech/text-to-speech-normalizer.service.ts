import { Injectable } from '@nestjs/common';

const SMALL_NUMBERS = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quin' + 'ze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
];

const TENS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
];

const LIST_ORDINALS: Record<number, string> = {
  1: 'Primeiro',
  2: 'Segundo',
  3: 'Terceiro',
  4: 'Quarto',
  5: 'Quinto',
  6: 'Sexto',
  7: 'Sétimo',
  8: 'Oitavo',
  9: 'Nono',
  10: 'Décimo',
};

const CODE_BLOCK_MESSAGE = 'Há um exemplo de código na tela.';

@Injectable()
export class TextToSpeechNormalizer {
  normalize(text: string): string {
    if (!text.trim()) return text;

    return this.addNaturalPauses(
      this.normalizeNumbers(this.normalizeTimes(this.cleanMarkdown(text))),
    )
      .replace(/[ \t]+/g, ' ')
      .replace(/([.!?;:]?) *\n+ */g, (_, punctuation: string) =>
        punctuation ? `${punctuation} ` : '. ',
      )
      .replace(/\.\s*\.(?:\s*\.)*/g, '.')
      .trim();
  }

  private numberToWords(value: number): string {
    if (value < 20) return SMALL_NUMBERS[value];
    const unit = value % 10;
    return (
      TENS[Math.floor(value / 10)] + (unit ? ' e ' + SMALL_NUMBERS[unit] : '')
    );
  }

  private hourToWords(hour: number): string {
    if (hour === 1) return 'uma';
    if (hour === 2) return 'duas';
    return this.numberToWords(hour);
  }

  private normalizeTimes(text: string): string {
    return text.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (_, h, m) => {
      const hour = Number(h);
      const minute = Number(m);
      const spokenHour =
        hour === 0
          ? 'meia-noite'
          : hour === 12
            ? 'meio-dia'
            : this.hourToWords(hour > 12 ? hour - 12 : hour);
      const spokenMinute =
        minute === 0
          ? ''
          : minute === 30
            ? ' e meia'
            : ' e ' + this.numberToWords(minute);
      const period =
        hour === 0 || hour === 12
          ? ''
          : hour < 12
            ? ' da manhã'
            : hour < 18
              ? ' da tarde'
              : ' da noite';

      return spokenHour + spokenMinute + period;
    });
  }

  private cleanMarkdown(text: string): string {
    const fence = String.fromCharCode(96).repeat(3);
    let cleaned = text
      .replace(
        new RegExp(fence + '[\\s\\S]*?' + fence, 'g'),
        CODE_BLOCK_MESSAGE,
      )
      .replace(new RegExp(fence + '[\\s\\S]*$', 'g'), CODE_BLOCK_MESSAGE)
      .replace(/^\s*(?:[-+*]\s+)?(10|[1-9])[.)]\s+(.+)$/gm, (_, n, item) =>
        this.spokenNumberedItem(Number(n), item),
      )
      .replace(/^\s*[-+*]\s+(10|[1-9])\s+(.+)$/gm, (_, n, item) =>
        this.spokenNumberedItem(Number(n), item),
      )
      .replace(/^\s*[-+*]\s+(.+)$/gm, (_, item) =>
        this.ensureSentencePause(item),
      )
      .replace(/^\s{0,3}#{1,6}\s+(.+)$/gm, (_, heading) =>
        this.ensureSentencePause(heading),
      )
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<https?:\/\/[^>]+>/gi, 'link')
      .replace(/https?:\/\/[^\s<]+/gi, (url) => {
        const punctuation = url.match(/[.,!?;:)]+$/)?.[0] ?? '';
        return 'link' + punctuation;
      })
      .replace(/^\s*>\s?/gm, '')
      .replace(/<[^>]+>/g, '')
      .replace(new RegExp(String.fromCharCode(96), 'g'), '')
      .replace(/[*_~#]/g, '');

    cleaned = cleaned.replace(/\n(?=\s*\n)/g, '.');
    return cleaned;
  }

  private spokenNumberedItem(number: number, item: string): string {
    const content = item.replace(
      /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ])(?=[a-záéíóúâêôãõç])/u,
      (letter) => letter.toLocaleLowerCase('pt-BR'),
    );
    return this.ensureSentencePause(`${LIST_ORDINALS[number]}, ${content}`);
  }

  private ensureSentencePause(text: string): string {
    const trimmed = text.trim();
    return /[.!?;:]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  }

  private addNaturalPauses(text: string): string {
    const introductions =
      /^(Claro|Certo|Sim|Não|Tudo bem|Sem problema|Com certeza)\s+(?![,.;:!?])/i;
    let normalized = text.replace(introductions, '$1, ');

    normalized = normalized.replace(
      /^(Claro|Certo|Sim|Não),\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç'-]+)\s+(?=[a-záéíóúâêôãõç])/,
      '$1, $2, ',
    );
    return normalized;
  }

  private normalizeNumbers(text: string): string {
    return text.replace(/\b(\d+)\s*%/g, (_, value) => {
      const number = Number(value);
      const spokenNumber = number < 100 ? this.numberToWords(number) : value;
      return spokenNumber + ' por cento';
    });
  }
}
