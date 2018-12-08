package controllers

import (
    "fmt"
    "log"
    "strconv"
    "errors"
    "net/http"
    "encoding/json"
    "github.com/ammoses89/thrust/lib"
    "github.com/martini-contrib/render"
    "github.com/go-martini/martini"
    "github.com/jinzhu/gorm"
    dbc "github.com/ammoses89/thrust/db"
    models "github.com/ammoses89/thrust/models"
    socialProvider "github.com/ammoses89/thrust/social"
)

type SocialsController struct{}

var Socials SocialsController

type ConnectedFacebookResponse struct {
    ConnectedResponse
    Pages *socialProvider.FacebookPages  `json:"pages"`
}

type AuthURLResponse struct {
    URL    string `json:"url"`
    Status int    `json:"status"`
}

func ReturnErrorResponse(message string) string {

    var data []byte
    // else save token data
    var errResp ErrorResponse
    errResp.Message = message
    errResp.Status = 500
    data, _ = json.Marshal(&errResp)

    return string(data)

}

func (social *SocialsController) Get() string {
    return "{\"message\": \"not implemented error\"}"
}

func (social *SocialsController) GetByArtist(req *http.Request, pg *dbc.Postgres, params martini.Params) string {
    var message string

    jwtToken := req.Header.Get("Authorization")
    artistID, err := strconv.Atoi(params["artist_id"])
    
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }

    auth := &lib.Auth{}
    decodedData, err := auth.Decode(jwtToken)
    if err != nil {
        message = fmt.Sprintf("Authorization invalid: %v", err)
        return ReturnErrorResponse(message)
    }
    userData := &UserData{}
    userData.Id = int(decodedData["id"].(float64))
    userData.Email = decodedData["email"].(string)
    userData.Artist = int(decodedData["primary_artist_id"].(float64))

    var socialModels []models.Social
    db, _ := pg.GetConn()
    db.Where("user_id = ? AND artist_id = ?", userData.Id, artistID).Find(&socialModels)

    data, err := json.Marshal(&socialModels)
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }
    return string(data)

}

func (social *SocialsController) Authorize(req *http.Request, params martini.Params) string {
    jwtToken := req.Header.Get("Authorization")
    provider := params["provider"]

    var url, message string
    switch provider {
    case "twitter":
        twitter := socialProvider.MakeTwitter()
        url = twitter.GetAuthorizeURL(jwtToken)
    case "facebook":
        facebook := socialProvider.MakeFacebook()
        url = facebook.GetAuthorizeURL(jwtToken)
    case "youtube":
        youtube := socialProvider.MakeYoutube()
        url = youtube.GetAuthorizeURL(jwtToken)
    default:
        // TODO return JSON error response
        message = fmt.Sprintf("Unsupported Provider: %s", provider)
    }

    var data []byte
    var err error
    if url != "" {
        var urlResp AuthURLResponse
        urlResp.URL = url
        urlResp.Status = 200
        data, err = json.Marshal(&urlResp)

        if err != nil {
            fmt.Println("Error ocurred: %v", err)
        }
    } else {
        if message == "" {
            message = "URL unsuccessfully retrieved"
        }
        var errResp ErrorResponse
        errResp.Message = message
        errResp.Status = 500
        data, err = json.Marshal(&errResp)

        if err != nil {
            fmt.Printf("Error ocurred: %v\n", err)
        }
    }

    return string(data)

}

