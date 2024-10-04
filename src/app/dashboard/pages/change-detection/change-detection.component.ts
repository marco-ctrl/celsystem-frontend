import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TitleComponent],
  template: `
    <app-title [title]="currentFrameWork()" />
    <pre>{{ frameWorkAsSignal() | json }}</pre>
    <pre>{{ frameWorkAsProperty | json }}</pre>
  `
  })
export default class ChangeDetectionComponent {

  public currentFrameWork = computed(
    () => `Change detection = ${this.frameWorkAsSignal().name}`
  );

  public frameWorkAsSignal = signal({
    name: 'Angular',
    releaseDate: 2016,
  });

  public frameWorkAsProperty = {
    name: 'Angular',
    releaseDate: 2016,
  };

  constructor() {
    setTimeout( () => {
      this.frameWorkAsSignal.update( value => {
        value.name = 'React';
        return {...value}
      })
    }, 3000);
  }
}
