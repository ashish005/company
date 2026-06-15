import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {SoftwarePrice} from "../domains/org-product-price.serializer";
import {PricingService} from "../services/business.service";
import {CommonModule} from '@angular/common';
import {BusinessLookup} from '../domains/lookup.serializer';

@Component({
  templateUrl: './templates/pricing-info.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [ PricingService ]
})
export class PricingInfoView implements OnInit {
    software: SoftwarePrice = new SoftwarePrice();
    public lookups: BusinessLookup = new BusinessLookup();
    activeSoftware: any;

    constructor(public router: Router, private pricingService: PricingService) {
        this.activeSoftware = this.lookups.softwares[0];
    }

    ngOnInit(){ this.fetchSectorDetails(); }

    showBySoftware(software: any){
        this.activeSoftware = software;
        //this.fetchSectorDetails();
    }

    fetchSectorDetails(){
        const success = (r: { data: SoftwarePrice })=>
        {
            this.software = new SoftwarePrice(r.data);
        };

        const failure = (r: any)=>{};

        this.pricingService.read(this.activeSoftware.code).subscribe(success, failure);
    }
}
