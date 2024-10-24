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
      imageHeight: 500,
      imageSrc: 'https://placeimg.com/500/500/arch',
      title: 'Whats new in v1.0.0',
      html: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just.<br /><a href="http://google.com">test</a> ',
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
      imageSrc: 'https://placeimg.com/500/500/tech',
      text: 'Very interesting feature',
      button: {
        text: 'Got it',
        textColor: '#fff',
        bgColor: '#333',
        position: 'center',
      },
    },
    {
      imageSrc:
        'https://cdn0.iconfinder.com/data/icons/bakery-10/512/Donut-256.png',
      imageBgColor: '#333',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing el aspect et just. Spsum dolor sit amet, consectetur adipiscing el aspect et just.',
      imageHeight: 350,
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
