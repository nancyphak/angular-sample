import {
  Component,
  AfterViewInit,
  Input,
  Renderer2,
  OnDestroy,
  OnChanges,
  EventEmitter,
  Output, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() topHeight = 100;
  @Input() topMinHeight = 100;
  @Input() bottomMinHeight = 100;
  @Input() separatorHeight = 18;

  @Output() drag = new EventEmitter();
  @Output() stopDrag = new EventEmitter();

  container;

  startY = 0;
  separator;
  topPane;
  gap: number;
  dragging = false;
  listenerMouseMove: () => void;
  listenerMouseUp: () => void;

  constructor(private renderer: Renderer2) {
  }

  ngOnDestroy() {
    if (this.listenerMouseUp) {
      this.listenerMouseUp();
    }
  }

  ngOnChanges() {
    this.setHeight(this.topHeight);
  }

  ngAfterViewInit() {
    this.separator = document.querySelector('.panes-separator');
    this.topPane = document.querySelector('.top-pane');

    this.renderer.listen(this.separator, 'mousedown', (event) => {
      const separatorTop = this.separator.getBoundingClientRect().top;
      this.gap = event.pageY - separatorTop;

      this.startDragging(event);

      this.drag.emit();
    });

    this.listenerMouseUp = this.renderer.listen('document', 'mouseup', () => {
      if (this.dragging) {
        this.dragging = false;

        if (this.listenerMouseMove) {
          this.listenerMouseMove();
        }

        this.stopDrag.emit(parseInt(this.topPane.style.height, 10));
      }
    });

    this.container = document.querySelector('.panes-container');
    this.setHeight(this.topHeight);
  }

  startDragging(event: any) {
    if (event.currentTarget instanceof HTMLElement || event.currentTarget instanceof SVGElement) {
      this.dragging = true;
      const top = this.separator.style.top ? parseInt(this.separator.style.top, 10) : 0;

      this.startY = event.pageY - top;

      this.listenerMouseMove = this.renderer.listen('document', 'mousemove', (mousemoveEvent) => {
        this.onDrag(mousemoveEvent.pageY);
      });
    } else {
      throw new Error('Your target must be an html element');
    }
  }

  onDrag(pageY: number) {
    pageY = pageY - (window.innerHeight - this.container.clientHeight) - this.gap;

    this.setHeight(pageY);
  }

  setHeight(topHeight: number) {
    const containerHeight = this.container.clientHeight;

    if (topHeight + this.separatorHeight + this.bottomMinHeight > containerHeight) {
      topHeight = containerHeight - this.bottomMinHeight - this.separatorHeight;
    }

    this.topPane.style.height = topHeight + 'px';
  }
}
