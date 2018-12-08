package controllers

import (
	"fmt"
	// "encoding/json"
	"github.com/go-martini/martini"
	// dbc "github.com/ammoses89/thrust/db"
	// models "github.com/ammoses89/thrust/models"
)

type EventsController struct{}

var Events EventsController

func (event *EventsController) Get(params martini.Params) string {
	eventId := params["id"]
	return fmt.Sprintf("{\"events\": %d}", eventId)
}

func (event *EventsController) Generate(params martini.Params) string {
	eventId := params["id"]
	return fmt.Sprintf("{\"events\": %d}", eventId)
}
