Quill-Grammar
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

Routes
======

* `/cms` - Admins can CRUD Categories, Rules, Rule Questions
* `/activities` - Teachers and Admins can see activities, make new ones, and edit existing ones. The list of activities is a link to play the activity.
* `/play/sw/:id` - Play the given id of the sentence writing activity.
* `/` - Will let you iterate over all rule questions.

Firebase Data
=============

The Firebase Data is relational. It has been migrated from CSV dumps from the older
Postgresql database. In [this repo](https://github.com/empirical-org/grammar-csv-import)
there are scripts to build the necessary JSON objects.

The entity lists are Firebase Objects. With known keys, this make it easier for a
browser to load only the elements it needs.

The data is split according to make importing and exporting JSON files to the Firebase
data store during the early development phase.

