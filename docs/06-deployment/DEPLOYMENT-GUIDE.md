# Comprehensive Deployment Guide - Bflow ERP Platform

## 1. Overview

This guide provides detailed instructions for deploying the Bflow ERP Platform across different environments, from development to production. It covers infrastructure setup, deployment procedures, monitoring, and troubleshooting.

## 2. Infrastructure Requirements

### 2.1 Hardware Requirements

| Environment | CPU | RAM | Storage | Network |
|------------|-----|-----|---------|---------|
| Development | 2 cores | 4GB | 50GB SSD | 100 Mbps |
| Testing | 4 cores | 8GB | 100GB SSD | 1 Gbps |
| UAT | 4 cores | 16GB | 200GB SSD | 1 Gbps |
| Production | 8+ cores | 32GB+ | 500GB SSD | 10 Gbps |

### 2.2 Software Requirements

```yaml
# Base System Requirements
os:
  - Ubuntu 22.04 LTS (recommended)
  - CentOS 8+
  - Debian 11+

runtime:
  python: "3.11+"
  node: "18.x LTS"
  
databases:
  mysql: "8.0+"
  postgresql: "14+"
  redis: "7.0+"
  
web_servers:
  nginx: "1.22+"
  
containerization:
  docker: "24.0+"
  docker-compose: "2.20+"
  
orchestration:
  kubernetes: "1.28+" (production)
  helm: "3.12+"
```

## 3. Environment Setup

### 3.1 Development Environment

```bash
# Clone repository
git clone https://github.com/company/bflow-erp.git
cd bflow-erp

# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r req.txt
pip install -r req-dev.txt  # Development dependencies

# Setup environment variables
cp .env.example .env
# Edit .env file with your configuration

# Database setup
mysql -u root -p -e "CREATE DATABASE bflow_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
python manage.py migrate
python manage.py createsuperuser

# Load initial data
python manage.py loaddata initial_data.json

# Collect static files
python manage.py collectstatic --noinput

# Run development server
python manage.py runserver

# In another terminal, run Celery worker
celery -A misui worker -l info

# Run Celery beat for scheduled tasks
celery -A misui beat -l info
```

### 3.2 Docker Development Setup

```yaml
# docker-compose.yml for development
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: bflow_dev
      MYSQL_USER: bflow
      MYSQL_PASSWORD: bflowpass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    command: gunicorn misui.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - .:/code
      - static_volume:/code/staticfiles
      - media_volume:/code/media
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  celery:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    command: celery -A misui worker -l info
    volumes:
      - .:/code
    env_file:
      - .env
    depends_on:
      - db
      - redis

  celery-beat:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    command: celery -A misui beat -l info
    volumes:
      - .:/code
    env_file:
      - .env
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled
      - static_volume:/static
      - media_volume:/media
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web

volumes:
  mysql_data:
  redis_data:
  static_volume:
  media_volume:
```

### 3.3 Production Environment Setup