func (social *SocialsController) Create(req *http.Request, pg *dbc.Postgres, params martini.Params, r render.Render) string {
    var message string
    
    state := req.URL.Query().Get("state")
    code := req.URL.Query().Get("code")
    // assert the state is valid
    auth := &lib.Auth{}
    decodedData, err := auth.Decode(state)
    provider := params["provider"]
    var socialModel models.Social
    var db *gorm.DB

    var data []byte
    if err != nil {
        message = fmt.Sprintf("Invalid State: %v\n", err)
        return ReturnErrorResponse(message)
    } else {
        userData := &UserData{}
        userData.Id = int(decodedData["id"].(float64))
        userData.Email = decodedData["email"].(string)
        userData.Artist = int(decodedData["primary_artist_id"].(float64))

        switch provider {
        case "twitter":
            twitter := socialProvider.MakeTwitter()
            token, err := twitter.ExchangeRequestForToken(req)

            if err != nil {
                message = fmt.Sprintf("Error ocurred: %v\n", err)
                return ReturnErrorResponse(message)
            }

            if token != nil {
                db, _ = pg.GetConn()
                socialModel = models.Social{
                    UserID: userData.Id,
                    ArtistID: userData.Artist,
                    AccountType: provider,
                    Provider:provider,
                }

                twitterUserData := twitter.GetUserProfile(token.Token, token.TokenSecret)
                socialModel.UId = twitterUserData.IDStr
                socialModel.Name = twitterUserData.Name
                socialModel.ProfileImageURL = twitterUserData.ProfileImageURL

                if db.Where("artist_id = ? AND provider = ?", userData.Artist, provider).First(&socialModel).RecordNotFound() {
                    socialModel.OauthToken = token.Token
                    socialModel.TokenSecret = token.TokenSecret
                    socialModel.Provider = provider
                    socialModel.AccountType = provider
                    socialModel.UserID = userData.Id
                    socialModel.ArtistID = userData.Artist
                    db.Create(&socialModel)
                } else {
                    socialModel.OauthToken = token.Token
                    socialModel.TokenSecret = token.TokenSecret
                    db.Save(&socialModel)
                }

                if db.NewRecord(socialModel) == false {
                    // return connected message
                    var connResp ConnectedResponse
                    connResp.Provider = provider
                    connResp.Status = 200
                    data, err = json.Marshal(connResp)

                    if err != nil {
                        message = fmt.Sprintf("Error ocurred: %v\n", err)
                        return ReturnErrorResponse(message)
                    }
                } else {
                    message = "Soical entity failed to save"
                    err = errors.New(message)
                    return ReturnErrorResponse(message)
                }
            }
        case "facebook":

            facebook := socialProvider.MakeFacebook()
            fbToken, err := facebook.ExchangeCodeForToken(code)


            if err != nil {
                message = fmt.Sprintf("Error ocurred: %v\n", err)
                return ReturnErrorResponse(message)
            }
            if fbToken != nil {
                
                db, _ = pg.GetConn()
                socialModel = models.Social{
                    UserID: userData.Id,
                    ArtistID: userData.Artist,
                    AccountType: provider,
                    Provider:provider,
                }
                // socialModel.UID  = string(fbToken.Extra("UID"))
                // socialModel.Name =  string(fbToken.Extra("Name"))
                // socialModel.ProfileImageURL  = string(fbToken.Extra("ProfileImageURL"))
                if db.Where("artist_id = ? AND provider = ?", userData.Artist, provider).First(&socialModel).RecordNotFound() {
                    socialModel.OauthToken = fbToken.AccessToken
                    socialModel.RefreshToken = fbToken.RefreshToken
                    socialModel.OauthExpiresAt = fbToken.Expiry
                    socialModel.Provider = provider
                    socialModel.AccountType = provider
                    socialModel.UserID = userData.Id
                    socialModel.ArtistID = userData.Artist
                    db.Create(&socialModel)
                } else {
                    socialModel.OauthToken = fbToken.AccessToken
                    socialModel.RefreshToken = fbToken.RefreshToken
                    socialModel.OauthExpiresAt = fbToken.Expiry
                    db.Save(&socialModel)
                }

                if db.NewRecord(socialModel) == false {
                    // return connected message
                    var connResp ConnectedFacebookResponse
                    facebookPages := facebook.GetFacebookPages(fbToken.AccessToken)
                    connResp.Pages = facebookPages
                    connResp.Provider = provider
                    connResp.Status = 200
                    data, err = json.Marshal(connResp)
                    if err != nil {
                        message = fmt.Sprintf("Error ocurred: %v\n", err)
                        return ReturnErrorResponse(message)
                    }
                } else {
                    message = "Social entity failed to save"
                    err = errors.New(message)
                    return ReturnErrorResponse(message)
                }
            }
        case "youtube":

            youtube := socialProvider.MakeYoutube()
            ytToken, err := youtube.ExchangeCodeForToken(code)


            if err != nil {
                message = fmt.Sprintf("Error ocurred: %v\n", err)
                return ReturnErrorResponse(message)
            }
            if ytToken != nil {
                
                db, _ = pg.GetConn()
                socialModel = models.Social{
                    UserID: userData.Id,
                    ArtistID: userData.Artist,
                    AccountType: provider,
                    Provider:provider,
                }

                channelProfilePicture, _ := youtube.GetChannelProfilePicture(ytToken.AccessToken)
                socialModel.ProfileImageURL = channelProfilePicture

                if db.Where("artist_id = ? AND provider = ?", userData.Artist, provider).First(&socialModel).RecordNotFound() {
                    socialModel.OauthToken = ytToken.AccessToken
                    socialModel.RefreshToken = ytToken.RefreshToken
                    socialModel.OauthExpiresAt = ytToken.Expiry
                    socialModel.Provider = provider
                    socialModel.AccountType = provider
                    socialModel.UserID = userData.Id
                    socialModel.ArtistID = userData.Artist
                    db.Create(&socialModel)
                } else {
                    socialModel.OauthToken = ytToken.AccessToken
                    socialModel.RefreshToken = ytToken.RefreshToken
                    socialModel.OauthExpiresAt = ytToken.Expiry
                    db.Save(&socialModel)
                }

                if db.NewRecord(socialModel) == false {
                    // return connected message
                    var connResp ConnectedResponse
                    connResp.Provider = provider
                    connResp.Status = 200
                    data, err = json.Marshal(connResp)
                    if err != nil {
                        message = fmt.Sprintf("Error ocurred: %v\n", err)
                        return ReturnErrorResponse(message)
                    }
                } else {
                    message = "Social entity failed to save"
                    err = errors.New(message)
                    return ReturnErrorResponse(message)
                }
            }


        default:
            // TODO return JSON error response
            message = fmt.Sprintf("Unsupported Provider: %s", provider)
            return ReturnErrorResponse(message)
        }
    }

    r.HTML(200, "social_callback", string(data))
    return ""
}

