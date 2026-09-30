export const openapiDocument = {
  openapi: "3.0.3",
  info: { title: "Build Future Tourism API", version: "1.1.0", description: "REST API for Rwanda tourism, internships and professional training." },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } }
  },
  paths: {
    "/api/health": { get: { summary: "API health" , responses: { "200": { description: "OK" } } } },
    "/api/auth/register": { post: { summary: "Register student/user", requestBody: { required: true }, responses: { "201": { description: "Registered" } } } },
    "/api/auth/login": { post: { summary: "Login", responses: { "200": { description: "Logged in" } } } },
    "/api/auth/refresh": { post: { summary: "Refresh access token", responses: { "200": { description: "Token refreshed" } } } },
    "/api/auth/logout": { post: { summary: "Logout", responses: { "200": { description: "Logged out" } } } },
    "/api/destinations": { get: { summary: "List published destinations", responses: { "200": { description: "Destinations" } } } },
    "/api/destinations/{slug}": { get: { summary: "Get destination by slug", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Destination" } } } },
    "/api/applications": { post: { summary: "Submit internship application with CV", security: [{ bearerAuth: [] }], responses: { "201": { description: "Application submitted" } } } },
    "/api/applications/me": { get: { summary: "My applications", security: [{ bearerAuth: [] }], responses: { "200": { description: "Applications" } } } },
    "/api/training": { get: { summary: "List published training programs", responses: { "200": { description: "Training programs" } } } },
    "/api/training/{id}/register": { post: { summary: "Register for training", security: [{ bearerAuth: [] }], responses: { "201": { description: "Registered" } } } },
    "/api/notifications": { get: { summary: "List my notifications", security: [{ bearerAuth: [] }], responses: { "200": { description: "Notifications" } } } },
    "/api/admin/dashboard": { get: { summary: "Admin statistics", security: [{ bearerAuth: [] }], responses: { "200": { description: "Dashboard" } } } },
    "/api/admin/destinations": { get: { summary: "Admin list destinations", security: [{ bearerAuth: [] }], responses: { "200": { description: "Destinations" } } }, post: { summary: "Create destination", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/api/admin/internships": { get: { summary: "Admin list internships", security: [{ bearerAuth: [] }], responses: { "200": { description: "Internships" } } }, post: { summary: "Create internship", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/api/admin/training": { get: { summary: "Admin list training", security: [{ bearerAuth: [] }], responses: { "200": { description: "Training" } } }, post: { summary: "Create training", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/api/admin/applications": { get: { summary: "Admin application management", security: [{ bearerAuth: [] }], responses: { "200": { description: "Applications" } } } },
    "/api/admin/users": { get: { summary: "Admin user management", security: [{ bearerAuth: [] }], responses: { "200": { description: "Users" } } } }
  }
};
