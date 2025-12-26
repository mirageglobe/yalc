
# ===== Configuration =====

.DEFAULT_GOAL := help
.PHONY: help install run test test-watch clean

# ===== Helpers =====

help: ## Show this help menu
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ===== Menu =====

install: ## Install project dependencies
	npm install

run: ## Run the example test runner (run.js)
	node run.js

test: ## Run all tests using AVA
	npm test

test-watch: ## Run tests in watch mode
	npx ava --watch

clean: ## Remove node_modules and logs
	rm -rf node_modules
	rm -rf *.log
	rm -rf npm-debug.log*
