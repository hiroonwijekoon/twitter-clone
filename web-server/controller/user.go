package controller

import (
	"encoding/json"
	"net/http"
	"webserver/model"
	"webserver/utils"

	"github.com/go-chi/chi/v5"
)

//GET -> /api/user
//Return All Users
func GetAllUsers(w http.ResponseWriter, r *http.Request) {

	var cursor uint64
	var users []model.User
	var user model.User
	//To-Do Optimize get tweets without iretaing
	for {
		var keys []string
		var err error
		keys, cursor, err = utils.RDB.Scan(utils.Ctx, cursor, "user:*", 0).Result()
		if err != nil {
			http.Error(w, err.Error(), 500)
		}
		for _, key := range keys {
			val, err := utils.RDB.Get(utils.Ctx, key).Result()
			if err != nil {
				http.Error(w, err.Error(), 500)
			}
			json.Unmarshal([]byte(val), &user)
			users = append(users, user)
		}
		if cursor == 0 { // no more keys
			break
		}
	}
	json.NewEncoder(w).Encode(users)
}

//GET -> /api/user/{user_id}
//Retrieve single user
func GetSingleUser(w http.ResponseWriter, r *http.Request) {

	id_param := chi.URLParam(r, "id") //returns param id

	var user model.User

	//retrieve from db
	key := "user:" + id_param
	val, err := utils.RDB.Get(utils.Ctx, key).Result()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	json.Unmarshal([]byte(val), &user)
	json.NewEncoder(w).Encode(user)
}
