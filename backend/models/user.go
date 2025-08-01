package models

type User struct {
	ID int
	Username string
	Email string
	Password string
}

type UserInput struct {
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
}