# SimformAssignment
Assignment On Admin, Agent, Site, Cashier

Installation and configuration Guide

1. Download project from Github
2. open the project in code editor
3. open terminal and run code "npm install" in the terminal
4. I have use my online mongo DB url for saving data you can use my url or you can replace your url with mine 
5. to replace your url open index.js file from project
6. search "mongoose.connect" in index.js file and replace connection url
7. to run the server write "npm start" in terminal


I am Providing Postman collection for testing it have 9 request
1. admin login
2. agent login
3. site login
4. create agent(admin can create agent after login, admin need to provide token generated while login in header of this request)
5. create site(agent can create site after login, agent need to provide token generated while login in header of this request)
6. create cashier(site can create cashier after login, site need to provide token generated while login in header of this request)
7. view agent(admin can view all his created agent by provideing token generated while login in header and his email in query param of this request)
8. view site(agent can view all his created site by provideing token generated while login in header and his email in query param of this request)
9. view cashier(site can view all his created cashier by provideing token generated while login in header and his email in query param of this request)

Please refer video for better understanding
