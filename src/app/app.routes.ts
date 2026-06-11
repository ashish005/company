import { Routes } from '@angular/router';
import {HomeView} from './views/home.view';
import {AboutView} from './views/about.view';
import {VisionView} from './views/vision.view';
import {WhyweView} from './views/whywe.view';
import {ContactView} from './views/contact.view';
import {PricingInfoView} from './views/pricing-info.view';
import {TrialBusinessView} from './views/trial.view';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeView, data: { title: 'Home - EnRator | Digital Transformation & IT Solutions' }},
  {path: 'about', component: AboutView, data: { title: 'About Us - EnRator | Our Company & Team' }},
  {path: 'vision', component: VisionView, data: { title: 'Vision & Mission - EnRator | Our Core Values' }},
  {path: 'whywe', component: WhyweView, data: { title: 'Why Choose Us - EnRator | Excellence & Expertise' }},
  {path: 'contact', component: ContactView, data: { title: 'Contact Us - EnRator | Get In Touch' }},
  {path: 'pricing', component: PricingInfoView, data: { title: 'Pricing - EnRator | Plans & Pricing' }},
  {path: 'trial', component: TrialBusinessView, data: { title: 'Free Trial - EnRator | Start Your Journey' }}
];
