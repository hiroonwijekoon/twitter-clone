FROM golang:latest

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o app-amd64-linux main.go

CMD ["./app-amd64-linux","--host","0.0.0.0","--port","80"]