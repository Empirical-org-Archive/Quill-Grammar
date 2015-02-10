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