```bash
#!/bin/bash
# production-setup.sh

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    python3.11 python3.11-venv python3.11-dev \
    mysql-server mysql-client libmysqlclient-dev \
    redis-server \
    nginx \
    supervisor \
    git \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-pip

# Create application user
sudo useradd -m -s /bin/bash bflow
sudo usermod -aG www-data bflow

# Create directory structure
sudo mkdir -p /opt/bflow/{app,logs,media,static,backups}
sudo chown -R bflow:www-data /opt/bflow
sudo chmod -R 755 /opt/bflow

# Clone application
sudo -u bflow git clone https://github.com/company/bflow-erp.git /opt/bflow/app

# Setup Python environment
cd /opt/bflow/app
sudo -u bflow python3.11 -m venv venv
sudo -u bflow ./venv/bin/pip install --upgrade pip
sudo -u bflow ./venv/bin/pip install -r req.txt
sudo -u bflow ./venv/bin/pip install gunicorn

# Configure MySQL
sudo mysql -e "CREATE DATABASE bflow_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'bflow'@'localhost' IDENTIFIED BY 'StrongPassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bflow_prod.* TO 'bflow'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Configure Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Setup environment
sudo -u bflow cp .env.production /opt/bflow/app/.env
# Edit .env file with production values

# Run migrations
sudo -u bflow ./venv/bin/python manage.py migrate
sudo -u bflow ./venv/bin/python manage.py collectstatic --noinput

# Configure Gunicorn
cat > /etc/systemd/system/bflow.service << EOF
[Unit]
Description=Bflow ERP Gunicorn Application
After=network.target

[Service]
User=bflow
Group=www-data
WorkingDirectory=/opt/bflow/app
Environment="PATH=/opt/bflow/app/venv/bin"
ExecStart=/opt/bflow/app/venv/bin/gunicorn \
    --workers 4 \
    --worker-class gevent \
    --bind unix:/opt/bflow/app/bflow.sock \
    --error-logfile /opt/bflow/logs/gunicorn-error.log \
    --access-logfile /opt/bflow/logs/gunicorn-access.log \
    --log-level info \
    misui.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# Configure Celery
cat > /etc/systemd/system/bflow-celery.service << EOF
[Unit]
Description=Bflow Celery Worker
After=network.target

[Service]
Type=forking
User=bflow
Group=www-data
WorkingDirectory=/opt/bflow/app
Environment="PATH=/opt/bflow/app/venv/bin"
ExecStart=/opt/bflow/app/venv/bin/celery -A misui worker \
    --loglevel=info \
    --logfile=/opt/bflow/logs/celery.log \
    --pidfile=/opt/bflow/celery.pid \
    --detach

[Install]
WantedBy=multi-user.target
EOF

# Configure Celery Beat
cat > /etc/systemd/system/bflow-celery-beat.service << EOF
[Unit]
Description=Bflow Celery Beat
After=network.target

[Service]
Type=forking
User=bflow
Group=www-data
WorkingDirectory=/opt/bflow/app
Environment="PATH=/opt/bflow/app/venv/bin"
ExecStart=/opt/bflow/app/venv/bin/celery -A misui beat \
    --loglevel=info \
    --logfile=/opt/bflow/logs/celery-beat.log \
    --pidfile=/opt/bflow/celery-beat.pid \
    --detach

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable bflow bflow-celery bflow-celery-beat
sudo systemctl start bflow bflow-celery bflow-celery-beat

# Configure Nginx
cat > /etc/nginx/sites-available/bflow << 'EOF'
upstream bflow_app {
    server unix:/opt/bflow/app/bflow.sock fail_timeout=0;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

server {
    listen 80;
    server_name bflow.example.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bflow.example.com;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/bflow.crt;
    ssl_certificate_key /etc/nginx/ssl/bflow.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com;" always;
    
    # Logging
    access_log /opt/bflow/logs/nginx-access.log;
    error_log /opt/bflow/logs/nginx-error.log;
    
    # Max upload size
    client_max_body_size 100M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml;
    
    # Static files
    location /static/ {
        alias /opt/bflow/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /media/ {
        alias /opt/bflow/media/;
        expires 7d;
        add_header Cache-Control "public";
    }
    
    # Rate limiting for login
    location /login/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://bflow_app;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Rate limiting for API
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://bflow_app;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Application
    location / {
        proxy_pass http://bflow_app;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Websocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable Nginx configuration
sudo ln -s /etc/nginx/sites-available/bflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bflow.example.com --non-interactive --agree-tos --email admin@example.com

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Setup log rotation
cat > /etc/logrotate.d/bflow << EOF
/opt/bflow/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 bflow www-data
    sharedscripts
    postrotate
        systemctl reload bflow
    endscript
}
EOF

echo "Production setup complete!"
```

## 4. Deployment Process

### 4.1 CI/CD Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Test stage
test:unit:
  stage: test
  image: python:3.11
  before_script:
    - pip install -r req.txt
    - pip install -r req-test.txt
  script:
    - python manage.py test --parallel
    - coverage run --source='.' manage.py test
    - coverage report
  coverage: '/TOTAL.+?(\d+\%)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

