# System Documentation
An example walkthrough of the system goes as follows:

1) 'npm run dev'
2)  Log in to the system with the following credentials:
  email: authuser@gmail.com
  password: 12345678
3) Once authenticated, the system will push you to the Dashboard

-The main page of the dashboard will show a page where clients can view the analytics
pertaining to their images within the system

-To import images or view images already imported, the client can navigate to the
import tab
  To upload: Click Upload Photos
  Under the 'Imported Photos' section, the client can view the photos already imported and
  click each individual photo for additional information

## Underlying Functionality

Store (src/store): Performs Login/Logout Functionality
Routing (src/routes, src/store/routerAccess.js, src/main.js)
  :Routes are contained in src/routes
  :routerAccess.js contains a ref to the router so we can push to dashboard following sign in
  :main.js routes to login when there isn't a currently authenticated user 
