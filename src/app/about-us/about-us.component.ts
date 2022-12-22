import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Inquiry } from './about-us.data';
import { AboutUsService } from './about-us.service';

@Component({
    selector: 'about-us',
    templateUrl: 'about-us.component.html',
    styleUrls: ['./about-us.component.scss'],
    animations: [
        trigger('aboutUsAnim',
            [
                transition(':enter', [
                    query('.about-us-section, .about-us-section-mobile', style({ opacity: 0, transform: 'translateY(30vh)' })),
                    query('.contact-us-section', style({ opacity: 0, transform: 'translateY(30vh)' })),
                    query('.sign-up-for-newsletter', style({ opacity: 0, transform: 'translateY(30vh)' })),
                    query('.about-us-section, .about-us-section-mobile', animate(
                        '500ms ease-out',
                        style({ opacity: 1, transform: 'translate(0)' })
                    )),
                    query('.contact-us-section', animate(
                        '500ms 200ms ease-out',
                        style({ opacity: 1, transform: 'translate(0)' })
                    )),
                    query('.sign-up-for-newsletter', animate(
                        '500ms 400ms ease-out',
                        style({ opacity: 1, transform: 'translate(0)' })
                    ))
                ])
            ]
        )
    ]
})

export class AboutUsComponent implements OnInit {
    startYear = 2008;
    thisYear = (new Date()).getFullYear();
    tenure = this.thisYear - this.startYear;

    inquiry: Inquiry = {};
    inquiryForm!: UntypedFormGroup;
    submitInProgress: boolean = false;

    email!: string;

    constructor(
        private fb: UntypedFormBuilder,
        private aboutUs: AboutUsService,
        private translate: TranslateService,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.inquiryForm = this.fb.group({
            title: ['', Validators.required],
            contactMethod: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    async submitInquiry() {
        if (!this.inquiryForm.valid) {
            return;
        }

        this.submitInProgress = true;

        this.inquiry = {
            title: this.inquiryForm.value['title'],
            contactMethod: this.inquiryForm.value['contactMethod'],
            message: this.inquiryForm.value['message']
        }

        await this.aboutUs.submitInquiry(this.inquiry);

        const inquirySubmittedMsg = this.translate.instant("about_us.inquiry_submitted");
        this.snackbar.open(inquirySubmittedMsg, undefined, { duration: 1500 });

        this.inquiry = {};
        this.inquiryForm.reset();

        this.submitInProgress = false;
    }

    async submitEmail() {
        if (!this.email) {
            return;
        }

        await this.aboutUs.subscribeEmailToPromotion(this.email);

        this.email = '';

        const emailSubmitted = this.translate.instant("about_us.email_submitted");
        this.snackbar.open(emailSubmitted, undefined, { duration: 2000 });
    }

}