
.PHONY: test

dev:
	docker-compose --env-file .env.dev up

dev-clean:
	docker-compose --env-file .env.dev down

dev-fclean:
	docker-compose --env-file .env.dev down -v

test:
	docker-compose --env-file .env.test -f docker-compose.test.yml up -d

test-fclean:
	docker-compose --env-file .env.test -f docker-compose.test.yml down -v

test-re:
	docker-compose --env-file .env.test -f docker-compose.test.yml down -v
	docker-compose --env-file .env.test -f docker-compose.test.yml up -d
