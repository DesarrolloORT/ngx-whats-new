import { Component } from '@angular/core';
import { ModalWindow } from 'projects/ngx-whats-new/src/lib/modal-window.interface';
import { Options } from 'projects/ngx-whats-new/src/lib/options.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDialogVisible = true;

  options: Options = {
    disableClose: true,
    customStyle: {
      width: '500px',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px 5px #999',
    },
  };

  modals: ModalWindow[] = [
    {
      title: 'Whats new in v1.0.0',
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a> ',
      image: {
        height: 500,
        src: 'https://placeimg.com/500/500/arch',
        altText:
          'In v1.0.0, lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: {
        text: 'Okay',
        textColor: '#fff',
        bgColor: '#333',
        position: 'center',
      },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just',
      button: {
        text: 'Got it!',
        textColor: '#fff',
        bgColor: '#333',
        position: 'center',
      },
    },
    {
      image: {
        src: 'https://placeimg.com/500/500/nature',
        height: 500,
        altText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      text: 'Very interesting feature',
      button: {
        text: 'Got it',
        textColor: '#fff',
        bgColor: '#333',
        position: 'center',
      },
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just.',
      image: {
        src: 'https://cdn0.iconfinder.com/data/icons/bakery-10/512/Donut-256.png',
        bgColor: '#333',
        height: 350,
        altText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.',
      },
      button: {
        text: 'Lets go',
        position: 'center',
        textColor: '#fff',
        bgColor: '#333',
      },
    },
  ];

  showDialog(): void {
    this.isDialogVisible = true;
  }

  closeDialog(): void {
    this.isDialogVisible = false;
  }
}
