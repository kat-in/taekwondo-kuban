install:
	npm ci 
build:
	npm ci && npm run build
lint:
	npx eslint .
test:
	npm --prefix backend test
backup:
	./scripts/backup.sh
save-content:
	./scripts/save-content.sh
