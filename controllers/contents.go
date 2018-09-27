package controllers

import (
    "fmt"
    "net/http"
    "encoding/json"
    "math/rand"
    "path/filepath"
    "github.com/go-martini/martini"
    "github.com/speps/go-hashids"
    "github.com/ammoses89/thrust-outreach/files"
    "github.com/ammoses89/thrust-outreach/lib"
    dbc "github.com/ammoses89/thrust-outreach/db"
    models "github.com/ammoses89/thrust-outreach/models"
)

type ContentsController struct{}

var Contents ContentsController

func genHash() string {
    hd := hashids.NewData()
    hd.Salt = "thrust-gen"
    h, _ := hashids.NewWithData(hd)
    intArr := make([]int, 4)
    for idx := range intArr {
        intArr[idx] = rand.Intn(1000)
    }
    e, _ := h.Encode(intArr)
    return e
}

func (content *ContentsController) UploadImage(req *http.Request, params martini.Params, pg *dbc.Postgres) string {
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

    file, header, _ := req.FormFile("file")
    defer file.Close()
    fileExt := filepath.Ext(header.Filename)
    hash := genHash()
    gcsFilePath := fmt.Sprintf("dev/unstaged/image/%s-%s", hash, fileExt)
    files.WriteToGCS(file, gcsFilePath)

    db, _ := pg.GetConn()
    var contentModel models.Content
    contentModel.ArtistID = userData.Artist
    contentModel.ContentPath = gcsFilePath
    contentModel.Staged = false
    contentModel.Deleted = false
    contentModel.ContentType = "image"
    db.Create(&contentModel)

    resMap := make(map[string]string)
    resMap["image_path"] = gcsFilePath
    data, _ := json.Marshal(&resMap)
    return string(data)
}

func (content *ContentsController) UploadAudio(req *http.Request, params martini.Params, pg *dbc.Postgres) string {
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

    file, header, _ := req.FormFile("file")
    defer file.Close()
    fileExt := filepath.Ext(header.Filename)
    hash := genHash()
    gcsFilePath := fmt.Sprintf("dev/unstaged/audio/%s-%s", hash, fileExt)
    files.WriteToGCS(file, gcsFilePath)

    db, _ := pg.GetConn()
    var contentModel models.Content
    contentModel.ArtistID = userData.Artist
    contentModel.ContentPath = gcsFilePath
    contentModel.Staged = false
    contentModel.Deleted = false
    contentModel.ContentType = "audio"
    db.Create(&contentModel)

    resMap := make(map[string]string)
    resMap["audio_path"] = gcsFilePath
    data, _ := json.Marshal(&resMap)
    return string(data)
}

func (content *ContentsController) UploadVideo(req *http.Request, params martini.Params, pg *dbc.Postgres) string {
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

    file, header, _ := req.FormFile("file")
    defer file.Close()
    fileExt := filepath.Ext(header.Filename)
    hash := genHash()
    gcsFilePath := fmt.Sprintf("dev/unstaged/video/%s-%s", hash, fileExt)
    files.WriteToGCS(file, gcsFilePath)

    db, _ := pg.GetConn()
    var contentModel models.Content
    contentModel.ArtistID = userData.Artist
    contentModel.ContentPath = gcsFilePath
    contentModel.Staged = false
    contentModel.Deleted = false
    contentModel.ContentType = "video"
    db.Create(&contentModel)

    resMap := make(map[string]string)
    resMap["video_path"] = gcsFilePath
    data, _ := json.Marshal(&resMap)
    return string(data)
}

func (content *ContentsController) Get() string {
	return "{\"message\": \"Not Implemented\"}"
}

func (content *ContentsController) Create() string {
	return "{\"message\": \"Not Implemented\"}"
}

func (content *ContentsController) Destroy() string {
	return "{\"message\": \"Not Implemented\"}"
}