func (social *SocialsController) Destroy() string {
	okResp := map[string]bool{"ok": true}
    data, _ := json.Marshal(&okResp)
    return string(data)
}

func (social *SocialsController) ChooseFacebookPage(req *http.Request, pg *dbc.Postgres) string {
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

    // decode request body
    var facebookPage socialProvider.FacebookPage
    decoder := json.NewDecoder(req.Body)
    err = decoder.Decode(&facebookPage)
    if err != nil {
        message := fmt.Sprintf("Could not decode request body: %v", err)
        log.Printf(message)
        return ReturnErrorResponse(message)
    }


    var socialModel models.Social
    db, _ := pg.GetConn()
    db.Where("user_id = ? AND provider = ?", userData.Id, "facebook").First(&socialModel)
    pageID, err := strconv.ParseInt(facebookPage.Id, 10, 64)
    if err != nil {
        return ReturnErrorResponse(err.Error())
    }

    fb := socialProvider.MakeFacebook()
    profileImageURL := fb.GetPagePicture(socialModel.OauthToken, pageID)

    socialModel.PageID = pageID
    socialModel.PageAccessToken = facebookPage.AccessToken
    socialModel.PageName = facebookPage.Name
    socialModel.ProfileImageURL = profileImageURL

    db.Save(&socialModel)

    okResp := map[string]bool{"ok": true}
    data, _ := json.Marshal(&okResp)
    return string(data)
}

func (social *SocialsController) GetQueuedPosts(req *http.Request, pg *dbc.Postgres, params martini.Params) string {
    var message string

    jwtToken := req.Header.Get("Authorization")
    provider := params["provider"]
    artistID, err := strconv.Atoi(params["artist_id"])
    
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }

    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)
    if err != nil {
        message = fmt.Sprintf("Authorization invalid: %v", err)
        return ReturnErrorResponse(message)
    }

    var socialEvents []models.Event
    db, _ := pg.GetConn()
    db.Where("artist_id = ? AND provider = ? AND sent_at IS NULL", artistID, provider).Find(&socialEvents)

    data, err := json.Marshal(&socialEvents)
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }
    return string(data)

}

func (social *SocialsController) GetSentPosts(req *http.Request, pg *dbc.Postgres, params martini.Params) string {
    var message string

    jwtToken := req.Header.Get("Authorization")
    provider := params["provider"]
    artistID, err := strconv.Atoi(params["artist_id"])
    
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }

    auth := &lib.Auth{}
    _, err = auth.Decode(jwtToken)
    if err != nil {
        message = fmt.Sprintf("Authorization invalid: %v", err)
        return ReturnErrorResponse(message)
    }
    var socialEvents []models.Event
    db, _ := pg.GetConn()
    db.Where("artist_id = ? AND provider = ? AND sent = true", artistID, provider).Find(&socialEvents)

    data, err := json.Marshal(&socialEvents)
    if err != nil {
        message = err.Error()
        return ReturnErrorResponse(message)
    }
    return string(data)
}
