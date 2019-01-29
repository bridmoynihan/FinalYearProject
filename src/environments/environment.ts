// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: 'AIzaSyDyLJccEralB2m8DOsB3JxTAr34jBsD4ug',
    authDomain: 'stock-ify.com',
    databaseURL: 'https://final-year-project-8d5b4.firebaseio.com',
    projectId: 'final-year-project-8d5b4',
    storageBucket: 'final-year-project-8d5b4.appspot.com',
    messagingSenderId: '283632516454'
  }
};
