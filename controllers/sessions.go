package controllers

import (
	"encoding/json"
	"fmt"
	dbc "github.com/ammoses89/thrust/db"
	lib "github.com/ammoses89/thrust/lib"
	models "github.com/ammoses89/thrust/models"
	"github.com/go-martini/martini"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type SessionsController struct{}

type UserData struct {
	Id     int    `json:"id"`
	Email  string `json:"email"`
	Artist int   `json:"artist"`
}

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type TokenMessage struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

type TokenResponse struct {
	Id    uint   `json:"id"`
	Token string `json:"token"`
}

type TokenRequest struct {
	Token string `json:"token"`
}

func EncrpytPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

var Sessions SessionsController

func (session *SessionsController) Get(req *http.Request) string {
	auth := &lib.Auth{}
	decodedData, err := auth.Decode(req.Header.Get("Authorization"))

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	userData := &UserData{}
	userData.Id = int(decodedData["id"].(float64))
	userData.Email = decodedData["email"].(string)
	userData.Artist = int(decodedData["primary_artist_id"].(float64))

	data, err := json.Marshal(userData)

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	return string(data)
}

func (session *SessionsController) IsValidToken(params martini.Params, req *http.Request) string {
	auth := &lib.Auth{}

	decoder := json.NewDecoder(req.Body)
	var tokenRequest TokenRequest
	err := decoder.Decode(&tokenRequest)
	decodedData, err := auth.Decode(tokenRequest.Token)

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}
	var tokenMessage TokenMessage
	if decodedData == nil {
		tokenMessage.Message = "not valid"
		tokenMessage.Status = 500
	} else {
		tokenMessage.Message = "success"
		tokenMessage.Status = 200
	}

	data, err := json.Marshal(tokenMessage)

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}
	return string(data)
}

func (session *SessionsController) Create(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
	decoder := json.NewDecoder(req.Body)
	var newUser LoginUser
	err := decoder.Decode(&newUser)

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	passwordHash, err := EncrpytPassword(newUser.Password)
	db, _ := pg.GetConn()

	var tokenData []byte
	var user models.User
	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	} else {
		user = models.User{Email: newUser.Email, Password: passwordHash}
		db.Create(&user)
	}

	if db.NewRecord(user) == false {
		var artist models.Artist
		artist.Name = "Untitled Artist"
		artist.Description = ""
		artist.UserID = user.ID
		db.Create(&artist)
		db.Model(&user).Update("PrimaryArtistID", artist.ID)

		tokenResponse := &TokenResponse{}
		tokenResponse.Id = user.ID
		tokenResponse.Token = session.generateToken(&user)
		tokenData, err = json.Marshal(tokenResponse)
		if err != nil {
			fmt.Println("Error ocurred: %v", err)
		}
	} else {
		// errors
		tokenMessage := &TokenMessage{}
		tokenMessage.Message = fmt.Sprintf("Error occured: %v", err)
		tokenMessage.Status = 500
		tokenData, err = json.Marshal(tokenMessage)
		if err != nil {
			fmt.Println("Error ocurred: %v", err)
		}

	}

	return string(tokenData)
}

func (session *SessionsController) GetToken(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
	var user models.User
	var tokenData []byte
	var err error
	var existingUser LoginUser

	decoder := json.NewDecoder(req.Body)
	err = decoder.Decode(&existingUser)

	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	db, _ := pg.GetConn()
	db.Where("email = ?", existingUser.Email).First(&user)
	if user.Model.ID != 0 && CheckPasswordHash(existingUser.Password, user.Password) {
		tokenResponse := &TokenResponse{}
		tokenResponse.Id = user.ID
		tokenResponse.Token = session.generateToken(&user)
		tokenData, err = json.Marshal(tokenResponse)

		if err != nil {
			fmt.Println("Error ocurred: %v", err)
		}
	} else {
		tokenMessage := &TokenMessage{}
		tokenMessage.Message = "Invalid Email or Password"
		tokenMessage.Status = 500
		tokenData, err = json.Marshal(tokenMessage)
		if err != nil {
			fmt.Println("Error ocurred: %v", err)
		}
	}
	return string(tokenData)
}

func (session *SessionsController) generateToken(user *models.User) string {
	auth := &lib.Auth{}

	// Issue a token
	tokenString, err := auth.Issue(
		user.ID,
		user.Email,
		user.PrimaryArtistID)

	// check error
	if err != nil {
		fmt.Println("Error ocurred: %v", err)
		panic(err)
	}

	return tokenString
}
