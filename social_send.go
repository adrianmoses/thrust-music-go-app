package main

import (
    "fmt"
    "log"
    "errors"
    "encoding/json"
    "net/http"
    "io/ioutil"
    dbc "github.com/ammoses89/thrust/db"
    "github.com/ammoses89/thrust/files"
    "github.com/ammoses89/thrust/models"
    "github.com/ammoses89/thrust/social"
)

func CreateSocialSendTask(rw http.ResponseWriter, req *http.Request, 
                              machine *Machine, pg *dbc.Postgres) string {


    // TODO add task to worker
    var payload SocialSendPayload
    res, err := ioutil.ReadAll(req.Body)
    if err := json.Unmarshal(res, &payload); err != nil {
        fmt.Println("Could not parse JSON: %v", err)
    }

    // TODO add to database
    var eventModel models.Event
    db, _ := pg.GetConn()
    eventModel.SocialID = payload.SocialID
    eventModel.Message = payload.Message
    if payload.Title != "" {
        eventModel.Title =  payload.Title
    }

    if payload.VideoUrl != "" {
        eventModel.MediaUrls = append(eventModel.MediaUrls, payload.VideoUrl)
    }

    if payload.ImageUrl != "" {
        eventModel.MediaUrls = append(eventModel.MediaUrls, payload.ImageUrl)
    }
    db.Create(&eventModel)
    payload.EventID = int(eventModel.ID)

    fmt.Printf("Social Send Payload: %+v\n", payload)
    metadata, err := json.Marshal(payload)

    if err != nil {
        fmt.Println("Error ocurred: %v", err)
    }

    task := NewTask("social_send", string(metadata))
    task.RunAt = payload.SendAt
    machine.SendTask(task)
    fmt.Println("Save task")
    return "{\"status\": 200}"
}

func SocialSend(task *Task) (bool, error) {
    var payload SocialSendPayload
    err := task.DeserializeMetadata(&payload)
    if err != nil {
        log.Fatalf("Failed to deserialize payload: %v", err)
        return false, err
    }

    var mediaFilename string
    if payload.ImageUrl != "" {
        mediaFilename = fmt.Sprintf("/tmp/image_ss_%s.mp4", task.Id)
        fmt.Println(mediaFilename)
        _, err = files.DownloadFromGCS(payload.ImageUrl, mediaFilename)
        if err != nil {
            return false, err
        }
    }

    if payload.VideoUrl != "" {
        mediaFilename = fmt.Sprintf("/tmp/video_ss_%s.mp4", task.Id)
        fmt.Println(mediaFilename)
        _, err = files.DownloadFromGCS(payload.VideoUrl, mediaFilename)
        if err != nil {
            return false, err
        }

    }

    fmt.Println(payload.Provider)
    switch payload.Provider {
    case "twitter":
        twit := social.MakeTwitter()
        _, err = twit.SendMessage(payload.Message, payload.SocialID,
            payload.EventID, mediaFilename)
        if err != nil {
            return false, err
        }
    case "facebook":
        // TODO send facebook post
        fb := social.MakeFacebook()
        _, err = fb.SendMessage(payload.Message, payload.SocialID,
            payload.EventID, mediaFilename)
        fmt.Printf("Error occured: %v\n", err)
        if err != nil {
            return false, err
        }
    case "youtube":
        yt := social.MakeYoutube()
        _, err = yt.SendVideo(payload.Title, payload.Message, 
            mediaFilename, payload.SocialID, payload.EventID)
        fmt.Printf("Error occured: %v\n", err)
        if err != nil {
            return false, err
        }
    case "soundcloud":
        return true, nil
    default:
        log.Fatalf("Social services is not supported %s", payload.Provider)
        msg := fmt.Sprintf("Social services is not supported %s", payload.Provider)
        return false, errors.New(msg)
    }
    return true, nil
}