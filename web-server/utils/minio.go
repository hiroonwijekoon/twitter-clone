package utils

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/joho/godotenv"
)

var S3Config = &aws.Config{}
var CurrentSession = session.New()
var S3Client = s3.New(CurrentSession)
var Bucket = aws.String("")

func InitMinIO() {

	envErr := godotenv.Load(".env")
	if envErr != nil {
		fmt.Printf("Couldn't load .env file")
	}

	S3Config = &aws.Config{
		//Credentials:      credentials.NewStaticCredentials(os.Getenv("MINIO_USERNAME"), os.Getenv("MINIO_PASSWORD"), ""),
		//Endpoint:         aws.String("http://localhost:9000"),
		Region: aws.String("ap-northeast-1"),
		//DisableSSL:       aws.Bool(true),
		//S3ForcePathStyle: aws.Bool(true),
	}

	CurrentSession = session.New(S3Config)
	S3Client = s3.New(CurrentSession)
	Bucket = aws.String("intern-hiroon")

}
