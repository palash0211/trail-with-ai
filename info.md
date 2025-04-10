Okay, I can help you understand the project structure, its features, and how to run it.

Project Structure

Based on the files listed, this project appears to be a full-stack web application with the following structure:

Root:
README.md: Main project documentation.
package.json, package-lock.json: Root-level package management for shared dependencies.
tsconfig.json: TypeScript configuration for the entire project.
generated-icon.png: An image.
.vscode: A folder for the IDE configuration.
backend/:
package.json, tsconfig.json: Backend-specific package management and TypeScript configuration.
src/: Source code for the backend.
db.ts: Likely contains database-related logic.
shared/: Probably shared code or schema definitions.
schema.ts: Database schema definitions.
types.ts: Shared typescript types
lib/: Core libraries for the backend
auth.ts: Authentication logic.
db.ts: Database access logic.
storage.ts: Storage logic
utils.ts: Utility functions
utils/: Contains utility modules
auth.ts: Utility functions for authentication
response.ts: Utilities for API responses
functions/: Serverless functions.
auth/: Authentication-related functions.
login.ts: Login function.
register.ts: User registration function.
user/: User-related functions.
getUser.ts: Function to retrieve user data.
frontend/:
package.json, tsconfig.json: Frontend-specific package management and TypeScript configuration.
next-env.d.ts: nextjs typescript configuration.
postcss.config.js: Post CSS configuration.
tailwind.config.js: Tailwind CSS configuration.
next.config.js: nextjs configuration file
jest.config.js: jest configuration file
jest.setup.js: jest setup
components.json: shadcn component file
sonar-project.properties: sonar properties
src/: Source code for the frontend (likely a Next.js application).
middleware.ts: Middleware functions for nextjs application.
app/: Next.js route handlers.
i18n/: Translation configuration.
config.ts & config.tsx: Translation configuration.
index.ts & index.tsx: Translation configuration.
locales/: translation files.
en.json: english translations
es.json: spanish translations
components/: Reusable UI components.
ui/: Base components.
button.tsx: Button component.
card.tsx: Card component.
form.tsx: Form component.
input.tsx: Input component.
label.tsx: Label component.
login-form.tsx: specific login form component.
lib/: Core libraries.
auth.ts: Frontend authentication logic.
utils.ts: Utility functions.
store/: Application state management.
auth-store.ts: state management for auth.
types/: Type definitions
index.ts: shared types
globals.css: Global styles.
layout.tsx: Application layout.
page.tsx: Application home page.
providers.tsx: contains application providers
tests/: Frontend tests.
login.test.tsx: example login test.
__tests__/: Frontend tests.
components/: components tests.
login-form.test.tsx: login form test.
infrastructure/:
Terraform files to define infrastructure as code (likely AWS).
api_gateway.tf, cognito.tf, database.tf, lambda.tf, main.tf, outputs.tf, variables.tf: Terraform configurations for different AWS resources.
server/:
db.ts: Another database file, maybe for a temporary or internal use.
storage.ts: Storage utilities.
shared/
schema.ts: Common schemas.
types.ts: Common typescript types.
terraform/
Similar to infrastructure folder, another terraform files, maybe used for other environments.
apigateway.tf, database.tf, lambda.tf, main.tf, outputs.tf, variables.tf: Terraform configurations for different AWS resources.
Available Features (Based on File Names)

Authentication:
User login and registration (backend/src/functions/auth/login.ts, backend/src/functions/auth/register.ts).
Frontend authentication handling (frontend/src/lib/auth.ts).
User Management:
Retrieving user data (backend/src/functions/user/getUser.ts).
Database Interaction:
Database logic and utilities (backend/src/lib/db.ts, backend/src/db.ts, server/db.ts).
Storage
File storage logic in backend (backend/src/lib/storage.ts) and server server/storage.ts
Frontend UI:
Reusable UI components (frontend/src/components/ui/).
Login form (frontend/src/components/login-form.tsx).
Nextjs routing and pages (frontend/src/app/)
State Management:
Frontend state management using Zustand (frontend/src/store/auth-store.ts).
Internationalization (i18n):
Support for multiple languages (English and Spanish) (frontend/src/i18n/).
Testing
Tests in both backend and frontend
Infrastructure as Code:
Terraform configurations to manage AWS resources.
Sonar integration:
sonar-project.properties contains sonar configuration.
How to Run the Project

Install Dependencies:
You'll need Node.js and npm (or yarn) installed.
Open your terminal and navigate to the project root.
Run npm install to install root-level dependencies.
Then, navigate to the backend directory and run npm install to install backend dependencies.
Finally, navigate to the frontend directory and run npm install to install frontend dependencies.
Run the Backend:
Navigate to the backend directory in your terminal.
Since there is no specific start script, it probably needs to be deployed as serverless functions in AWS, which requires Terraform to be configured.
Run the Frontend:
Navigate to the frontend directory in your terminal.
Run npm run dev to start the Next.js development server on port 5000 (as indicated in package.json).
You can also use npm run start to start the Next.js server on production mode.
You can use npm run build to make a build version of the project
Testing
To run tests in backend you need to execute a command from the backend folder
To run tests in frontend you need to execute npm run test command from the frontend folder.
Sonar
To run sonar you need to execute npm run sonar from the frontend folder.
Additional Notes

AWS Setup: Since the project uses Terraform and has an infrastructure/ directory, deploying the backend likely involves setting up an AWS account, configuring credentials, and using Terraform to create the necessary resources (API Gateway, Lambda functions, Cognito, database).
Terraform: If you want to deploy the infrastructure, you'll need to learn about Terraform and how to configure it for your AWS account.
Serverless: The backend is likely designed to run as serverless functions on AWS Lambda, which means you'll need to deploy the functions using Terraform or other deployment tools.

I have provided the steps to run this project according to its structure and information. 