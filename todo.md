# nodejs-simple-http-request-get-post-system todo list

## () - 0.6.1 - fix bug with using system on other coputrets on network
* see about fixing a bug where I can not get to the client system from another computer on the network
* loosing the host argument when calling sever.listen seems to work, but find a way without having to do that.

## ( done 09/10/2021 ) - 0.6.0 - better ui in index.html
* (done) display current state of map
* (done) can select what cell to mutate

## ( done 09/10/2021 ) - 0.5.1 - fix network interface bug
* (done) fix bug when lo interface is not there
* (done) default to a string value of '127.0.0.1' if no interface is found

## ( done 09/09/2021 ) - 0.5.0 - start new ui in index.html, and demo middleware
* (done) have a map.json that will contain data for a map
* (done) I will want a createNewMap helper in /middleware/index.js
* (done) the map can just be an array of objects for a 8 by 8 grid
* (done) the index.html ui can be used to mutate the state of the json file map

## ( done 09/09/2021 ) - 0.4.0 - middleware folder
* (done) have a /middleware folder which is what will be what is used to customize how requests should be processed
* (done) have a /middleware/index.js file that will be the main file that the server script will call for a request

## ( done 09/09/2021  ) - 0.3.0 - parse a body
* (done) parse a body sent from index.html
* (done) for now just send back the same body, and a message as a json string

## ( done 09/09/2021 ) - 0.2.0 - Make post requests from /public/index.html
* (done) make changes to static-server-post that will allow for responding to post requests
* (done) make a post request from index.html
* (done) just send any kind of response for a post for now

## ( done 09/09/2021 ) - 0.1.0 - start utils.js, and updated client system
* (done) have a /public/js folder with a utils.js file
* (done) the utils.js file should have an utils.http method based off of the one in js-javascript-example-utils
* (done) have a /public/img folder with a banner.png image
* (done) use the /public/img/banner.png file in /public/index.html
* (done) have a /public/test.json file
* (done) use utils.http to get the test.json file and inject the data into index.html

## ( done 09/09/2021 ) - 0.0.0 - start the project
* (done) start the project folder based off of the simple sever project folder
* (done) I will want to have a public folder at the root folder and have that be the place to store static assets
* (done) start a static-server-post based off of static-server-promise
* (done) static-server-post will take three argumnets for folders one for the public folder, the root folder, and port
* (done) with static-server-post the public folder will be the root path for static requests