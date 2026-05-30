install:
	npm ci 
build:
	npm ci && npm run build
lint:
	npx eslint .