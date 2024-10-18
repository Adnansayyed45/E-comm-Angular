import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Handle form submission
  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      // If form is invalid, show validation errors
      return;
    }

    // If the form is valid, submit the data to Formspree
    const formData = this.contactForm.value;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('name', formData.name);
    body.set('email', formData.email);
    body.set('mobileNumber', formData.mobileNumber);
    body.set('lastName', formData.lastName);
    body.set('message', formData.message);

    this.http
      .post('https://formspree.io/f/xdkooywy', body.toString(), {
        headers: headers,
      })
      .subscribe({
        next: () => {
          // Handle success
          this.successMessage = 'Message sent successfully!';
          this.errorMessage = '';
          this.contactForm.reset(); // Reset the form after success
          this.submitted = false;
        },
        error: () => {
          // Handle error
          this.errorMessage = 'Failed to send message. Please try again later.';
          this.successMessage = '';
        },
      });
  }
}
