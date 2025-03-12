Project setup

Make sure you have node version greater than or equal to v20.17.0 installed.
Make sure you have latest version of mongodb installed.
Clone the project : git clone https://github.com/AvnishChoubey/zylentrix-assignment.git
Install dependencies: npm install
Create amongoDB database and put the database connection string in the mongoURI variable in file server.js.
Create a constant PORT = 3000 in server.js file.


API Endpoints and Sample Testcases

1.  create a new user
    endpoint: /users/new
    Request Body Sample Input:
    {"email": "brucewayne@gmail.com", "name": "Bruce Wayne" : "age": "40"}
    {"email": "selinakyle@gmail.com", "name": "Selina Kyle" : "age": "28"}

2.  get all users
    endpoint: /users/all

3.  get a unique user
    endpoint: /users/:email
    Path Parameter Sample Input:
    selinakyle@gmail.com
    brucewayne@gmail.com
    clown@gmail.com

4.  update a user
    endpoint: /users/:email
    Path Parameter Sample Input and Request Body:
    selinakyle@gmail.com            {"age": "32"}
    clown@gmail.com

5. delete a user
    endpoint: /users/:email
    Path Parameter Sample Input
    selinakyle@gmail.com
    clown@gmail.com