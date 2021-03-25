import { Injectable } from '@angular/core';
import { SampleDetail } from '../../models/sample';
import { SampleService } from '../../services/samples/sample.service';
import { CrudDetailViewModel } from '../crud/crud-detail-view-model';
import { SamplesViewModel } from './samples-view-model';

@Injectable()
export class SampleDetailViewModel extends CrudDetailViewModel<SampleDetail> {
  get samplesForm() {
    return this.samplesViewModel.form;
  }

  constructor(
    protected samplesViewModel: SamplesViewModel,
    protected crudService: SampleService
  ) {
    super();
    this.init(samplesViewModel);
  }
}