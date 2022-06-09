import * as admin from "firebase-admin";
admin.initializeApp();

const listing = require('./listing');
exports.listing = listing;

const inquiry = require('./inquiry');
exports.inquiry = inquiry;

const customIndexHtml = require('./custom-index-html');
exports.customIndexHtml = customIndexHtml.customIndexHtml;

const propertyManagement = require('./property-management');
exports.propertyManagement = propertyManagement;

const activities = require('./activities');
exports.activities = activities;
