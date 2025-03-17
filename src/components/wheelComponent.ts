import { type ItemState } from '../state/optionState';
import { BaseComponent, type Props } from './baseComponent';
import winSoundFile from '../assets/sound/win.mp3';
export interface Wheel extends Omit<Props<'canvas'>, 'tag'> {
  width: number;
  height: number;
  state: ItemState;
}

export class WheelComponent extends BaseComponent<'canvas'> {
  private readonly state: ItemState;
  private readonly ctx: CanvasRenderingContext2D;
  private colorPack: string[] = [];
  private addAngle: number = 0;
  private winSound: HTMLAudioElement;
  private soundEnabled: boolean = true;
  private radius: number = 200;

  constructor(p: Wheel) {
    super({
      tag: 'canvas',
      className: ['canvas'],
      ...p,
    });
    this.element.width = p.width;
    this.element.height = p.height;
    this.state = p.state;
    const contex = this.element.getContext('2d');
    if (!contex) {
      throw new Error('no ctx');
    }
    this.ctx = contex;
    this.getRandomColor(this.state.items.length);
    this.winSound = new window.Audio(winSoundFile);
    const sound = localStorage.getItem('xakse-sound');
    if (sound === 'true') {
      this.soundEnabled = true;
    } else {
      this.soundEnabled = false;
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 500) {
        this.updateSize(360, 150);
      } else {
        this.updateSize(500, 200);
      }
    });
  }

  private static easeInOutCubic(t: number): number {
    return t < 0.5 ? 16 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  public drawWheel(): void {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);

    const centerX = this.element.width / 2;
    const centerY = this.element.height / 2;
    let totalWeight = 0;
    for (const item of this.state.items) {
      if (item.text && item.weight > 0) {
        totalWeight += item.weight;
      }
    }

    let startAngle = Math.PI / 2 + this.addAngle;

    this.state.items.forEach((item, index) => {
      if (item.text && item.weight > 0) {
        const sliceAngle = (item.weight / totalWeight) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, this.radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fillStyle = this.colorPack[index];
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        const textAngle = startAngle + sliceAngle / 2;
        const textRadius = this.radius * 0.6;
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;

        const maxTextLength = 10;
        let displayText = item.text;
        this.ctx.font = '21px times new roman';
        if (item.text.length > maxTextLength) {
          displayText = item.text.slice(0, maxTextLength) + '...';
        }

        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';

        this.ctx.fillText(displayText, textX, textY);

        startAngle = endAngle;
      }
    });
    this.drawArrow();
  }

  public getSectorText(winLabel: HTMLElement): void {
    let targetAngle = (3 * Math.PI) / 2;
    let totalWeight = 0;
    for (const item of this.state.items) {
      if (item.text && item.weight > 0) {
        totalWeight += item.weight;
      }
    }
    let startAngle = (Math.PI / 2 + this.addAngle) % (2 * Math.PI);
    let foundText = '';

    for (const sector of this.state.items) {
      if (sector.text && sector.weight > 0) {
        const sectorAngle = (sector.weight / totalWeight) * 2 * Math.PI;
        let endAngle = (startAngle + sectorAngle) % (2 * Math.PI);
        const inRange =
          startAngle < endAngle && targetAngle >= startAngle && targetAngle <= endAngle;
        const outRange =
          startAngle > endAngle && (targetAngle >= startAngle || targetAngle <= endAngle);
        if (inRange || outRange) {
          foundText = sector.text;
        }
        startAngle = endAngle;
      }
    }
    winLabel.textContent = `winner: ${foundText}`;
  }

  public startSpin(winLabel: HTMLElement, duration: number = 9000): void {
    const startTime = performance.now();
    const randomRotation = (4 + Math.random() * 7) * 2 * Math.PI;

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const complet = Math.min(elapsed / duration, 1);
      const easedProgress = WheelComponent.easeInOutCubic(complet);

      this.addAngle = randomRotation * easedProgress;
      this.drawWheel();
      if (complet < 1) {
        this.getSectorText(winLabel);
        requestAnimationFrame(animate);
      } else {
        this.winSound.currentTime = 0;
        this.winSound.play();
      }
    };

    requestAnimationFrame(animate);
  }

  public stopWinSound(): void {
    if (!this.winSound.paused) {
      this.winSound.pause();
      this.winSound.currentTime = 0;
    }
  }

  public offSound(): void {
    this.stopWinSound();
    if (this.soundEnabled) {
      this.soundEnabled = false;
    } else {
      this.soundEnabled = true;
    }
    localStorage.setItem('xakse-sound', String(this.soundEnabled));
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  private getRandomColor(count: number): void {
    this.colorPack = [];
    const letters = '0123456789ABCDEF';
    for (let j = 0; j < count; j++) {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      this.colorPack.push(color);
    }
  }

  private drawArrow(): void {
    const centerX = this.element.width / 2;
    const centerY = this.element.height / 2 - this.radius + 5;

    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(centerX - 10, centerY - 20);
    this.ctx.lineTo(centerX + 10, centerY - 20);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  private updateSize(size: number, radius: number): void {
    this.element.width = size;
    this.element.height = size;
    this.radius = radius;
    this.drawWheel();
  }
}
