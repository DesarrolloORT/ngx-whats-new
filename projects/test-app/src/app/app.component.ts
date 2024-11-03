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
})
export class AppComponent implements AfterViewInit {
  @ViewChild('whatsNew') private readonly modal?: NgxWhatsNewComponent;

  /** Options for the modal */
  public options: DialogOptions = {
    enableKeyboardNavigation: true,
    clickableNavigationDots: true,
  };

  /** Modals to show */
  public modals: WhatsNewItem[] = [
    {
      title: 'Whats new in v1.0.0',
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a> ',
      image: {
        src: 'https://picsum.photos/500',
        altText: 'In v1.0.0, lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: {
        text: 'Okay',
        position: 'center',
      },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just',
      button: {
        text: 'Got it!',
        position: 'center',
      },
    },
    {
      image: {
        src: 'https://picsum.photos/500/500',
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      text: 'Very interesting feature',
      button: {
        text: 'Got it',
        position: 'center',
      },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just.',
      image: {
        src: 'https://cdn0.iconfinder.com/data/icons/bakery-10/512/Donut-256.png',
        background: '#333',
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: {
        text: 'Lets go',
        position: 'center',
      },
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

  public onNavigation($event: NavigationEvent) {
    console.info('Previous item:', $event.previousItem);
    console.info('Current item:', $event.currentItem);
  }
}
