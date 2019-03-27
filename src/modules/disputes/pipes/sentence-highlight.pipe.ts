import { Pipe, PipeTransform } from '@angular/core';
import { Sentence } from '../models';

@Pipe({name: 'sentenceHighlight'})
export class SentenceHighLightPipe implements PipeTransform {
  transform(text: string, sentence: Sentence, issueId, sentenceId): string {
    if (issueId) {
      return sentence.issueIds.includes(issueId) ?
        `<span id="{{sentenceId}}" class="sentence-highlight">${text}</span>`
        : `<span class="no-highlight" >${text}</span>`;
    }
    return text;
  }
}
