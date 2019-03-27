import { AfterViewInit, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NetworkService } from '../../services';

@Directive({
  selector: '[disableButtonOffline]'
})
export class DisableButtonOfflineDirective implements AfterViewInit {

  constructor(private elRef: ElementRef,
              private renderer: Renderer2,
              private networkService: NetworkService) {
  }

  ngAfterViewInit() {
    if (this.elRef.nativeElement.disabled) {
      return;
    }
    this.networkService.isOnline.subscribe(status => {
      if (!status) {
        this.renderer.setAttribute(this.elRef.nativeElement, 'disabled', 'true');
      } else {
        this.renderer.removeAttribute(this.elRef.nativeElement, 'disabled');
      }
    });
  }

}
