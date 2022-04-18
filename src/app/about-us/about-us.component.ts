import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Inquiry } from './about-us.data';
import { AboutUsService } from './about-us.service';

@Component({
    selector: 'about-us',
    templateUrl: 'about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})

export class AboutUsComponent implements OnInit {
    startYear = 2008;
    thisYear = (new Date()).getFullYear();
    tenure = this.thisYear - this.startYear;

    inquiry: Inquiry = {};
    inquiryForm!: FormGroup;

    submitInProgress: boolean = false;

    constructor(
        private fb: FormBuilder,
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

        const inquirySubmittedMsg = await lastValueFrom(this.translate.get("about_us.inquiry_submitted"));
        this.snackbar.open(inquirySubmittedMsg, undefined, { duration: 1500 });

        this.inquiry = {};
        this.inquiryForm.reset();

        this.submitInProgress = false;
    }

}