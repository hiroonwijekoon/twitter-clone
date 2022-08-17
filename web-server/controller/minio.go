package controller

import (
	"bytes"
	"fmt"
	"mime/multipart"
	"net/http"
	"time"
	"webserver/utils"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

//Retrieve images from MinIO
func RetrieveImage(tweet_id string) string {

	key := aws.String(tweet_id)

	//Check if the image exists
	_, err := s3.New(utils.CurrentSession).HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(*utils.Bucket),
		Key:    key,
	})
	if err != nil {
		return ""
	}

	//If image exists return the signed URL
	req, _ := s3.New(utils.CurrentSession).GetObjectRequest(&s3.GetObjectInput{
		Bucket: utils.Bucket,
		Key:    key,
	})
	URLstr, err := req.Presign(15 * time.Minute)
	if err != nil {
		fmt.Println("Failed to get signed URL")
		return ""
	}

	return URLstr
}

// Saves a file to MinIo bucket
func UploadFileToS3(s *session.Session, file multipart.File, fileHeader *multipart.FileHeader, tweet_id string) (string, error) {
	// read the file content into a buffer
	size := fileHeader.Size
	buffer := make([]byte, size)
	file.Read(buffer)

	// create a unique file name with tweet id
	imageFileName := tweet_id

	// filename, content-type and storage class of the file
	_, err := s3.New(s).PutObject(&s3.PutObjectInput{
		Bucket:      utils.Bucket,
		Key:         aws.String(imageFileName),
		ACL:         aws.String("public-read"),
		Body:        bytes.NewReader(buffer),
		ContentType: aws.String(http.DetectContentType(buffer)),
	})
	if err != nil {
		return "", err
	}

	//Wait until the image is uploaded
	err = s3.New(utils.CurrentSession).WaitUntilObjectExists(&s3.HeadObjectInput{
		Bucket: aws.String(*utils.Bucket),
		Key:    aws.String(imageFileName),
	})

	if err != nil {
		fmt.Printf("Coudn't check if the image file is uploaded")
		return "", err
	}

	return imageFileName, err
}

//Delete images when the tweet is getting deleted
func DeleteImage(tweet_id string) {

	key := aws.String(tweet_id)

	//Check if the image exists
	_, err := s3.New(utils.CurrentSession).HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(*utils.Bucket),
		Key:    key,
	})
	if err != nil {
		return
	}

	//Delete if the images exists
	_, err = s3.New(utils.CurrentSession).DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(*utils.Bucket),
		Key:    key,
	})
	if err != nil {
		fmt.Printf("Coudn't delete image file")
		return
	}

	//Wait until the image is deleted
	err = s3.New(utils.CurrentSession).WaitUntilObjectNotExists(&s3.HeadObjectInput{
		Bucket: aws.String(*utils.Bucket),
		Key:    key,
	})
	if err != nil {
		fmt.Printf("Coudn't check if the image file is deleted or not")
		return
	}

}
