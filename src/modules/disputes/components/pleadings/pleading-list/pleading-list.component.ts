import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { Pleading } from '../../../models';

@Component({
  selector: 'pleading-list',
  templateUrl: './pleading-list.component.html',
  styleUrls: ['./pleading-list.component.scss']
})
export class PleadingListComponent implements OnChanges {

  @Input() pleadings: Array<Pleading>;

  copyPleadings: Array<Pleading>;

  ngOnChanges() {
    if (!this.pleadings) {
      return;
    }
    this.copyPleadings = _.cloneDeep(this.pleadings);
    this.copyPleadings.forEach((pleading) => {
      pleading.concatedSentences = '';
      pleading.sentences.forEach(sentence => {
        pleading.concatedSentences += sentence.text + ' ';
      });

      pleading.responses.forEach(response => {
        response.concatedSentences = '';
        response.sentences.forEach(sentence => {
          response.concatedSentences += sentence.text + ' ';
        });
      });
    });
  }
}
