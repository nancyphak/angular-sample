import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pleading, Sentence, Response } from '../../../models';

@Component({
  selector: 'paragraph-view',
  templateUrl: './paragraph-view.component.html',
  styleUrls: ['./paragraph-view.component.scss']
})
export class ParagraphViewComponent {

  @Input() paragraph: Pleading;
  @Input() paragraphSideKickView: boolean;
  @Input() issueId: string;
  @Output() addSentenceToIssue: EventEmitter<any> = new EventEmitter();

  public messageTooltip = '';

  getSelectionText(sentences: Sentence[], response: Response) {
    if (!window.getSelection || !this.issueId) {
      return;
    }
    const data = {
      issueId: this.issueId,
      paragraphId: this.paragraph.id,
      disputeId: this.paragraph.disputeId
    };
    let sentenceIdStart = '';
    let sentenceIdEnd = '';

    if (window.getSelection().anchorNode.parentElement.id) {
      sentenceIdStart = window.getSelection().anchorNode.parentElement.id;
      sentenceIdEnd = window.getSelection().focusNode.parentElement.id;
    } else {
      sentenceIdStart = window.getSelection().anchorNode.parentElement.parentElement.id;
      sentenceIdEnd = window.getSelection().focusNode.parentElement.parentElement.id;

    }

    const arraySentenceId = sentences.map(x => x.id);
    const indexStart = arraySentenceId.indexOf(sentenceIdStart);
    let indexEnd = arraySentenceId.indexOf(sentenceIdEnd);

    if (indexStart === indexEnd) {
      return this.selectSentence(sentences, response, indexStart, data);
    }

    if (sentenceIdEnd === '') {
      if (window.getSelection().anchorNode.parentElement.id) {
        sentenceIdEnd = window.getSelection().focusNode.parentElement.parentElement.id;
      } else {
        sentenceIdEnd = window.getSelection().focusNode.parentElement.id;
      }
      indexEnd = arraySentenceId.indexOf(sentenceIdEnd);
    }
    for (let i = 0; i < sentences.length; i++) {
      if (indexStart <= i && i <= indexEnd && !sentences[i].issueIds.includes(this.issueId)) {
        this.selectSentence(sentences, response, i, data);
      }
      if (indexStart >= i && i >= indexEnd && !sentences[i].issueIds.includes(this.issueId)) {
        this.selectSentence(sentences, response, i, data);
      }
    }
  }

  selectSentence(sentences, response, indexStart, data) {
    const sentenceIds = [];
    sentenceIds.push(sentences[indexStart].id);
    const sentence = sentences[indexStart];
    this.addSentenceToIssue.emit({
      ...data,
      sentenceIds: sentenceIds,
      response: response,
      sentence: sentence
    });
  }

  onHoverSentence(event: MouseEvent) {
    if (event.srcElement.firstElementChild === null) {
      this.messageTooltip = 'Click to add to selected issue';
    } else {
      this.messageTooltip = 'Click to reomve from selected issue';
    }
  }
}
