package controllers

import (
    "log"
    "net/http"
    "errors"
    "strconv"
    "encoding/json"
    "github.com/go-martini/martini"
    "github.com/ammoses89/thrust/lib"
    dbc "github.com/ammoses89/thrust/db"
    models "github.com/ammoses89/thrust/models"
)

type HooksController struct{}

var Hooks HooksController

type HookData struct {
    Message string `json:"message"`
    IsActive bool `json:"is_active"`
    Statement string `json:"statement"`
    Trigger string `json:"trigger"`
    Action string `json:"action"`
    ArtistID int `json:"artist_id"`
}

func (hook *HooksController) Get(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
    var hookModel models.Hook
    var response []byte
    var err error

    jwtToken := req.Header.Get("Authorization")
    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)

    if err != nil {
        log.Printf("Auth Failed: %v", err)
        var errResp ErrorResponse
        message := "Auth Failed"
        errResp.Message = message
        errResp.Status = 500
        response, _ = json.Marshal(errResp)
    } else {

        db, _ := pg.GetConn()
        db.First(&hookModel, params["id"])
        response, err = json.Marshal(hookModel)
        if err != nil {
            log.Printf("Error ocurred: %v", err)
        }
    }

    return string(response)
}


func (hook *HooksController) All(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
    var hookModelList []models.Hook
    var response []byte
    var err error

    jwtToken := req.Header.Get("Authorization")
    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)

    if err != nil {
        log.Printf("Auth Failed: %v", err)
        var errResp ErrorResponse
        message := "Auth Failed"
        errResp.Message = message
        errResp.Status = 500
        response, _ = json.Marshal(errResp)
    } else {
        db, _ := pg.GetConn()
        if db.Where("artist_id = ?", params["artist_id"]).Find(&hookModelList).RecordNotFound() {
            log.Println("No Hooks Found")
        } 
        response, err = json.Marshal(&hookModelList)
        if err != nil {
            log.Printf("Error ocurred: %v", err)
        }
    }
    return string(response)
}

func (hook *HooksController) Create(req *http.Request, pg *dbc.Postgres) string {
    /*
    {
        "message": "{{Title}}, {{Description}} {{URL}} ",
        "is_active": true,
        "statement": "Send a tweet when a video is uploaded to youtube",
        "trigger": "youtube",
        "action": "twitter",
        "artist_id": 7,
    }
    */

    var data []byte
    var err error
    var errResp ErrorResponse

    jwtToken := req.Header.Get("Authorization")
    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)

    if err != nil {
        log.Printf("Auth Failed: %v", err)
        message := "Auth Failed"
        errResp.Message = message
        errResp.Status = 500
        data, _ = json.Marshal(errResp)
    } else {

        decoder := json.NewDecoder(req.Body)
        var hookData HookData
        err = decoder.Decode(&hookData)

        var hookModel models.Hook
        db, _ := pg.GetConn()
        hookModel = models.Hook{
           Message: hookData.Message,
           IsActive: hookData.IsActive,
           ActionProvider: hookData.Action,
           TriggerProvider: hookData.Trigger,
           Statement: hookData.Statement,
           ArtistID: hookData.ArtistID,
        }
        db.Create(&hookModel)
        if db.NewRecord(hookModel) == false {
            data, _ = json.Marshal(hookModel)
        } else {
            message := "Hook entity failed to save"
            err = errors.New(message)
            errResp.Message = message
            errResp.Status = 500
            data, _ = json.Marshal(errResp)
        }

    }

    return string(data)
}

func (hook *HooksController) Save(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
    var data []byte
    var errResp ErrorResponse
    var err error

    jwtToken := req.Header.Get("Authorization")
    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)

    if err != nil {
        log.Printf("Auth Failed: %v", err)
        message := "Auth Failed"
        errResp.Message = message
        errResp.Status = 500
        data, _ = json.Marshal(errResp)
    } else {
        decoder := json.NewDecoder(req.Body)
        var hookData HookData
        err = decoder.Decode(&hookData)

        var hookModel models.Hook
        db, _ := pg.GetConn()
        db.First(&hookModel, params["id"])
        hookModel.Message = hookData.Message
        hookModel.IsActive = hookData.IsActive
        hookModel.Statement = hookData.Statement
        hookModel.ActionProvider = hookData.Action
        hookModel.TriggerProvider = hookData.Trigger

        db.Save(&hookModel)
        data, err = json.Marshal(hookModel)
        if err != nil {
            log.Printf("Error ocurred: %v", err)
        }

    }

    return string(data)
}

func (hook *HooksController) Destroy(params martini.Params, req *http.Request, pg *dbc.Postgres) string {
    var hookModel models.Hook
    var response []byte
    var err error

    jwtToken := req.Header.Get("Authorization")
    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)

    if err != nil {
        log.Printf("Auth Failed: %v", err)
        var errResp ErrorResponse
        message := "Auth Failed"
        errResp.Message = message
        errResp.Status = 500
        response, _ = json.Marshal(errResp)
    } else {

        db, _ := pg.GetConn()
        if db.First(&hookModel, params["id"]).RecordNotFound() {
           log.Printf("No Hook Model Found For ID %s", params["id"]) 
        } else {
            db.Delete(&hookModel)
        }

        id, _ := strconv.Atoi(params["id"])
        msg := map[string]int{"id": id, "status": 200}
        response, _ = json.Marshal(msg)
    }
    return string(response)
}