test:lint:
  stage: test
  image: python:3.11
  before_script:
    - pip install flake8 black mypy
  script:
    - flake8 apps/
    - black --check apps/
    - mypy apps/

test:security:
  stage: test
  image: python:3.11
  before_script:
    - pip install bandit safety
  script:
    - bandit -r apps/
    - safety check

# Build stage
build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - develop

# Deploy stages
deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $STAGING_USER@$STAGING_HOST "
        cd /opt/bflow/app &&
        git pull origin develop &&
        source venv/bin/activate &&
        pip install -r req.txt &&
        python manage.py migrate &&
        python manage.py collectstatic --noinput &&
        sudo systemctl restart bflow bflow-celery bflow-celery-beat
      "
  environment:
    name: staging
    url: https://staging.bflow.example.com
  only:
    - develop

deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $PROD_USER@$PROD_HOST "
        cd /opt/bflow/app &&
        git pull origin main &&
        source venv/bin/activate &&
        pip install -r req.txt &&
        python manage.py migrate &&
        python manage.py collectstatic --noinput &&
        sudo systemctl restart bflow bflow-celery bflow-celery-beat
      "
  environment:
    name: production
    url: https://bflow.example.com
  only:
    - main
  when: manual
```

### 4.2 Blue-Green Deployment

```bash
#!/bin/bash
# blue-green-deploy.sh

set -e

# Configuration
BLUE_PORT=8001
GREEN_PORT=8002
HEALTH_CHECK_URL="/health"
DEPLOY_DIR="/opt/bflow"

