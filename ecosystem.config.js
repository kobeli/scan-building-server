module.exports = {
  apps : [{
    name   : "scan-building-server",
    script : "dist/server.js",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
};
