import { BaseComponent } from '../components/baseComponent';
import { ButtonComponent } from '../components/buttonComponent';
import { WheelComponent } from '../components/wheelComponent';
import { router } from '../other/routerchet';
import { itemState } from '../state/optionState';
import './wheel.scss';
import soundOn from '../assets/svg/soundOn.svg';
import soundOff from '../assets/svg/soundOff.svg';

export class Wheel extends BaseComponent<'div'> {
  private readonly state = itemState;
  constructor() {
    super({
      className: ['baraban'],
    });

    this.state.load('xakse');

    const wheel = new WheelComponent({
      className: ['sad'],
      width: 500,
      height: 500,
      state: this.state,
    });

    const back = new ButtonComponent({
      className: ['button'],
      text: 'back',
      onClick: (): void => {
        wheel.stopWinSound();
        router.go('/slots');
      },
    });

    const soundButton = new ButtonComponent({
      className: ['button-sound'],
      onClick: (): void => {
        wheel.offSound();
        updateSoundButton();
      },
    });

    const updateSoundButton = (): void => {
      soundButton.element.style.backgroundImage = `url(${wheel.isSoundEnabled() ? soundOn : soundOff})`;
    };

    updateSoundButton();

    const winLabel = new BaseComponent({
      className: ['win-label'],
      text: 'spin to win',
    });

    const time = new BaseComponent({ tag: 'input', className: ['input-item', 'input-time'] });
    time.element.type = 'number';
    time.element.placeholder = 'spining time';
    time.element.setCustomValidity('Value must be greater than or equal to 5!');

    const spinButton = new ButtonComponent({
      className: ['button'],
      onClick: (): void => {
        if (Number(time.element.value) < 5) {
          time.element.reportValidity();
          return;
        }
        wheel.stopWinSound();
        wheel.startSpin(winLabel.element, Number(time.element.value) * 1000);
      },
      text: 'spin',
    });

    wheel.drawWheel();

    const buttonContainer = new BaseComponent({ className: ['button-container'] });
    buttonContainer.append(back, spinButton, soundButton);

    this.append(buttonContainer, time, winLabel, wheel);
  }
}
