package model

import "github.com/dgrijalva/jwt-go"

type User struct {
	ID         string `json:"id"`
	Email      string `json:"email"`
	Verified   string `json:"verified_email"`
	Name       string `json:"name"`
	GivenName  string `json:"given_name"`
	FamilyName string `json:"family_name"`
	Picture    string `json:"picture"`
	Locale     string `json:"locale"`
}

type Claims struct {
	UserID string
	jwt.StandardClaims
}
