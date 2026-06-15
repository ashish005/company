import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './templates/contact.html'
})
export class ContactView {
  contactForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate form submission
    setTimeout(() => {
      this.sendEmail();
      this.loading = false;
      this.contactForm.reset();
      this.submitted = false;
      alert('Message sent successfully! We will get back to you soon.');
    }, 1500);
  }

  sendEmail() {
    const formData = this.contactForm.value;
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    
    // Open email client with pre-filled data in new tab
    window.open(`mailto:info@enrator.com?subject=${subject}&body=${body}`, '_blank');
  }

  scheduleCall() {
    // Open Google Calendar invite for scheduling a call
    const title = encodeURIComponent('Schedule a Call with EnRator');
    const description = encodeURIComponent('Schedule a consultation call with our software development and consulting team.');
    const location = encodeURIComponent('Phone Call');
    const dates = encodeURIComponent(new Date().toISOString().replace(/-|:|\.\d+/g, '')) + '/' + encodeURIComponent(new Date(Date.now() + 3600000).toISOString().replace(/-|:|\.\d+/g, ''));
    const add = encodeURIComponent('info@enrator.com');
    
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&location=${location}&dates=${dates}&add=${add}`, '_blank');
  }

  sendDirectEmail() {
    window.open('mailto:info@enrator.com', '_blank');
  }

  getDirections() {
    // Open Google Maps with the office location
    window.open('https://maps.google.com/?q=Laxmi+Nagar+East+Delhi+110092+India', '_blank');
  }
}
