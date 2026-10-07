const path = require('path');

/**
 * Menghubungkan Swagger UI dan endpoint spesifikasi OpenAPI ke aplikasi Express
 * @param {import('express').Application} app
 */
function mountSwagger(app) {
  let swaggerSpec = null;
  try {
    swaggerSpec = require('../../swagger.json');
  } catch (error) {
    console.warn('Swagger specification file tidak ditemukan:', error.message);
    swaggerSpec = null;
  }

  // Endpoint untuk mengambil raw JSON OpenAPI 3.0 specification
  app.get('/api/docs/swagger.json', (req, res) => {
    if (!swaggerSpec) {
      return res.status(404).json({
        status: 'error',
        message: 'Spesifikasi OpenAPI/Swagger tidak ditemukan.'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Halaman interaktif Swagger UI
  app.get(['/api-docs', '/docs'], (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>JobHunt API Documentation (Swagger)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar { display: none !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "/api/docs/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`);
  });
}

module.exports = { mountSwagger };
