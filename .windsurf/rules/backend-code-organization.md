---
trigger: manual
---

Backend Code Organization Guidelines (Ultra-Concise)1. IntroductionOrganized backends are key for scalable, maintainable AI applications; this guide advocates a feature-based structure.2. Core PrinciplesModularity: Small, independent modules.SoC: Distinct responsibilities per part.Cohesion: Group feature-related code.Low Coupling: Minimize module dependencies.Scalability: Design for growth.Testability: Structure for easy testing.Clarity: Intuitive for developers.3. Recommended Structure: Feature-BasedOrganize code by application features; co-locate all feature-specific files.your-backend-project/
├── src/                          # Source code
│   ├── features/                 # All features
│   │   ├── user_management/      # Example Feature 1
│   │   │   ├── user.controller.js    # Request handlers
│   │   │   ├── user.service.js       # Business logic
│   │   │   ├── user.model.js         # DB schema/model
│   │   │   ├── user.routes.js        # API routes
│   │   │   ├── user.validation.js    # Request validation
│   │   │   └── tests/                # Feature tests
│   │   └── model_inference/      # Example Feature 2: AI
│   │       ├── inference.controller.js
│   │       ├── inference.service.js
│   │       └── ...
│   ├── core/                     # Shared logic/utilities
│   │   ├── middleware/           # e.g., auth, error handling
│   │   ├── utils/                # e.g., helpers
│   │   └── db/                   # DB connection
│   ├── config/                   # Configurations
│   ├── jobs/                     # Background jobs
│   ├── app.js                    # App setup
│   └── server.js                 # Server startup
├── tests/                        # Global/E2E tests
├── docs/                         # Documentation
└── ...                           # Other project files
4. Key Directory Explanationssrc/: All application source.features/: Core of the structure; contains individual feature modules.core/: Shared code (middleware, utils, global services, DB setup).config/: Application configurations (DB, environment, AI models).jobs/: Background tasks/workers.app.js: Main application setup, global middleware, route aggregation.server.js: HTTP server startup.tests/ (Root): E2E tests, shared test utilities.docs/: API specifications, project documentation.5. Inside a Feature Module (e.g., user_management/).controller.js: Handles requests, calls services, sends responses..service.js: Core business logic; interacts with models..model.js: Data structure and database interaction..routes.js: Defines API endpoints for the feature..validation.js: Request data validation schemas/functions.tests/: Unit/integration tests for the feature.6. Handling AI-Specific ComponentsAI features often involve: Model Management, Pre/Postprocessing, Inference Pipelines, Feature Store Integration, and Experiment Logging, typically within their feature folder.7. Naming ConventionsUse consistent, descriptive names; suffix files by type (e.g., user.controller.js); choose and stick to a case convention.8. Modularity and DecouplingStrive for feature independence; inter-feature communication via well-defined interfaces (e.g., service calls). Consider dependency injection.9. API VersioningPlan for API versioning early if needed (e.g., URL path /v1/).10. Configuration ManagementSeparate configurations by environment (e.g., .env files); keep secrets out of version control.11. Logging and MonitoringImplement comprehensive, structured logging; use central configuration.12. ConclusionA feature-based organization is highly beneficial for scalable and maintainable backends, especially as complexity increases.