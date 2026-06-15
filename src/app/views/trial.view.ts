import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { TrialBusinessService} from "../services";
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BusinessLookup} from '../domains/lookup.serializer';
import {pairwise, startWith} from 'rxjs';

@Component({
  templateUrl: './templates/trial.html',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule]
})
export class TrialBusinessView implements OnInit {
    customForm: FormGroup;
    submitted: boolean = false;
    businessTypes: Array<any> = [];
    termsAccepted: boolean = false;

    successResp: any;
    lookup: BusinessLookup = new BusinessLookup();
    constructor(private formBuilder: FormBuilder, private businessService: TrialBusinessService) {
      this.customForm = this.formBuilder.group({
            contactPersonEmail: [null, [Validators.required, Validators.email]],
            contactPersonName: [null, Validators.required],
            contactPersonMobile: [null, Validators.required],
            softwareCode: [null, Validators.required],
            businessTypeCode: [null, Validators.required]
        });
    }

    get formSoftware() { return <FormControl>this.customForm.get('softwareId'); }

    get formSoftwareCode() { return <FormControl>this.customForm.get('softwareCode'); }
    get formBusinessTypeCode() { return <FormControl>this.customForm.get('businessTypeCode'); }

    //get formBusinessType(){ return <FormControl>this.customForm.get('orgBusinessTypeId'); }

    ngOnInit(): void {
      // Scroll to top when page loads
      window.scrollTo(0, 0);

      const formItemChange=([prev, next]: [any, any])=>
      {
        if(prev != next)
        {
          const { businessTypes } = this.lookup.softwares.find(s => s.code == next) || { businessTypes: []};
          this.businessTypes = businessTypes || [{ id: null }];
          this.formBusinessTypeCode.setValue(this.businessTypes[0].code);
        }
      };
      //const control = <FormControl>this.customForm.get('softwareId');
      this.formSoftwareCode.valueChanges.pipe(startWith(null), pairwise()).subscribe(formItemChange);
    }

    /*updateSoftware(val){
        this.formSoftware.setValue(val);
        this.formBusinessType.reset();
        this.businessTypes = this.apiResolver.masterType.softwares.find(r => r.id == val).businessTypes;
        if(this.businessTypes.length == 1){
            this.formBusinessType.setValue(this.businessTypes[0].id);
        }
    }*/

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    onSubmit(customForm: any) {
        if (customForm.invalid) {
          return;
        }
        this.submitted = true;

        // Send email immediately with trial details
        this.sendTrialEmail();

        /*const performAction = (resp: any)=> {
            this.submitted = false;
            this.successResp = resp;
        };

        const failure = ()=> {
            this.submitted = false;
            this.successResp = null;
        };

        const formValues = customForm.getRawValue();
        formValues.origin = location.host;
        this.businessService.create(formValues).subscribe(performAction, failure);*/
    }

    sendTrialEmail() {
        const formData = this.customForm.value;
        const subject = encodeURIComponent('New Trial Registration - ' + formData.contactPersonName);
        const body = encodeURIComponent(
            `TRIAL REGISTRATION DETAILS\n\n` +
            `PERSONAL INFORMATION:\n` +
            `Name: ${formData.contactPersonName}\n` +
            `Email: ${formData.contactPersonEmail}\n` +
            `Mobile: ${formData.contactPersonMobile}\n\n` +
            `SOFTWARE SELECTION:\n` +
            `Software: ${formData.softwareCode}\n` +
            `Business Type: ${formData.businessTypeCode}\n\n` +
            `Origin: ${location.host}\n\n` +
            `Registration Date: ${new Date().toLocaleString()}`
        );

        // Open email client with pre-filled data in new tab
        window.open(`mailto:info@enrator.com?subject=${subject}&body=${body}`, '_blank');
    }
}
