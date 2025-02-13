import { TestBed } from '@angular/core/testing';

import { TransactionpaymentService } from './transactionpayment.service';

describe('TransactionpaymentService', () => {
  let service: TransactionpaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionpaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
