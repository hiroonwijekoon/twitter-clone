package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"webserver/model"
	"webserver/utils"

	"github.com/go-chi/chi/v5"
)

//GET -> /api/tweets
//Return All Tweets
func GetAllTweets(w http.ResponseWriter, _ *http.Request) {

	var cursor uint64
	var Tweets []model.Tweet
	var tweet model.Tweet

	//To-Do Optimize get users without iterating
	for {
		var keys []string
		var err error
		keys, cursor, err = utils.RDB.Scan(utils.Ctx, cursor, "tweet:*", 0).Result()
		if err != nil {
			panic(err)
		}
		for _, key := range keys {
			val, err := utils.RDB.Get(utils.Ctx, key).Result()
			if err != nil {
				http.Error(w, err.Error(), 500)
			}
			json.Unmarshal([]byte(val), &tweet)
			//Retrieve images if there is any
			tweet.Image = RetrieveImage(strconv.Itoa(tweet.ID))
			Tweets = append(Tweets, tweet)
		}
		if cursor == 0 { // no more keys
			break
		}
	}
	json.NewEncoder(w).Encode(Tweets)
}

//POST -> /api/tweets
//Create new tweet
func CreateTweet(w http.ResponseWriter, r *http.Request) {
	var tweet model.Tweet
	tweet.UserID = r.FormValue("user_id")

	if !isAuthenticated(r, tweet.UserID) {
		http.Error(w, "User is not authenticated!", http.StatusUnauthorized)
		return
	}

	maxSize := int64(20048000) // allow only 20MB of tweet size

	err := r.ParseMultipartForm(maxSize)
	if err != nil {
		fmt.Fprintf(w, "Tweet is too large. Max Size: %v", maxSize)
		return
	}

	tweet.Content = r.FormValue("content")

	//Auto Increment ID
	next_tweet_ID, err := utils.RDB.Incr(utils.Ctx, "next_tweet_id").Result()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	tweet.ID = int(next_tweet_ID)
	tweet.Created = time.Now()

	tweetJSON, _ := json.Marshal(tweet)

	//send to db
	key := "tweet:" + strconv.Itoa(tweet.ID)
	err = utils.RDB.Set(utils.Ctx, key, tweetJSON, 0).Err()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	//Read and validate image data
	file, fileHeader, err := r.FormFile("file")

	if err == http.ErrMissingFile {
		fmt.Printf("Tweet Added. No Image Found.")
		return
	}

	defer file.Close()
	fmt.Printf("File found")

	fileName, err := UploadFileToS3(utils.CurrentSession, file, fileHeader, strconv.Itoa(tweet.ID))
	if err != nil {
		fmt.Printf("Could not upload file")
		return
	}

	if fileName == "" {
		fmt.Printf("Coudn't check if the image file is updated or not")
		return
	}
	fmt.Printf("Tweet Added. Image Added.")

}

//GET -> /api/tweets/{id}
//Retrieve single tweet
func GetSingleTweet(w http.ResponseWriter, r *http.Request) {

	id_param := chi.URLParam(r, "id")      //returns param id
	_id_param, _ := strconv.Atoi(id_param) //type conversion string to int
	var tweet model.Tweet

	//retrieve from db
	key := "tweet:" + strconv.Itoa(_id_param)
	val, err := utils.RDB.Get(utils.Ctx, key).Result()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	json.Unmarshal([]byte(val), &tweet)

	//Retrieve images if there is any
	tweet.Image = RetrieveImage(strconv.Itoa(tweet.ID))
	json.NewEncoder(w).Encode(tweet)
}

//DELETE -> /api/tweet/{id}
//Delete Tweet
func DeleteTweet(w http.ResponseWriter, r *http.Request) {
	id_param := chi.URLParam(r, "id")      //returns param id
	_id_param, _ := strconv.Atoi(id_param) //type conversion string to int

	//retrieve from db
	key := "tweet:" + strconv.Itoa(_id_param)
	if err := utils.RDB.Del(utils.Ctx, key).Err(); err != nil {
		http.Error(w, err.Error(), 500)
	}

	//Delete images if there is any
	DeleteImage(strconv.Itoa(_id_param))

	fmt.Printf("Tweet %s is deleted", strconv.Itoa(_id_param))

}

//PUT -> /api/tweets/{id}
//Update single tweet
func UpdateTweet(w http.ResponseWriter, r *http.Request) {
	var updatedTweet model.Tweet
	updatedTweet.UserID = r.FormValue("user_id")

	if !isAuthenticated(r, updatedTweet.UserID) {
		http.Error(w, "User is not authenticated!", http.StatusUnauthorized)
		return
	}

	maxSize := int64(20048000) // allow only 20MB of tweet size

	err := r.ParseMultipartForm(maxSize)
	if err != nil {
		fmt.Fprintf(w, "Tweet is too large. Max Size: %v", maxSize)
		return
	}

	updatedTweet.ID, _ = strconv.Atoi(chi.URLParam(r, "id"))
	updatedTweet.Content = r.FormValue("content")

	tweetJSON, _ := json.Marshal(updatedTweet)

	//send to db
	key := "tweet:" + strconv.Itoa(updatedTweet.ID)
	err = utils.RDB.Set(utils.Ctx, key, tweetJSON, 0).Err()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	//Read and validate image data
	file, fileHeader, err := r.FormFile("file")

	if err == http.ErrMissingFile {
		log.Printf("Tweet Updated. No Image Found.")
		return
	}
	defer file.Close()
	log.Printf("File found")

	fileName, err := UploadFileToS3(utils.CurrentSession, file, fileHeader, strconv.Itoa(updatedTweet.ID))
	if err != nil {
		log.Printf("Could not upload file")
		return
	}

	if fileName == "" {
		log.Printf("Coudn't check if the image file is updated or not")
		return
	}
	fmt.Printf("Tweet Updated. Image Added.")
}
