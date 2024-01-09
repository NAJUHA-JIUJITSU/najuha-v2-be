.PHONY: test

dev:
	docker-compose --env-file .env.dev up

test:
	docker-compose --env-file .env.test up

down:
	docker-compose down



# .PHONY: test

# dev:
# 	docker-compose --env-file .env.dev -p $${COMPOSE_PROJECT_NAME} up -d

# test:
# 	docker-compose --env-file .env.test -p $${COMPOSE_PROJECT_NAME} up -d

# down_dev:
# 	docker-compose --env-file .env.dev -p $${COMPOSE_PROJECT_NAME} down

# down_test:
# 	docger-compose --env-file .env.test -p $${COMPOSE_PROJECT_NAME} down
