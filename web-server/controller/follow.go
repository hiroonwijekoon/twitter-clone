package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
	"webserver/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-redis/redis/v8"
)

//Follow / Unfollow users
//POST -> /api/users/{id}/following
func FollowUser(w http.ResponseWriter, r *http.Request) {
	follower := chi.URLParam(r, "id")     //returns param id
	following := r.FormValue("following") //returns form value of following user

	if !isAuthenticated(r, follower) {
		http.Error(w, "User is not authenticated!", http.StatusUnauthorized)
		return
	}

	//Check if the user exists
	_, err := utils.RDB.ZRank(utils.Ctx, "following:"+follower, following).Result()
	if err != nil {
		//user doesn't exist in the list
		//follow user
		member_follower := &redis.Z{
			Score:  float64(time.Now().Unix()),
			Member: follower,
		}

		member_following := &redis.Z{
			Score:  float64(time.Now().Unix()),
			Member: following,
		}

		_, err := utils.RDB.ZAdd(utils.Ctx, "followers:"+following, member_follower).Result()
		if err != nil {
			log.Println("Failed to add follower")
		}
		_, err = utils.RDB.ZAdd(utils.Ctx, "following:"+follower, member_following).Result()
		if err != nil {
			log.Println("Failed to add following")
		}
		log.Println("Followed!")
		return
	}
	//user exists in the list
	//unfollow user
	_, err = utils.RDB.ZRem(utils.Ctx, "followers:"+following, follower).Result()
	if err != nil {
		log.Println("Failed to remove following")
	}
	_, err = utils.RDB.ZRem(utils.Ctx, "following:"+follower, following).Result()
	if err != nil {
		log.Println("Failed to remove following")
	}

	log.Println("Unfollowed!")
}

//Get followers
//GET -> /api/users/{id}/followers/
func RetrieveFollowers(w http.ResponseWriter, r *http.Request) {
	id_param := chi.URLParam(r, "id") //returns param id

	followers, err := utils.RDB.ZRange(utils.Ctx, "followers:"+id_param, 0, -1).Result()
	if err != nil {
		log.Println("No followers found")
	}

	json.NewEncoder(w).Encode(followers)
}

//Get following
//GET -> /api/users/{id}/following/
func RetrieveFollowing(w http.ResponseWriter, r *http.Request) {
	id_param := chi.URLParam(r, "id") //returns param id

	following, err := utils.RDB.ZRange(utils.Ctx, "following:"+id_param, 0, -1).Result()
	if err != nil {
		log.Println("No following found")
	}

	json.NewEncoder(w).Encode(following)
}
