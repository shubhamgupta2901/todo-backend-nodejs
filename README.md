# [todo-backend-nodejs](https://sg-task-app.herokuapp.com/)
A back-end project that serves apis for your to-do apps. Stack: MongoDB + Node.js + Express.js

* [Documentation](#documentation)
* [How to use?](#how-to-use)
* [How it works?](#how-it-works)
* [How to run server on local?](#how-to-run-server-on-local)

## Documentation
* Check the Postman api documentation [here](https://documenter.getpostman.com/view/6519027/SVtN3B8u?version=latest#e46d959c-6287-49a0-9673-1159262a6aab).

## How to use
* You can use this to create your frontend todo applications.
* Users can signup, create tasks, update them and close them once finished. They can also maintain their profiles (including avatars).
* Authentication using [JWT](https://jwt.io/introduction/), so users can login from multiple devices and at any time signout from one or all devices.
* Note: On creating a user(signup) or login, you will recieve a json-web-token. All the other api-end points are subject to authorization. Add following key-value pair in your request header to make them work:
```java 
key: Authorization 
value: Bearer <YOUR_AUTH_TOKEN>
```

## How it works
![](https://github.com/shubhamgupta2901/todo-backend-nodejs/blob/master/todo-internal-nodejs.png)

## How to run server on local

* Install [MongoDB](https://docs.mongodb.com/manual/installation/)
* Install [Node.js](https://nodejs.org/en/download/)
* Clone this repository, create a directory ```config``` at root directory. Inside ```config```, create a ```dev.env``` file with following contents:
```
PORT=<PORT> 
MONGODB_URL= <YOUR_MONGODB_URL>/<YOUR_DB_NAME>
JWT_SECRET=<YOUR_AUTH_SECRET> 
```
* These keys are:
  * PORT: Port on which you want the local server to run. (Generally ```3000```)
  * MONGODB_URL: By default mongodb runs at localhost: ```mongodb://127.0.0.1:27017/```
  * JWT_SECRET: The secret string you want to use to generate json-web-tokens. Read more [here](https://jwt.io/introduction/).
* Run ```npm install``` to install dependencies and devDependencies.
* Run ```npm run dev```.
