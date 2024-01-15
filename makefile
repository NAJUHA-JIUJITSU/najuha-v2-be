
.PHONY: test

dev:
	docker-compose --env-file .env.dev up

test:
	docker-compose --env-file .env.test -f docker-compose.test.yml up -d

dev-down:
	docker-compose --env-file .env.dev down

test-down:
	docker-compose --env-file .env.test -f docker-compose.test.yml down -v
