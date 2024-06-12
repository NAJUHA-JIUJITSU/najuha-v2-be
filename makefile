.PHONY: dev dev-clean dev-fclean test test-fclean test-re performance performance-clean performance-fclean

# -----------------------------------------------------------------------------
# Dev
# -----------------------------------------------------------------------------
dev:
	docker-compose --env-file .env.dev up

dev-clean:
	docker-compose --env-file .env.dev down

dev-fclean:
	docker-compose --env-file .env.dev down -v


# -----------------------------------------------------------------------------
# Test
# -----------------------------------------------------------------------------
test:
	docker-compose --env-file .env.test -f docker-compose.test.yml up -d

test-clean:
	docker-compose --env-file .env.test -f docker-compose.test.yml down

test-fclean:
	docker-compose --env-file .env.test -f docker-compose.test.yml down -v

test-re:
	docker-compose --env-file .env.test -f docker-compose.test.yml down -v
	docker-compose --env-file .env.test -f docker-compose.test.yml up -d


# -----------------------------------------------------------------------------
# Performance
# -----------------------------------------------------------------------------
performance:
	docker-compose --env-file .env.performance -f docker-compose.performance.yml up --build

performance-clean:
	docker-compose --env-file .env.performance -f docker-compose.performance.yml down

performance-fclean:
	docker-compose --env-file .env.performance -f docker-compose.performance.yml down -v
