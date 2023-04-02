
 <div id="header" align="center">
  <h1> COSC 4353: SOFTWARE DESIGN
    <br><br>
   <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="200"/>
   <img src="https://media.giphy.com/media/WDJBtnl2cxgReYekEu/giphy.gif", width="200"/>
  </h1>
</div>
---

<h2>Team 7 Members
  <ul><br>
    <li><b>Michael Moorman <img src="https://media.giphy.com/media/m0dmKBkncVETJv2h0S/giphy.gif" width="30px"/></b></li>
    <li><b>Abraar Patel &nbsp <img src="https://media.giphy.com/media/m0dmKBkncVETJv2h0S/giphy.gif" width="30px"/></b></li>
    <li><b>Dosbol Aliev &nbsp<img src="https://media.giphy.com/media/m0dmKBkncVETJv2h0S/giphy.gif" width="30px"/></b></li>
  <li> <b>Rishi Chitturi &nbsp <img src="https://media.giphy.com/media/m0dmKBkncVETJv2h0S/giphy.gif" width="30px"/></b></li>
  </ul>
  </h2>
  
<h2> Description </h2>
 
 A fuel delivery web application created that calculates the price of fuel based on the amount of fuel requested, the client's location, history and the company's profit margin.


### <h2> Technology Stack</h2>
<ul>
  <li>Frontend:</b> <a href="https://reactjs.org">ReactJS</a></li>
  <li>Backend:</b> <a href="https://expressjs.com">ExpressJS</a></li>
  <li>Database:</b> <a href="https://www.mysql.com">SQL</a></li>
  <li>Libraries:
  <ul>
   <li> Styling: <a href="https://getbootstrap.com/docs/3.4/">Bootstrap</a></li>
   <li> Testing: <a href="https://jestjs.io">Jest</a> and <a href="https://testing-library.com/docs/react-testing-library/intro/">React Testing Library</a></li>
  </ul>
 </ul>
 
 ### <h2> Requirements </h2>
 
 1) Clone this repository: `git clone https://github.com/Software-DesignX/COSC4353_Group7.git`
  
 2) Install <a href="https://git-scm.com/">Git</a>, <a href="https://code.visualstudio.com/download">Visual Studio Code</a>, <a href="https://nodejs.org">NodeJS</a></li>

 3) Install <a href="">MySQL</a> to your liking, and execute the script `backend/db/schema.sql` to initialize the database using the MySQL Workbench or command line tools as below:

  In Windows, <a href="https://dev.mysql.com/downloads/installer/">install MySQL using the installer </a> and setup a password for the root user, and then perform the following on the machine hosting the database:
  ```
  cd backend\db
  mysql -h <HOSTNAME> -u root -p <PASSWORD> < schema.sql
  ```
  Here HOSTNAME represents the machine hostname that the MySQL server is running on.

  In macOS or Linux, install from your favorite package manager or using the <a href="https://dev.mysql.com/downloads/mysql/">community installer for your appropriate macOS</a> and then perform the following on the machine hosting the database:
  ```
  cd backend/db
  mysql -h <HOSTNAME> -u root -p <PASSWORD> < schema.sql
  ```

4) Configure the backend to connect to your database by modifying the `backend/.env` file:

  ```
  MYSQL_HOST=127.0.0.1
  MYSQL_PORT=3306
  MYSQL_USER=app
  MYSQL_PASSWORD=test_password
  MYSQL_DB=cosc4353app
  ```
  By default, the script will install to the database `cosc4353app` and create a user `app` with `test_password`. Replace `MYSQL_HOST` and `MYSQL_PORT` appropriately for your MySQL install

 5) Install the NPM package dependencies for the frontend and backend:
 ```
 cd frontend
 npm i
 cd ../backend
 npm i
 ```
 
 6) Installation of nodemon: required for running the backend Node.js daemon
 
  ```
  npm install -g nodemon
  ```

### <h2> Running in Testing/Development modes </h2>

Now we can test the frontend and backend separately, or run them in development mode together.
Make sure that the MySQL database is running and accepting connections before starting the backend in development or production.

Testing mode:

 1) Start backend or frontend in testing mode:
 ```
 cd frontend
 npm test
 ```

We can generate code coverage reports using IstanbulJS and jest:
```
npm test -- --coverage
```
An HTML version of the code coverage report will be generated at `./coverage/lcov-report/index.html`.

Development mode:

 2) Start backend, it will automatically begin listening on `localhost:3001`:
 ```
 cd backend
 npm start
 ```
 3) In a separate terminal, start frontend, it will automatically begin listening on `localhost:3000` and open a browser tab:
 ```
 cd frontend
 npm start
 ```


 
