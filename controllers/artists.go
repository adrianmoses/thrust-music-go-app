package controllers

import (
	"encoding/json"
	"fmt"
	dbc "github.com/ammoses89/thrust/db"
	models "github.com/ammoses89/thrust/models"
	"github.com/go-martini/martini"
)

type ArtistsController struct{}

var Artists ArtistsController

func (art ArtistsController) Get(params martini.Params, pg *dbc.Postgres) string {
	var artist models.Artist
	db, _ := pg.GetConn()
	db.First(&artist, params["id"])

	response, err := json.Marshal(artist)
	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	return string(response)
}

func (art ArtistsController) Save(params martini.Params, pg *dbc.Postgres) string {
	var artist models.Artist
	db, _ := pg.GetConn()
	db.First(&artist, params["id"])
	artist.Name = params["name"]
	artist.Description = params["description"]
	artist.ProfileImageUrl = params["profile_image_url"]
	db.Save(&artist)

	response, err := json.Marshal(artist)
	if err != nil {
		fmt.Println("Error ocurred: %v", err)
	}

	return string(response)
}

// TODO upload profile Image
