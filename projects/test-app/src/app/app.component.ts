import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  DialogOptions,
  NavigationEvent,
  WhatsNewItem,
} from 'projects/ngx-whats-new/src/lib/interfaces';
import { NgxWhatsNewComponent } from 'projects/ngx-whats-new/src/lib/ngx-whats-new.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgxWhatsNewComponent],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('whatsnew') private readonly modal?: NgxWhatsNewComponent;

  /** Options for the modal */
  public options: DialogOptions = { 
    enableKeyboardNavigation: true, 
    clickableNavigationDots: true,  
    disableSwipeNavigation: false,
    disableClose: false
  };

  /** Modals to show */
  public modals: WhatsNewItem[] = [
    {
      title: 'Whats new in v1.0.0',
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a>',
      image: {
        src: 'https://picsum.photos/500',
        altText: 'In v1.0.0, lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: { text: 'Okay', position: 'center' },
    },
    {
      title: { 
        content: '🚀 Enhanced Performance', 
        style: { 
          color: '#4CAF50', 
          fontSize: 'x-large', 
          fontWeight: 'bold',
          textAlign: 'center'
        } 
      },
      text: { 
        content: 'Experience lightning-fast loading times and smoother interactions. Our optimized engine delivers 50% better performance.',
        style: { 
          fontSize: 'medium', 
          textAlign: 'center', 
          color: '#2E7D32',
          lineHeight: '1.6',
          backgroundColor: '#E8F5E8',
          padding: '1rem',
          borderRadius: '8px'
        }
      },
      button: { 
        text: 'Amazing!', 
        position: 'center', 
        style: { 
          backgroundColor: '#4CAF50', 
          color: '#fff', 
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '20px'
        } 
      },
    },
    {
      image: {
        src: 'https://picsum.photos/500/500',
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      text: 'Very interesting feature',
      button: { text: 'Got it', position: 'center', style:{ backgroundColor: '#ff4081', color: '#fff', fontWeight: 'bold' } },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just.',
      image: {
        src: 'https://cdn0.iconfinder.com/data/icons/bakery-10/512/Donut-256.png',
        background: '#333',
        objectFit: 'contain',
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: { text: 'Lets go', position: 'center' },
    },
  ];

  ngAfterViewInit(): void {
    this.openDialog();
  }

  public openDialog(): void {
    this.modal?.open();
  }

  public onOpen(): void {
    console.log('Dialog opened');
  }

  public onClose(): void {
    console.log('Dialog closed');
  }

  public onCompleted(): void {
    console.log('Dialog completed');
  }

  public onNavigation($event: NavigationEvent) {
    console.info('Previous item:', $event.previousItem);
    console.info('Current item:', $event.currentItem);
  }
}
