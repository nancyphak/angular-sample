import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'empty-sentences',
  templateUrl: './empty-sentences.component.html',
  styleUrls: ['./empty-sentences.component.scss']
})
export class EmptySentencesComponent {

  @Output() addSentences = new EventEmitter();

  onAddSentencesBtnClick() {
    this.addSentences.emit();
  }

}