# Determine current active environment
CURRENT_ENV=$(curl -s http://localhost/env || echo "blue")
if [ "$CURRENT_ENV" = "blue" ]; then
    NEW_ENV="green"
    NEW_PORT=$GREEN_PORT
    OLD_PORT=$BLUE_PORT
else
    NEW_ENV="blue"
    NEW_PORT=$BLUE_PORT
    OLD_PORT=$GREEN_PORT
fi

echo "Deploying to $NEW_ENV environment (port $NEW_PORT)"

# Deploy to new environment
cd "$DEPLOY_DIR/$NEW_ENV/app"
git pull origin main
source venv/bin/activate
pip install -r req.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Start new environment
systemctl start "bflow-$NEW_ENV"

# Health check
echo "Waiting for $NEW_ENV to be healthy..."
for i in {1..30}; do
    if curl -f "http://localhost:$NEW_PORT$HEALTH_CHECK_URL" >/dev/null 2>&1; then
        echo "$NEW_ENV is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Health check failed for $NEW_ENV"
        systemctl stop "bflow-$NEW_ENV"
        exit 1
    fi
    sleep 2
done

# Switch traffic
echo "Switching traffic to $NEW_ENV"
cat > /etc/nginx/conf.d/upstream.conf << EOF
upstream bflow_app {
    server 127.0.0.1:$NEW_PORT;
}
EOF

nginx -s reload

# Stop old environment
echo "Stopping $CURRENT_ENV environment"
sleep 5
systemctl stop "bflow-$CURRENT_ENV"

echo "Deployment complete. Active environment: $NEW_ENV"
```

### 4.3 Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bflow-web
  namespace: bflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bflow-web
  template:
    metadata:
      labels:
        app: bflow-web
    spec:
      containers:
      - name: bflow
        image: registry.example.com/bflow:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: bflow-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: bflow-secrets
              key: redis-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: bflow-secrets
              key: secret-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: static-files
          mountPath: /app/staticfiles
        - name: media-files
          mountPath: /app/media
      volumes:
      - name: static-files
        persistentVolumeClaim:
          claimName: bflow-static-pvc
      - name: media-files
        persistentVolumeClaim:
          claimName: bflow-media-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: bflow-web-service
  namespace: bflow
spec:
  selector:
    app: bflow-web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bflow-ingress
  namespace: bflow
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - bflow.example.com
    secretName: bflow-tls
  rules:
  - host: bflow.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: bflow-web-service
            port:
              number: 80

---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: bflow-backup
  namespace: bflow
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: registry.example.com/bflow-backup:latest
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: bflow-secrets
                  key: database-url
            - name: S3_BUCKET
              value: bflow-backups
            command:
            - /bin/bash
            - -c
            - |
              mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > backup-$(date +%Y%m%d).sql.gz
              aws s3 cp backup-$(date +%Y%m%d).sql.gz s3://$S3_BUCKET/database/
          restartPolicy: OnFailure
```

## 5. Database Management

### 5.1 Migration Strategy

```bash
#!/bin/bash
# safe-migrate.sh

set -e

# Backup database before migration
echo "Creating database backup..."
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > backup-$(date +%Y%m%d%H%M%S).sql.gz

# Check pending migrations
echo "Checking pending migrations..."
python manage.py showmigrations | grep "\[ \]" > pending_migrations.txt

if [ -s pending_migrations.txt ]; then
    echo "Pending migrations found:"
    cat pending_migrations.txt
    
    # Run migrations with fake option first to verify
    echo "Verifying migrations..."
    python manage.py migrate --fake --dry-run
    
    # Apply migrations
    echo "Applying migrations..."
    python manage.py migrate
    
    # Verify migration success
    python manage.py showmigrations | grep "\[ \]" > remaining_migrations.txt
    if [ -s remaining_migrations.txt ]; then
        echo "ERROR: Some migrations failed to apply"
        cat remaining_migrations.txt
        exit 1
    fi
else
    echo "No pending migrations"
fi

echo "Migration complete"
```

### 5.2 Database Optimization

```sql
-- Performance optimization queries

-- Add missing indexes
CREATE INDEX idx_quotation_customer_status ON quotation(customer_id, status);
CREATE INDEX idx_quotation_created ON quotation(created_at);
CREATE INDEX idx_employee_dept_active ON employee(department_id, is_active);

-- Analyze tables
ANALYZE TABLE quotation;
ANALYZE TABLE employee;
ANALYZE TABLE sales_order;

-- Check slow queries
SELECT 
    query,
    exec_count,
    avg_time_ms,
    total_time_ms
FROM performance_schema.events_statements_summary_by_digest
WHERE avg_time_ms > 100
ORDER BY avg_time_ms DESC
LIMIT 20;

-- Table maintenance
OPTIMIZE TABLE quotation;
OPTIMIZE TABLE sales_order;
```

## 6. Monitoring & Logging

### 6.1 Application Monitoring

```python
# monitoring.py
import os
from prometheus_client import Counter, Histogram, Gauge
from functools import wraps
import time

# Metrics
request_count = Counter('bflow_requests_total', 'Total requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('bflow_request_duration_seconds', 'Request duration', ['method', 'endpoint'])
active_users = Gauge('bflow_active_users', 'Active users')
db_connections = Gauge('bflow_db_connections', 'Database connections')

def monitor_request(func):
    """Decorator to monitor requests"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        method = args[0].method
        endpoint = args[0].path
        
        try:
            response = func(*args, **kwargs)
            status = response.status_code
            return response
        except Exception as e:
            status = 500
            raise
        finally:
            duration = time.time() - start_time
            request_count.labels(method=method, endpoint=endpoint, status=status).inc()
            request_duration.labels(method=method, endpoint=endpoint).observe(duration)
    
    return wrapper

# Health check endpoint
def health_check():
    """Comprehensive health check"""
    checks = {
        'database': check_database(),
        'redis': check_redis(),
        'celery': check_celery(),
        'disk_space': check_disk_space(),
        'memory': check_memory()
    }
    
    status = 'healthy' if all(checks.values()) else 'unhealthy'
    return {
        'status': status,
        'checks': checks,
        'timestamp': datetime.now().isoformat()
    }

def check_database():
    """Check database connectivity"""
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        return True
    except:
        return False

def check_redis():
    """Check Redis connectivity"""
    try:
        from django.core.cache import cache
        cache.set('health_check', 'ok', 1)
        return cache.get('health_check') == 'ok'
    except:
        return False

def check_disk_space():
    """Check available disk space"""
    import shutil
    stat = shutil.disk_usage('/')
    percent_free = (stat.free / stat.total) * 100
    return percent_free > 10  # Alert if less than 10% free

def check_memory():
    """Check available memory"""
    import psutil
    memory = psutil.virtual_memory()
    return memory.percent < 90  # Alert if more than 90% used
```

### 6.2 Logging Configuration

```python
# settings/logging.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        }
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/opt/bflow/logs/app.log',
            'maxBytes': 1024 * 1024 * 100,  # 100 MB
            'backupCount': 10,
            'formatter': 'json'
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/opt/bflow/logs/errors.log',
            'maxBytes': 1024 * 1024 * 100,  # 100 MB
            'backupCount': 10,
            'formatter': 'json'
        },
        'security': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/opt/bflow/logs/security.log',
            'maxBytes': 1024 * 1024 * 100,  # 100 MB
            'backupCount': 30,
            'formatter': 'json'
        },
        'performance': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/opt/bflow/logs/performance.log',
            'maxBytes': 1024 * 1024 * 100,  # 100 MB
            'backupCount': 7,
            'formatter': 'json'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['error_file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'security': {
            'handlers': ['security'],
            'level': 'INFO',
            'propagate': False,
        },
        'performance': {
            'handlers': ['performance'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    }
}
```

### 6.3 Monitoring Stack Setup

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    ports:
      - "9093:9093"
    networks:
      - monitoring

  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    ports:
      - "9100:9100"
    networks:
      - monitoring

  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yaml:/etc/loki/local-config.yaml
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - /opt/bflow/logs:/var/log/bflow:ro
      - ./promtail-config.yaml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
  loki_data:

networks:
  monitoring:
    driver: bridge
```

## 7. Backup & Recovery

### 7.1 Backup Strategy

```bash
#!/bin/bash
# backup.sh

set -e

# Configuration
BACKUP_DIR="/opt/bflow/backups"
S3_BUCKET="bflow-backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
echo "Backing up database..."
mysqldump \
    -h "$DB_HOST" \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    "$DB_NAME" \
    --single-transaction \
    --routines \
    --triggers \
    --events | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# Media files backup
echo "Backing up media files..."
tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" -C /opt/bflow media/

# Configuration backup
echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" \
    /opt/bflow/app/.env \
    /etc/nginx/sites-available/bflow \
    /etc/systemd/system/bflow*.service

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" "s3://$S3_BUCKET/database/"
aws s3 cp "$BACKUP_DIR/media_backup_$DATE.tar.gz" "s3://$S3_BUCKET/media/"
aws s3 cp "$BACKUP_DIR/config_backup_$DATE.tar.gz" "s3://$S3_BUCKET/config/"

# Clean old local backups
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete

# Clean old S3 backups
aws s3 ls "s3://$S3_BUCKET/" --recursive | \
    awk '{print $4}' | \
    grep -E "backup_[0-9]{14}" | \
    while read -r file; do
        file_date=$(echo "$file" | grep -oE "[0-9]{14}")
        if [ "$file_date" -lt "$(date -d "$RETENTION_DAYS days ago" +%Y%m%d%H%M%S)" ]; then
            aws s3 rm "s3://$S3_BUCKET/$file"
        fi
    done

echo "Backup completed successfully"
```

### 7.2 Recovery Procedures

```bash
#!/bin/bash
# restore.sh

set -e

# Configuration
BACKUP_DIR="/opt/bflow/backups"
S3_BUCKET="bflow-backups"

# Function to list available backups
list_backups() {
    echo "Available backups:"
    aws s3 ls "s3://$S3_BUCKET/database/" | grep "db_backup" | awk '{print $4}'
}

# Function to restore database
restore_database() {
    local backup_file=$1
    
    echo "Downloading backup..."
    aws s3 cp "s3://$S3_BUCKET/database/$backup_file" "$BACKUP_DIR/"
    
    echo "Stopping application..."
    systemctl stop bflow bflow-celery bflow-celery-beat
    
    echo "Restoring database..."
    gunzip < "$BACKUP_DIR/$backup_file" | mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"
    
    echo "Running migrations..."
    cd /opt/bflow/app
    source venv/bin/activate
    python manage.py migrate
    
    echo "Starting application..."
    systemctl start bflow bflow-celery bflow-celery-beat
    
    echo "Database restored successfully"
}

# Function to restore media files
restore_media() {
    local backup_file=$1
    
    echo "Downloading backup..."
    aws s3 cp "s3://$S3_BUCKET/media/$backup_file" "$BACKUP_DIR/"
    
    echo "Restoring media files..."
    tar -xzf "$BACKUP_DIR/$backup_file" -C /opt/bflow/
    
    echo "Setting permissions..."
    chown -R bflow:www-data /opt/bflow/media
    chmod -R 755 /opt/bflow/media
    
    echo "Media files restored successfully"
}

# Main script
case "$1" in
    list)
        list_backups
        ;;
    database)
        if [ -z "$2" ]; then
            echo "Usage: $0 database <backup_file>"
            exit 1
        fi
        restore_database "$2"
        ;;
    media)
        if [ -z "$2" ]; then
            echo "Usage: $0 media <backup_file>"
            exit 1
        fi
        restore_media "$2"
        ;;
    *)
        echo "Usage: $0 {list|database|media} [backup_file]"
        exit 1
        ;;
