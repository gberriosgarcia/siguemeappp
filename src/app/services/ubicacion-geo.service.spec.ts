import { TestBed } from '@angular/core/testing';

import { UbicacionGeoService } from './ubicacion-geo.service';

describe('UbicacionGeoService', () => {
  let service: UbicacionGeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionGeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
