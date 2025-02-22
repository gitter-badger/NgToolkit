import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/translation.module';

@Component({
  selector: 'app-translation-sample',
  templateUrl: './translation-sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationSampleComponent implements OnInit {
  get welcomeMessage() {
    return this.translationService.modules.translationSample.welcomeMessage;
  }

  constructor(protected translationService: TranslationService) {}

  ngOnInit(): void {}
}
