module.exports = {
  apps: [{
    name: 'peerfood-api',
    script: 'server.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 8086
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8086
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Configuration avancée
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Variables d'environnement spécifiques
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 8086
    },
    
    // Configuration des logs
    log_type: 'json',
    merge_logs: true,
    
    // Configuration du monitoring
    pmx: true,
    
    // Configuration des signaux
    kill_timeout: 5000,
    listen_timeout: 8000,
    
    // Configuration de la santé de l'application
    health_check_grace_period: 3000
  }],

  // Configuration du déploiement
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/Frejuste26/peerfood.git',
      path: '/var/www/peerfood',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/Frejuste26/peerfood.git',
      path: '/var/www/peerfood-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};