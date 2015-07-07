Quill-Grammar [![Build Status](https://travis-ci.org/empirical-org/Quill-Grammar.svg?branch=master)](https://travis-ci.org/empirical-org/Quill-Grammar)
=============

To Develop on this project:

* Make a fork
* `npm install`
* `gem install sass`
* `gulp`

To Deploy this project:

Assuming, you are developing

* `gulp --env=prod`
* firebase deploy

Any issues with gulp tasks should be addressed in the [Empirical Angular Gulp Tasks Repo](https://github.com/empirical-org/empirical-angular-gulp-tasks).
This is an opinionated gulp project setup. If you run into any build chain issues,
address them in the task repository.

Routes
======

* `/cms` - Admins can CRUD Categories, Rules, Rule Questions
* `/activities` - Teachers and Admins can see activities, make new ones, and edit existing ones. The list of activities is a link to play the activity.
* `/play/sw/:id` - Play the given id of the sentence writing activity.
* `/play/pf/:id` - Play the given id of the proofreading activity.
* `/play/sw/g/:ids` - Play the comma delimited list of rule ids
* `/play/partner-pf` - Play the 3 selected Partner Stories.
* `/` - Will let you iterate over all rule questions.

### Module URLs

#### Sentence Writing

The module url for sentence writing is `/play/sw?uid&student`. It is assumed that LMS will add
a `uid` parameter identifying the id of the sentence writing activity in Quill Grammar.
The LMS may also pass a `student` parameter to identify the student.

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
