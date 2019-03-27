import { StorageService } from './storage.service';
import { SplashScreenService } from './splash-screen.service';
import { NetworkService } from './network.service';

export {
  StorageService,
  SplashScreenService,
  NetworkService
};

export const services: Array<any> = [
  StorageService,
  SplashScreenService,
  NetworkService
];


