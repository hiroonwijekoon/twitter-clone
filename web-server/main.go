package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"webserver/controller"
	"webserver/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

//Handle Routes
func handleRequests() {
	r := chi.NewRouter()

	r.Use(middleware.CleanPath) //clean out double slash mistakes from a user's request path
	//Enable CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	//Routes
	r.Get("/api/tweets", controller.GetAllTweets)
	r.Get("/api/tweets/{id}", controller.GetSingleTweet)
	r.Post("/api/tweets", controller.CreateTweet)
	r.Delete("/api/tweets/{id}", controller.DeleteTweet)
	r.Put("/api/tweets/{id}", controller.UpdateTweet)
	r.Get("/api/google/login", controller.GoogleLogin)
	r.Get("/api/google/callback", controller.GoogleCallBack)
	r.Get("/api/user/authenticate", controller.AuthenticateUser)
	r.Get("/api/user/logout", controller.LogoutUser)
	r.Get("/api/users", controller.GetAllUsers)
	r.Get("/api/users/{id}", controller.GetSingleUser)
	r.Get("/api/users/{id}/followers", controller.RetrieveFollowers)
	r.Get("/api/users/{id}/following", controller.RetrieveFollowing)
	r.Post("/api/users/{id}/following", controller.FollowUser)

	//Serve Front End
	FileServer(r)

	fmt.Printf("Starting server at port:80")

	log.Fatal(http.ListenAndServe(":80", r))
}

// Handle Front End with all routes
func FileServer(router *chi.Mux) {
	path := "./web-client"
	fs := http.FileServer(http.Dir(path))

	router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		if _, err := os.Stat(path + r.RequestURI); os.IsNotExist(err) {
			http.StripPrefix(r.RequestURI, fs).ServeHTTP(w, r)
		} else {
			fs.ServeHTTP(w, r)
		}
	})
}

func main() {
	utils.InitRedis() //Initialize Redis Connection
	utils.InitMinIO() //Initialize MinIO Connection
	handleRequests()  //handle requests and routes
}