esac
```

## 8. Troubleshooting

### 8.1 Common Issues

#### Application Won't Start
```bash
# Check service status
systemctl status bflow

# Check logs
journalctl -u bflow -n 100

# Check port binding
netstat -tlnp | grep 8000

# Check permissions
ls -la /opt/bflow/app/
```

#### Database Connection Issues
```bash
# Test database connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"

# Check database status
systemctl status mysql

# Check network connectivity
telnet $DB_HOST 3306
```

#### Static Files Not Loading
```bash
# Collect static files
python manage.py collectstatic --noinput

# Check Nginx configuration
nginx -t

# Check static files directory
ls -la /opt/bflow/static/

# Check permissions
chown -R bflow:www-data /opt/bflow/static/
```

### 8.2 Performance Issues

```bash
# Check system resources
top
htop
iotop

# Check database slow queries
mysql -e "SHOW PROCESSLIST"

# Check Redis
redis-cli ping
redis-cli info stats

# Check Celery workers
celery -A misui inspect active

# Profile Django
python manage.py runprofileserver --use-cprofile --prof-path=/tmp/profiles
```

### 8.3 Emergency Procedures

#### Rollback Deployment
```bash
#!/bin/bash
# rollback.sh

# Get previous version
PREVIOUS_VERSION=$(git tag | tail -2 | head -1)

