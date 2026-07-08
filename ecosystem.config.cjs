module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: 'C:\\Users\\Rajesh\\Desktop\\ADAPTIVE LEARNING PLATFORM\\backend-ts',
      script: 'dist\\index.js',
      node_args: '--env-file=.env',
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
