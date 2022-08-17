package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
	"webserver/config"
	"webserver/model"
	"webserver/utils"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	googleConfig := config.SetupGoogleOAuth()

	oauthstate := utils.GenerateStateOauthCookie(w)

	//Generate a cookie containing OAuth state
	url := googleConfig.AuthCodeURL(oauthstate)

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GoogleCallBack(w http.ResponseWriter, r *http.Request) {
	state := r.URL.Query()["state"][0]
	//Get oauthstate token from the cookie
	oauthState, _ := r.Cookie("googleoauthstate")
	if state != oauthState.Value {
		fmt.Printf("Error: Invalid google OAuth state")
		return
	}

	//get code
	code := r.URL.Query()["code"][0]
	googleConfig := config.SetupGoogleOAuth()

	//exchange code for token
	token, err := googleConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("Code exchange failed")
	}

	//use google api to get user data
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		fmt.Println("User data fetch failed")
	}

	defer resp.Body.Close()

	//parse response
	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("JSON parsing failed")
	}

	//Save user in Redis
	var user model.User
	json.Unmarshal([]byte(userData), &user)

	json_, _ := json.Marshal(model.User{
		ID:         user.ID,
		Email:      user.Email,
		Verified:   user.Verified,
		Name:       user.Name,
		GivenName:  user.GivenName,
		FamilyName: user.FamilyName,
		Picture:    user.Picture,
		Locale:     user.Locale,
	})

	//Auto Increment ID
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	key := "user:" + user.ID
	err = utils.RDB.Set(utils.Ctx, key, json_, 0).Err()
	if err != nil {
		fmt.Println("Error sending to Redis")
	}

	//Prepare JWT for authentication
	expirationTime := time.Now().Add(time.Hour * 1)

	claims := &model.Claims{
		UserID: user.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	//Generate Token
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtTokenString, err := jwtToken.SignedString(jwtKey)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
	}

	//Set cookie with token
	http.SetCookie(w, &http.Cookie{
		Name:     "twitter_user_token",
		Value:    jwtTokenString,
		Expires:  expirationTime,
		HttpOnly: true,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
	})

	http.Redirect(w, r, "https://hiroonwijekoon.intern.aws.prd.demodesu.com/", http.StatusSeeOther)

}

//check authentication status to protect handlers
func isAuthenticated(r *http.Request, user_id string) bool {
	cookie, err := r.Cookie("twitter_user_token")
	if err != nil {
		if err == http.ErrNoCookie {
			return false

		}
		return false
	}
	tokenStr := cookie.Value
	claims := &model.Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
	if err != nil {
		return false
	}
	if !token.Valid {
		return false
	}
	//check if encoded UserID in cookie matches with the user_id string
	if claims.UserID != user_id {
		return false
	}
	log.Println("Action Authenticated!")
	return true
}

//Authenticate user and get user data
func AuthenticateUser(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("twitter_user_token")
	if err != nil {
		if err == http.ErrNoCookie {
			//Todo -> Redirect to login screen
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tokenStr := cookie.Value
	claims := &model.Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if !token.Valid {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var user model.User

	//retrieve user from db
	key := "user:" + claims.UserID
	val, err := utils.RDB.Get(utils.Ctx, key).Result()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	json.Unmarshal([]byte(val), &user)
	json.NewEncoder(w).Encode(user)

}

//Logout user
func LogoutUser(w http.ResponseWriter, _ *http.Request) {
	//Remove cookie (set expiry to past)
	http.SetCookie(w, &http.Cookie{
		Name:     "twitter_user_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
		Path:     "/",
	})
}
