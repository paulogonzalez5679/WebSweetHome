import { TestBed } from '@angular/core/testing';

import { PayphoneService } from './payphone.service';

describe('PayphoneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayphoneService = TestBed.get(PayphoneService);
    expect(service).toBeTruthy();
  });
});
