package utils

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"
)

var RDB = redis.NewClient(&redis.Options{})
var Ctx = context.Background()

//Initialize Redis Server
func InitRedis() {

	opt, err := redis.ParseURL("redis://intern-hiroon-tclone-redis-cluster.x76uwt.0001.apne1.cache.amazonaws.com:6379")
	if err != nil {
		fmt.Println(err.Error())
	}
	/*RDB = redis.NewClient(&redis.Options{
		Addr:     "redis://intern-hiroon-tclone-redis-cluster.x76uwt.0001.apne1.cache.amazonaws.com:6379",
		Password: "",
		DB:       0,
	})*/

	RDB = redis.NewClient(opt)

	err = RDB.Ping(Ctx).Err() //Make sure the connection is working
	if err != nil {
		fmt.Println(err.Error())
	}
}
