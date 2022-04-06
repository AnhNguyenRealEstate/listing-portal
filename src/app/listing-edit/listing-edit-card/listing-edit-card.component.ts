import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Listing } from 'src/app/listing-search/listing-search.data';
import { LoadSpinnerService } from 'src/app/load-spinner/load-spinner.service';
import { ConfirmationDialogComponent } from '../confirmation/confirmation-dialog.component';
import { ListingEditService } from '../listing-edit/listing-edit.service';

@Component({
    selector: 'listing-edit-card',
    templateUrl: 'listing-edit-card.component.html',
    styleUrls: ['listing-edit-card.component.scss']
})

export class ListingEditCardComponent implements OnInit {
    @Input() listing!: Listing;
    @Input() mode!: 'desktop' | 'mobile';
    @Output() listingDeleted = new EventEmitter<boolean>();

    snackbarMsgs!: any;
    coverImageUrl!: string;

    constructor(
        private storage: Storage,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        public listingEditService: ListingEditService,
        private loadingSpinnerService: LoadSpinnerService,
        private translate: TranslateService) { }

    async ngOnInit() {
        this.snackbarMsgs = await lastValueFrom(this.translate.get(
            ['listing_edit.delete_msg', 'listing_edit.dismiss_msg']
        ));

        this.coverImageUrl = await getDownloadURL(ref(this.storage, this.listing.coverImagePath));
    }

    async archiveListing(event: Event, id: string) {
        event.stopPropagation();

        this.loadingSpinnerService.start();
        await this.listingEditService.archiveListing(id);
        this.loadingSpinnerService.stop();
    }

    async unarchiveListing(event: Event, id: string) {
        event.stopPropagation();

        this.loadingSpinnerService.start();
        await this.listingEditService.unarchiveListing(id);
        this.loadingSpinnerService.stop();
    }

    async featureListing(event: Event, id: string) {
        event.stopPropagation();

        this.loadingSpinnerService.start();
        await this.listingEditService.featureListing(id);
        this.loadingSpinnerService.stop();
    }

    async unfeatureListing(event: Event, id: string) {
        event.stopPropagation();

        this.loadingSpinnerService.start();
        await this.listingEditService.unfeatureListing(id);
        this.loadingSpinnerService.stop();
    }

    /* Completely remove the listing from DB */
    async deleteListing(event: Event, listing: Listing) {
        const langTerms = await lastValueFrom(this.translate.get([
            "listing_edit.confirmation_msg", "listing_edit.yes_msg", "listing_edit.no_msg"]));

        event.stopPropagation();

        this.dialog.open(ConfirmationDialogComponent, {
            height: '20%',
            width: '100%',
            data: {
                message: langTerms['listing_edit.confirmation_msg'],
                yesBtnText: langTerms['listing_edit.yes_msg'],
                noBtnText: langTerms['listing_edit.no_msg']
            }
        }).afterClosed().subscribe(async (toDelete) => {
            if (toDelete) {
                this.listingEditService.deleteListing(listing, listing.id!);
                this.listingDeleted.emit(true);

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