# ListingPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build.

## Setting up dev/testing environment locally

### Firebase Emulators
This project uses Firebase for data storage, and so devving against this DB should be done through local DB emulators
The local emulator will create `offline-db` folder to store its data

#### 1. Download Firebase Emulator Suite and install all emulators
#### 2. Start emulators at project root
Run `npm run start-db` to start all emulators with ports specified in firebase.json
It is possible for emulators to crash during the dev process due to unfinished development on Firebase's side, in which case run `npm run clean-db` to clean up artefacts and prevent memory leaks

#### 3. Add user to Firebase Auth
Browse the Firebase Emulator page (default is localhost:4000)
Add username `test@test.test`, password `test1234!` to Firebase Auth. These are credentials for dev environment.

#### 3. Add app-data collection and listing-data doc in Firestore
Go to Firestore, add `app-data` as a new collection, add `listing-data` as a new doc. In listing-data, add a new array: `locations`. It should look like this:
`app-data`: collection
|_`listing-data`: document
  |_`locations`: array

#### 4. Run ng serve at project root and begin devving.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Service tests (**.service.spec.ts) are all integration tests that involve multiple services that interacts with Firebase. These have to be ran one by one, as they are async tests that may overlap. Run `ng test --include='**/[folder-name]/**.spec.ts'` to run individual tests.

Example: `ng test --include='**/listing-upload/**.spec.ts'`

## Deploying to Firebase
Run `npm run deploy -- -m [your comment]` to deploy to Firebase.