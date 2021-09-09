# nodejs-simple-http-request-get-post-system todo list

## () - 0.2.0 - Make post requests from /public/index.html
* make changes to static-server-post that will allow for responding to post requests
* make a post request from index.html
* read and write to a /foo.txt file at root for now

## () - 0.1.0 - start utils.js, and updated client system
* have a /public/js folder with a utils.js file
* the utils.js file should have an utils.http method based off of the one in js-javascript-example-utils
* have a /public/img folder with a banner.png image
* use the /public/img/banner.png file in /public/index.html
* have a /public/json/test.json file
* use utils.http to get the test.json file and inject the data into index.html

## () - 0.0.0 - start the project
* (done) start the project folder based off of the simple sever project folder
* (done) I will want to have a public folder at the root folder and have that be the place to store static assets
* (done) start a static-server-post based off of static-server-promise
* static-server-post will take three argumnets for folders one for the public folder, the root folder, and port
* with static-server-post the public folder will be the root path for static requests