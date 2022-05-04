import { Clipboard } from '@angular/cdk/clipboard';
import { Component, createNgModuleRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { LoginService } from '../components/login/login.service';
import { Listing } from '../listing-search/listing-search.data';
import { ListingCardService } from './listing-card.service';

@Component({
    selector: 'listing-card',
    templateUrl: 'listing-card.component.html',
    styleUrls: ['./listing-card.component.scss']
})

export class ListingCardComponent implements OnInit, OnDestroy {
    @Input() listing!: Listing;
    @Output() delete = new EventEmitter();

    @ViewChild('confirmationDialog') confirmationDialogTemplate!: TemplateRef<string>;

    coverImageUrl: string = '';
    shareListingBtnTitle: string = '';

    showControls: boolean = false;
    subs: Subscription = new Subscription();

    snackbarMsgs!: any;

    constructor(
        private storage: Storage,
        private clipboard: Clipboard,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private login: LoginService,
        private injector: Injector,
        public listingCard: ListingCardService,
        public translate: TranslateService) { }

    async ngOnInit() {
        getDownloadURL(ref(this.storage, this.listing.coverImagePath)).then(url => {
            this.coverImageUrl = url;
        });

        this.subs.add(this.login.loggedIn$.subscribe(isLoggedIn => {
            this.showControls = isLoggedIn;
        }));

        this.snackbarMsgs = await lastValueFrom(this.translate.get(
            ['listing_edit.delete_msg', 'listing_edit.dismiss_msg']
        ));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    async getShareableLink(e: Event) {
        e.stopPropagation();

        if (!this.listing) {
            return;
        }

        this.clipboard.copy(`${window.location.host}/listings/details/${this.listing.id}`);
        this.snackbar.open(
            await lastValueFrom(this.translate.get('listing_card.link_copied')),
            undefined,
            {
                duration: 1000
            })
    }

    showListing() {
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`listings/details/${this.listing.id}`])
        );
        window.open(url, '_blank');
    }

    async editListing(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                listing: this.listing,
                isEditMode: true
            }
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadComponent = moduleRef.instance.getListingUploadComponent();

        this.dialog.open(listingUploadComponent, config);
    }

    async editListingMobile(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                listing: this.listing,
                isEditMode: true
            }
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadDialogComponent = moduleRef.instance.getListingUploadDialogComponent();

        this.dialog.open(listingUploadDialogComponent, config);
    }

    async cloneListing(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                listing: this.listing,
                isEditMode: false
            }
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadComponent = moduleRef.instance.getListingUploadComponent();

        this.dialog.open(listingUploadComponent, config);
    }

    async cloneListingMobile(event: Event) {
        event.stopPropagation();

        const config = {
            height: '90%',
            width: '100%',
            autoFocus: false,
            data: {
                listing: this.listing,
                isEditMode: false
            }
        } as MatDialogConfig;

        const { ListingUploadModule } = await import("src/app/listing-upload/listing-upload.module");
        const moduleRef = createNgModuleRef(ListingUploadModule, this.injector);
        const listingUploadDialogComponent = moduleRef.instance.getListingUploadDialogComponent();

        this.dialog.open(listingUploadDialogComponent, config);
    }

    async deleteListing(event: Event) {
        event.stopPropagation();

        event.stopPropagation();

        this.dialog.open(this.confirmationDialogTemplate, {
            height: '20%',
            width: '100%'
        }).afterClosed().subscribe((toDelete: boolean) => {
            if (toDelete) {
                this.listingCard.deleteListing(this.listing);
                this.delete.emit();

                this.snackbar.open(
                    this.snackbarMsgs['listing_edit.delete_msg'],
                    this.snackbarMsgs['listing_edit.dismiss_msg'],
                    {
                        duration: 3000
                    }
                );
            }
        });
    }
}