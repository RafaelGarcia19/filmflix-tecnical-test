module.exports = {
  apps: [
    {
      name: "# filmflix-tecnical-test",
      script: "./dist/index.js",
      instances: "2",
      exec_mode: "cluster",
      max_memory_restart: "1G",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      port: 3000,
    },
  ],
};