echo "Rolling back to $PREVIOUS_VERSION"

# Checkout previous version
git checkout $PREVIOUS_VERSION

# Restore database from backup
./restore.sh database "db_backup_$(date +%Y%m%d)*.sql.gz"

# Restart services
systemctl restart bflow bflow-celery bflow-celery-beat nginx

echo "Rollback completed"
```

## 9. Security Hardening

### 9.1 System Security

```bash
# Disable root SSH
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Configure fail2ban
apt install fail2ban -y
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https"]
logpath = /opt/bflow/logs/nginx-error.log
EOF

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# System hardening
echo "kernel.randomize_va_space = 2" >> /etc/sysctl.conf
echo "net.ipv4.conf.all.accept_redirects = 0" >> /etc/sysctl.conf
echo "net.ipv4.conf.all.send_redirects = 0" >> /etc/sysctl.conf
sysctl -p
```

### 9.2 Application Security

```python
# security_middleware.py
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseForbidden
import re

class SecurityMiddleware:
    """Custom security middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Blocked user agents
        self.blocked_agents = [
            'sqlmap',
            'nikto',
            'scanner',
            'bot'
        ]
        
        # Blocked paths
        self.blocked_paths = [
            r'\.\./',
            r'\.git',
            r'\.env',
            r'wp-admin',
            r'phpmyadmin'
        ]
    
    def __call__(self, request):
        # Check user agent
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        for agent in self.blocked_agents:
            if agent in user_agent:
                return HttpResponseForbidden('Forbidden')
        
        # Check path
        for pattern in self.blocked_paths:
            if re.search(pattern, request.path):
                return HttpResponseForbidden('Forbidden')
        
        # Add security headers
        response = self.get_response(request)
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response
```

## 10. Maintenance

### 10.1 Maintenance Mode

```bash
#!/bin/bash
# maintenance.sh

case "$1" in
    on)
        echo "Enabling maintenance mode..."
        touch /opt/bflow/maintenance.flag
        
        # Update Nginx to show maintenance page
        cat > /etc/nginx/sites-available/maintenance << 'EOF'
server {
    listen 80;
    server_name bflow.example.com;
    
    location / {
        return 503;
    }
    
    error_page 503 @maintenance;
    location @maintenance {
        root /opt/bflow/static/maintenance;
        rewrite ^.*$ /index.html break;
    }
}
EOF
        
        ln -sf /etc/nginx/sites-available/maintenance /etc/nginx/sites-enabled/bflow
        nginx -s reload
        echo "Maintenance mode enabled"
        ;;
        
    off)
        echo "Disabling maintenance mode..."
        rm -f /opt/bflow/maintenance.flag
        ln -sf /etc/nginx/sites-available/bflow /etc/nginx/sites-enabled/bflow
        nginx -s reload
        echo "Maintenance mode disabled"
        ;;
        
    *)
        echo "Usage: $0 {on|off}"
        exit 1
        ;;
esac
```

### 10.2 Health Check Script

```python
#!/usr/bin/env python
# health_check.py

import sys
import requests
import psutil
import subprocess
from datetime import datetime

def check_service(name):
    """Check if systemd service is running"""
    try:
        result = subprocess.run(
            ['systemctl', 'is-active', name],
            capture_output=True,
            text=True
        )
        return result.stdout.strip() == 'active'
    except:
        return False

def check_endpoint(url):
    """Check if HTTP endpoint is responding"""
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False

def check_disk_space():
    """Check available disk space"""
    usage = psutil.disk_usage('/')
    return usage.percent < 90

def check_memory():
    """Check available memory"""
    memory = psutil.virtual_memory()
    return memory.percent < 90

def main():
    checks = {
        'Web Service': check_service('bflow'),
        'Celery Worker': check_service('bflow-celery'),
        'Celery Beat': check_service('bflow-celery-beat'),
        'Nginx': check_service('nginx'),
        'MySQL': check_service('mysql'),
        'Redis': check_service('redis'),
        'Web Endpoint': check_endpoint('http://localhost/health'),
        'Disk Space': check_disk_space(),
        'Memory': check_memory()
    }
    
    failed_checks = [name for name, status in checks.items() if not status]
    
    if failed_checks:
        print(f"CRITICAL: Failed checks: {', '.join(failed_checks)}")
        sys.exit(1)
    else:
        print("OK: All checks passed")
        sys.exit(0)

if __name__ == '__main__':
    main()
```

## 11. Deployment Checklist

### Pre-Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan prepared
- [ ] Change log updated
- [ ] Documentation updated

### Deployment
- [ ] Enable maintenance mode
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Collect static files
- [ ] Restart services
- [ ] Run health checks
- [ ] Disable maintenance mode

### Post-Deployment
- [ ] Verify application functionality
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Verify integrations working
- [ ] User acceptance testing
- [ ] Update deployment log
- [ ] Notify stakeholders

---

**Document Version**: 1.0  
**Last Updated**: 2025-07-25  
**Maintained by**: DevOps Team  
**Next Review**: Monthly