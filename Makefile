.PHONY: dev build up down logs shell clean help

# Variables
COMPOSE = docker compose
SERVICE_APP = app-dev
SERVICE_DB = mysql

help:
	@echo "🛠️  Comandos de App Obras Sociales:"
	@echo "  make dev    - Levanta todo (Build + Up + Logs)"
	@echo "  make build  - Reconstruye imagen (sin caché)"
	@echo "  make up     - Levanta contenedores"
	@echo "  make down   - Baja contenedores"
	@echo "  make logs   - Ver logs"
	@echo "  make shell  - Entrar a la terminal del container"
	@echo "  make clean  - ⚠️  Borra todo (incluyendo base de datos)"

dev:
	$(COMPOSE) up -d --build
	$(COMPOSE) logs -f $(SERVICE_APP)

build:
	$(COMPOSE) build --no-cache $(SERVICE_APP)

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f $(SERVICE_APP)

shell:
	$(COMPOSE) exec -it $(SERVICE_APP) /bin/bash

clean:
	$(COMPOSE) down -v --remove-orphans