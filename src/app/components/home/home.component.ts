import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchCriteria } from 'src/app/listing-search/listing-search.data';
import { Listing } from "src/app/listing-card/listing-card.data";
import { HomeService } from './home.service';
import { PropertySizes } from 'src/app/listing-search/listing-search.data';
import { DOCUMENT } from '@angular/common';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { SwiperOptions } from 'swiper';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('searchBarAnim',
            [
                transition(':enter', [
                    query('mat-card', style({ opacity: 0, transform: 'translateY(30vh)' })),
                    query('mat-card', animate(
                        '500ms ease-out',
                        style({ opacity: 1, transform: 'translateY(0)' })
                    ))
                ])
            ]
        ),
        trigger('featuredListingsAnim',
            [
                transition(':enter', [
                    query('.featured-listings-container', style({ opacity: 0, transform: 'translateY(30vh)' })),
                    query('.featured-listings-container', animate(
                        '500ms 200ms ease-out',
                        style({ opacity: 1, transform: 'translateY(0)' })
                    ))
                ])
            ]
        )
    ]
})
export class HomeComponent implements OnInit {
    numberOfMockListings = Array(3).fill(0);
    featuredListings!: Listing[];

    searchCriteria: SearchCriteria = {
        purpose: 'For Rent'
    } as SearchCriteria;

    propertySizes = PropertySizes;

    config: SwiperOptions = {
        spaceBetween: 15,
        effect: "slide",
        slidesPerView: 1,
        autoplay: {
            pauseOnMouseEnter: false,
            delay: 3000
        },
        pagination: {
            dynamicBullets: true,
            el: '.swiper-pagination',
            clickable: false
        }
    };

    isDesktop: boolean = true;

    constructor(
        private router: Router,
        private homeService: HomeService,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    ngOnInit(): void {
        const width = this.document.defaultView ? this.document.defaultView.innerWidth : 0;
        const mobileDevicesWidth = 600;
        this.isDesktop = width > mobileDevicesWidth;

        this.homeService.getFeaturedListings().then(listings => {
            this.featuredListings = listings;
        });

        logEvent(getAnalytics(), 'home_page_view', {
            from_mobile: !this.isDesktop
        });
    }

    getListings() {
        this.router.navigate(['/listings'], { queryParams: this.searchCriteria });
    }

    findListingsForRent() {
        this.searchCriteria.purpose = 'For Rent';
    }

    findListingsForSale() {
        this.searchCriteria.purpose = 'For Sale';
    }

    onCategorySelect() {
        if (this.searchCriteria.category === 'Commercial') {
            this.searchCriteria.bedrooms = '';
            this.searchCriteria.bathrooms = '';
            this.searchCriteria.propertySize = '';
        } else {
            this.searchCriteria.propertySize = '';
        }
    }

    getListing(id: string | undefined) {
        if (!id) {
            return;
        }
        const url = this.router.serializeUrl(
            this.router.createUrlTree([`listings/details/${id}`])
        );
        window.open(url, '_blank');
    }

    removeListing(listing: Listing) {
        this.featuredListings = this.featuredListings.filter(featured => featured.id !== listing.id);
    }
}