# Supporters
![Atatus](http://dmc1acwvwny3.cloudfront.net/images/badge_dark.png)

[Atatus | Mobile and Web Performance Monitoring](https://www.atatus.com/?utm_source=badge)



Quill-Grammar [![Build Status](https://travis-ci.org/empirical-org/Quill-Grammar.svg?branch=master)](https://travis-ci.org/empirical-org/Quill-Grammar)
=============

To Develop on this project:

* Make a fork
* `npm install`
* `gem install sass`
* `cp src/scripts/development.config.json.example src/scripts/development.config.json` and fill in the empty values.

Useful commands:

* `gulp --env=development` - Run the development server and rebuild after every change. This is the main command to use while developing.
* `npm run lint` - Run the linter. All code needs to be properly linted or the CI build will fail.
* `npm run deploy-staging` - Deploy to the firebase staging environment.
* `npm run ci` - The command that TravisCI runs. If TravisCI is failing and you can't figure out why, try running this command locally to recreate the failures.
* `gulp test --env=test` - Run the test suite once.
* `gulp test:auto --env=test` - Run the test suite continuously. Tests will re-run after changes.
* IMPORTANT: If you run either of these `gulp test` commands, you will also need to run `gulp --env=test` in a different terminal window to make sure that your tests are running against the latest version of your code.

Any issues with gulp tasks should be addressed in the [Empirical Angular Gulp Tasks Repo](https://github.com/empirical-org/empirical-angular-gulp-tasks).
This is an opinionated gulp project setup. If you run into any build chain issues,
address them in the task repository.

Routes
======

* `/activities` - Teachers and Admins can see activities, make new ones, and edit existing ones. The list of activities is a link to play the activity.
* `/play/sw?:uid&student` - Play the given id of the sentence writing activity.
* `/play/pf?:uid` - Play the given id of the proofreading activity.
* `/play/sw/g/:ids?student&passageId` - Play the comma delimited list of rule ids
* `/play/partner-pf` - Play the 3 selected Partner Stories.

###CMS Routes

* `/cms` - Entry point for the Quill Grammar CMS system.
* `/cms/proofreaderActivities` - Entry point for the Proofreader Activities (Passages)
* `/cms/grammarActivities` - Entry point for the Grammar Activities (Sentence Writing)
* `/cms/concepts` - Entry point for the concepts (Rules)

### Module URLs

#### Sentence Writing

The module url for sentence writing is `/play/sw?uid&student`. It is assumed that LMS will add
a `uid` parameter identifying the id of the sentence writing activity in Quill Grammar.
The LMS may also pass a `student` parameter to identify the student.

#### Proofreading Story

The module url for story (proofreading activity) is `/play/pf?uid`. It is assumed that
the LMS will add a `uid` parameter identifying the id of the proofreading story activity
in Quill Grammar.

An example url running locally would look like this (an Aubrey Hepburn activity): `http://localhost:3000/play/pf?anonymous=true&uid=-K2nLvC9CX2xqw7jnpZP`

Firebase Data
=============

The Firebase Data is relational. It has been migrated from CSV dumps from the older
Postgresql database. In [this repo](https://github.com/empirical-org/grammar-csv-import)
there are scripts to build the necessary JSON objects.

The entity lists are Firebase Objects. With known keys, this make it easier for a
browser to load only the elements it needs.

The data is split according to make importing and exporting JSON files to the Firebase
data store during the early development phase.

We are using the [blaze compiler](https://github.com/firebase/blaze_compiler) to generate
rules for our data. Install it with `npm install -g blaze_compiler`.

Intergrating and Testing Against the LMS
========================================

If you are doing app development that requires integration with
the [LMS](https://github.com/empirical-org/Empirical-Core), you'll
want a local instance to practice on. Head over to the LMS repo
to learn how to set that up.

Once you are up and running the LMS, assuming port 3000 for the LMS,
head to http://localhost:3000/oauth/applications to tweak your local
OAuth applications. You'll need to log in with the Admin username/password.
If an OAuth application does not yet exist for QuillGrammer, then create one, giving it the callback url :
`http:://localhost:3001`.

You'll want to fill in the `oauthClientId` in `./src/scripts/development.config.json`
with the `applicationId` from your new or modified OAuth LMS Application.

It's important you do not commit the changes for the `development.config.json`.
The `clientId` is unique to your local LMS instance.

Since QG is a firebase based application, we'll also want authorization tokens
from firebase. On the LMS there is a route that will return the firebase token
based on the type of user you are.

As of writing this, there isn't a UI for managing the LMS firebase applications.
So, in your local dev environment for the LMS, run `rails c` to fireup a rails
console.

You'll need the `SECRET` for your firebase app, which you can get by going to the admin panel of the firebase app and visiting the `secrets` page.
Use that `SECRET` in the command below, typed into the rails console -

```
 FirebaseApp.create :name => "quillgrammarstaging", :secret => SECRET
```

Once you've created a FirebaseApp instance in the console, take that 'name' value and plug it into the `firebaseApp` field of your `development.config.json` file, e.g. `"firebaseApp": "quillgrammarstaging"`.

Also make sure that the ActivityClassification records in your database have the correct module_url.
These ActivityClassification records are created when you seed your database (or pull the database from staging).
The module_url for the ActivityClassification with name "passage" should be :
`localhost:3001/play/pf`
While the module_url for the ActivityClassification with name 'sentence' should be :
`localhost:3001/play/sw`

When you start the rails server for the LMS with `rails s`, make sure to do this before firing up Quill-Grammar with `gulp --env=development`. This way, the LMS will get port `localhost:3000` and Quill-Grammar will get port `localhost:3001`. If you start Quill-Grammar first, then Quill-Grammar will take `localhost:3000` instead, which conflicts with our configuration.

When running the LMS and Q
