import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  HostListener,
  OnChanges,
  SimpleChanges,
  EventEmitter, Output
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdfjs-viewer.component.html',
  styleUrls: ['./pdfjs-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfJsViewerComponent implements OnChanges {
  @ViewChild('pageNum') pageNum;

  @Input() pdfSrc: string;
  @Output() pageChange = new EventEmitter();

  public loading = true;
  public numberOfPages: number;
  public currentPage = 1;
  public selectPage = false;
  public showControls = false;

  private viewerFingerprint = null;
  private viewerDocId = null;
  private pdfViewer: any;
  private timerSubscription: Subscription;

  constructor(private elRef: ElementRef) {
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.pdfSrc && this.pdfSrc) {
      this.loadPdf();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    this.showControls = true;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = timer(4000).subscribe(() => {
      this.showControls = false;
    });
  }

  public incrementZoom(): void {
    if (this.pdfViewer.currentScale < 2.0) {
      this.pdfViewer.currentScale += 0.1;
    }
  }

  public decrementZoom(): void {
    if (this.pdfViewer.currentScale > 0.2) {
      this.pdfViewer.currentScale -= 0.1;
    }
  }

  public incrementPage(): void {
    if (this.pdfViewer.currentPageNumber < this.pdfViewer.pagesCount) {
      this.pdfViewer.currentPageNumber += 1;
    }
  }

  public decrementPage(): void {
    if (this.pdfViewer.currentPageNumber > 1) {
      this.pdfViewer.currentPageNumber -= 1;
    }
  }

  private loadPdf() {
    this.loading = true;
    const PDFJS = (<any>window).pdfjsLib;
    const pdfJsViewer = (<any>window).pdfjsViewer;
    PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK;
    PDFJS.disableStream = true;

    const pdfLinkService = new pdfJsViewer.PDFLinkService();
    this.pdfViewer = new pdfJsViewer.PDFViewer({
      container: this.elRef.nativeElement.querySelector('div'),
      linkService: pdfLinkService,
      enhanceTextSelection: true
    });
    (<any>window).theViewer = this.pdfViewer;

    const docInitParams = {
      url: this.pdfSrc
    };

    const pdfLoadingTask = PDFJS.getDocument(docInitParams);

    pdfLoadingTask.then((doc) => {
      this.pdfViewer.setDocument(doc);
      pdfLinkService.setDocument(doc, this.pdfSrc);
      this.viewerFingerprint = doc.fingerprint;
      this.numberOfPages = doc.numPages;

      this.pdfViewer.eventBus.on('pagechange', evt => {
        this.viewerDocId = doc.loadingTask.docId;
        const fingerprint = evt.source.pdfDocument.fingerprint;
        const docId = evt.source.pdfDocument.loadingTask.docId;
        if (this.viewerFingerprint === fingerprint && this.viewerDocId === docId) {
          this.currentPage = evt.pageNumber;

          this.pageChange.emit(this.currentPage);
        }
      });
      this.pdfViewer.firstPagePromise.then(() => {
        this.loading = false;
        this.pdfViewer.currentScaleValue = 'page-width';
        this.pdfViewer.update();

      });
    })
      .catch((err) => {
        console.error(err);
      });

  }

  onSelectPage() {
    this.selectPage = true;
    this.pageNum.nativeElement.focus();
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.setSelectPage(event);
    }
  }

  onInput(event) {
    this.setSelectPage(event);
  }

  setSelectPage(event) {
    const value = parseInt(event.target.value, 0);
    if (!value || value > this.numberOfPages || value <= 0) {
      this.currentPage = this.pdfViewer.currentPageNumber;
      this.selectPage = false;
    } else {
      this.currentPage = value;
      this.pdfViewer.currentPageNumber = value;
      this.selectPage = false;
    }
  }
}
