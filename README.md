# ListingPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Setting up dev/testing environment locally

### Firebase Emulators
This project uses Firebase for data storage, and so devving against this DB should be done through local DB emulators.

#### 1. Download Firebase Emulator Suite and install all emulators
#### 2. Start emulators at project root
Run `npm run start-offlinedb` to start all emulators with ports specified in firebase.json
It is possible for emulators to crash during the dev process, in which case run `npm run clean-offlinedb` to clean up 
artefacts and prevent memory leaks

#### 3. Add user to Firebase Auth
Add username `test@test.test`, password `test1234!` to Firebase Auth. These are credentials to log in for dev environment.

#### 3. Add app-data collection and listing-data doc in Firestore
Browse the Firebase Emulator page (default is localhost:4000), add app-data as a new collection, add listing-data as a new doc. In listing-data, add 2 new arrays: locations and property-types.

#### 4. Run ng serve at project root and begin devving.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Service tests (**.service.spec.ts) are all integration tests that involve multiple services that interacts with Firebase. These have to be ran one by one, as they are async tests that may overlap. Run `ng test --include='**/[folder-name]/**.service.spec.ts'` to run individual tests.

## Deploying to Firebase
Run `npm run deploy -- -m [your comment]` to deploy to Firebase.