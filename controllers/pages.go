package controllers

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "encoding/json"
    "github.com/ammoses89/thrust-outreach/lib"
    dbc "github.com/ammoses89/thrust-outreach/db"
    models "github.com/ammoses89/thrust-outreach/models"
    "github.com/go-martini/martini"
)

type PagesController struct{}

var Pages PagesController

type PageBody struct {
    Title string `json:"title"`
    HTML string  `json:"html"`
    PageHash string `json:"page_hash"`
    PageSlug string `json:"page_slug"`
}

func (pages *PagesController) Create(req *http.Request, params martini.Params, pg *dbc.Postgres) string {
    jwtToken := req.Header.Get("Authorization")

    auth := &lib.Auth{}
    decodedData, err := auth.Decode(jwtToken)
    if err != nil {
        message := fmt.Sprintf("Authorization invalid: %v", err)
        return ReturnErrorResponse(message)
    }
    userData := &UserData{}
    userData.Id = int(decodedData["id"].(float64))
    userData.Email = decodedData["email"].(string)
    userData.Artist = int(decodedData["primary_artist_id"].(float64))

    var pageBody PageBody
    body, _ := ioutil.ReadAll(req.Body)
    if err := json.Unmarshal(body, &pageBody); err != nil {
        fmt.Printf("Error occured in unmarshalling body: %#v\n", err)
    }

    pageHash := genHash()
    var pageModel models.Page 
    pageModel = models.Page{
        ArtistID: userData.Artist,
        Title: pageBody.Title,
        HTML: pageBody.HTML,
        PageSlug: pageBody.PageSlug,
        PageHash: pageHash,
    }

    db, _ := pg.GetConn()
    db.Create(&pageModel)
    resp := fmt.Sprintf("{\"page_hash\": %s, \"status\": 200}", pageModel.PageHash)
    return resp
}


func (pages *PagesController) Save(req *http.Request, params martini.Params, pg *dbc.Postgres) string {
    jwtToken := req.Header.Get("Authorization")

    auth := &lib.Auth{}
    decodedData, err := auth.Decode(jwtToken)
    if err != nil {
        message := fmt.Sprintf("Authorization invalid: %v", err)
        return ReturnErrorResponse(message)
    }
    userData := &UserData{}
    userData.Id = int(decodedData["id"].(float64))
    userData.Email = decodedData["email"].(string)
    userData.Artist = int(decodedData["primary_artist_id"].(float64))

    var pageBody PageBody
    body, _ := ioutil.ReadAll(req.Body)
    if err := json.Unmarshal(body, &pageBody); err != nil {
        fmt.Printf("Error occured in unmarshalling body: %#v\n", err)
    }

    var pageModel models.Page 
    pageModel = models.Page{
        ArtistID: userData.Artist,
        Title: pageBody.Title,
        HTML: pageBody.HTML,
        PageSlug: pageBody.PageSlug,
        PageHash: pageBody.PageHash,
    }

    db, _ := pg.GetConn()
    db.Create(&pageModel)
    resp := fmt.Sprintf("{\"page_hash\": %s, \"status\": 200}", pageModel.PageHash)
    return resp
}