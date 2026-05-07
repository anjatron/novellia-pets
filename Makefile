setup:
	docker build -f docker/Dockerfile -t novellia-pets .

run:
	docker run -p 3000:3000 \
		-e DATABASE_URL="file:./dev.db" \
		-v novellia-pets-db:/app/prisma \
		novellia-pets