import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as currency from 'currency.js';
import * as fs from 'fs';

exports.customIndexHtml = functions.region('us-central1').https.onRequest(async (req, res) => {
    let indexHTML = fs.readFileSync('src/hosting/index.html', "utf-8").toString();

    const defaultDesc = 'Real estate services in District 7, Ho Chi Minh City';
    const companyName = 'Anh Nguyen Real Estate';
    const defaultLogo = 'https://anhnguyenre.com/assets/images/logo.png';
    const defaultUrl = 'https://anhnguyenre.com';

    let listing;
    const getOpenGraph = async (isListingDetailsPage: boolean) => {
        const defaultOg = `<meta property="og:title" content="${companyName}" />
                        <meta property="og:description" content="${defaultDesc}" />
                        <meta property="og:image" content="${defaultLogo}" />
                        <meta property="og:image:type" content="image/*">
                        <meta property="og:image:width" content="1200">
                        <meta property="og:image:height" content="600">
                        <meta property="og:url" content="${defaultUrl}" />`;
        if (!isListingDetailsPage) {
            return defaultOg;
        }

        const urlComponents = req.url.split('/');
        const listingID = urlComponents[urlComponents.length - 1];
        const doc = await admin.firestore().collection('listings').doc(listingID).get();
        if (!doc.exists) {
            return defaultOg;
        }

        listing = doc.data() as any;

        const VND = (value: number) => currency(value, { symbol: "đ", separator: ",", precision: 0 });
        const USD = (value: number) => currency(value, { symbol: "$", separator: ",", precision: 0 });

        let priceText = '';
        if (listing.currency === 'VND') {
            priceText = VND(listing['price']).format();
        } else if (listing.currency === 'USD') {
            priceText = USD(listing['price']).format();
        }

        let ogTitle = `${listing['purpose']}: `;
        const category = listing['category'];
        if (category !== 'Commercial') {
            ogTitle += `${listing['location']} ${category} - ${priceText}`;
        } else if (category === 'Commercial') {
            ogTitle += `${listing['location']} commercial property - ${priceText}`;
        } else {
            ogTitle += `${listing['location']} - ${priceText}`;
        }
       
        const ogDesc = `${listing['contactNumber']} - ${listing['contactPerson']} - ${companyName} `;
        const ogUrl = defaultUrl + req.url;

        await admin.storage().bucket().file(listing['coverImagePath']).makePublic();
        const coverImageUrl = admin.storage().bucket().file(listing['coverImagePath']).publicUrl();

        const ogImage = `${coverImageUrl}`;

        let og = `<meta property="og:type" content="website">`;
        og += `<meta property="og:title" content="${ogTitle}" /> `;
        og += `<meta property="og:description" content="${ogDesc || defaultDesc}" /> `;
        og += `<meta property="og:image" content="${ogImage || defaultLogo}" />
            <meta property="og:image:type" content="image/*" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="600" /> `;
        og += `<meta property="og:url" content="${ogUrl || defaultUrl}" /> `;
        return og;
    };

    const ogPlaceholder = '<meta name="functions-insert-dynamic-og">';
    const ogReplacement = await getOpenGraph(true);
    indexHTML = indexHTML.replace(ogPlaceholder, ogReplacement);

    const replaceKeywords = (htmlTemplate: string, listing: any): string => {
        const patternToReplace = `name="keywords" content="`;
        const replacement = `name="keywords" content="${listing['category']}, ${listing['location']}, `;
        return htmlTemplate.replace(patternToReplace, replacement);
    }
    if (listing) {
        indexHTML = replaceKeywords(indexHTML, listing);
    }

    res.set('Cache-Control', 'public, max-age=43200, s-maxage=86400');
    res.status(200).send(indexHTML);
});