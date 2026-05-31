FROM golang:alpine

# Install Docker CLI so we can spawn containers (Docker-in-Docker / mount docker socket)
RUN apk add --no-cache docker-cli

WORKDIR /app

# We don't have a go.sum yet if we didn't add any external deps, 
# but it's good practice to copy go.mod and go.sum.
COPY go.mod ./
RUN go mod download || true

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
