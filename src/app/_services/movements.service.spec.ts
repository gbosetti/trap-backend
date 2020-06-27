import { TestBed } from '@angular/core/testing';

import { MovementsService } from './movements.service';

describe('MovementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovementsService = TestBed.get(MovementsService);
    expect(service).toBeTruthy();
  });
});
