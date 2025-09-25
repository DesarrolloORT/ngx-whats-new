import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// Individual animation triggers
export const modalEntryAnimation = trigger('modalAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.3)',
      filter: 'blur(10px)',
    }),
    group([
      animate(
        '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        style({
          transform: 'scale(1)',
        })
      ),
      animate(
        '300ms ease-out',
        style({
          opacity: 1,
          filter: 'blur(0px)',
        })
      ),
    ]),
  ]),
  transition(':leave', [
    group([
      animate(
        '200ms ease-in',
        style({
          transform: 'scale(0.8)',
          opacity: 0,
        })
      ),
      animate(
        '150ms ease-in',
        style({
          filter: 'blur(5px)',
        })
      ),
    ]),
  ]),
]);

export const contentTransitionAnimation = trigger('contentAnimation', [
  transition('* => *', [
    style({
      opacity: 0,
      transform: 'scale(0.95) translateY(10px)',
    }),
    animate(
      '300ms ease-out',
      style({
        opacity: 1,
        transform: 'scale(1) translateY(0)',
      })
    ),
  ]),
]);

export const imageAnimation = trigger('imageAnimation', [
  state(
    'loading',
    style({
      opacity: 0,
      transform: 'scale(1.05)',
      filter: 'blur(3px)',
    })
  ),
  state(
    'loaded',
    style({
      opacity: 1,
      transform: 'scale(1)',
      filter: 'blur(0)',
    })
  ),
  transition('loading => loaded', animate('400ms ease-out')),
]);

// Complete animation set
export const ngxWhatsNewAnimations = [
  modalEntryAnimation,
  contentTransitionAnimation,
  imageAnimation
];