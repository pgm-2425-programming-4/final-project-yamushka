# TaskFlow

Een dynamisch task management platform met:
-  3 folders = client (react), server (strapi), design 

 Werkt:
- Strapi backend correct opgezet met `Task` en `TaskStatus`
- API-filter op status `"Backlog"` 
- Componentstructuur: `PaginatedBacklog`, `Backlog`, `Pagination`
- Frontend in React
  - Axios voor data-ophaling
  - Tanstack Query voor state management
  - Statische HTML/CSS volledig geïntegreerd
 
deployed = netflify 
https://infrastructuur.netlify.app/

gratis database via render = jamming (evv blijft zelfde) externe database = log via github

DATABASE_SSL=false   = cuz lokaal , 
database.js aanpassen 

postgress.app  = lokaal = env aanpassen naar lokale credentials 
(npm i pg) en dan (npm run develop) wordt doorgestuurd naar http://localhost:1337/admin/auth/register-admin
