package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"github.com/ammoses89/thrust/lib"
	"github.com/ammoses89/thrust/models"
	"github.com/martini-contrib/render"
	dbc "github.com/ammoses89/thrust/db"
	fileStorage "github.com/ammoses89/thrust/storage"
	"github.com/go-martini/martini"
	"golang.org/x/oauth2"
	"net/http"
)

type ConnectedResponse struct {
	Provider string `json:"provider"`
	Status   int    `json:"status"`
}

type CodeURLResponse struct {
	URL    string `json:"url"`
	Status int    `json:"status"`
}

type StorageTokenResponse struct {
	Token  string `json:"token"`
	Status int    `json:"status"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

type StorageResponse struct {
	ArtistID     uint      `json:"artist_id"`
	IsConnected  bool      `json:"is_connected"`
	Provider     string    `json:"provider"`
	DirPath      string    `json:"dir_path"`
}

type StoragesController struct{}

var Storages StoragesController

type StorageAllResponse struct {
	Dropbox StorageResponse `json:"dropbox"`
	Drive StorageResponse `json:"drive"`
}


func (store *StoragesController) All(params martini.Params, pg *dbc.Postgres) string {
	var dbxStorage models.Storage
	var driveStorage models.Storage
	artistID := params["artist_id"]
	db, _ := pg.GetConn()

	var storageAllResponse StorageAllResponse 


	if db.Where("artist_id = ? AND provider = ?", artistID, "dropbox").Find(&dbxStorage).RecordNotFound() {
		log.Println("No Dropbox Storage Connection Found")

	} else {
		var dropboxResp StorageResponse
		dropboxResp.ArtistID = dbxStorage.ArtistID
		dropboxResp.IsConnected = dbxStorage.IsConnected
		dropboxResp.Provider = dbxStorage.Provider
		dropboxResp.DirPath = dbxStorage.DirPath
		storageAllResponse.Dropbox = dropboxResp
	}

	if db.Where("artist_id = ? AND provider = ?", artistID, "drive").Find(&driveStorage).RecordNotFound() {
		log.Println("No Dropbox Storage Connection Found")

	} else {

		var driveResp StorageResponse
		driveResp.ArtistID = driveStorage.ArtistID
		driveResp.IsConnected = driveStorage.IsConnected
		driveResp.Provider = driveStorage.Provider
		driveResp.DirPath = driveStorage.DirPath
		storageAllResponse.Drive = driveResp
	}


	data, _ := json.Marshal(&storageAllResponse)
	return string(data)

}

func (store *StoragesController) Authorize(req *http.Request, params martini.Params) string {
	jwtToken := req.Header.Get("Authorization")
	provider := params["provider"]

	var url, message string
	switch provider {
	case "drive":
		drive := fileStorage.NewDrive()
		url = drive.GetCodeURL(jwtToken)
	case "dropbox":
		drive := fileStorage.NewDropbox()
		url = drive.GetCodeURL(jwtToken)
	default:
		// TODO return JSON error response
		message = fmt.Sprintf("Unsupported Provider: %s", provider)
	}

	var data []byte
	var err error
	if url != "" {
		var urlResp CodeURLResponse
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

func (store *StoragesController) Create(req *http.Request, pg *dbc.Postgres, params martini.Params, r render.Render) {
	var message string
	var token *oauth2.Token
	
	code := req.URL.Query().Get("code")
	state := req.URL.Query().Get("state")
	// assert the state is valid
	auth := &lib.Auth{}
	_, err := auth.Decode(state)
	provider := params["provider"]

	if err != nil {
		message = fmt.Sprintf("Invalid State: %v\n", err)
	} else {
		switch provider {
		case "drive":
			drive := fileStorage.NewDrive()
			token, err = drive.ExchangeCodeForToken(code)

			if err != nil {
				message = fmt.Sprintf("Error ocurred: %v\n", err)
			}
		case "dropbox":
			dropbox := fileStorage.NewDropbox()
			token, err = dropbox.ExchangeCodeForToken(code)

			if err != nil {
				message = fmt.Sprintf("Error ocurred: %v\n", err)
			}
		default:
			// TODO return JSON error response
			message = fmt.Sprintf("Unsupported Provider: %s", provider)
		}
	}

	// if errors return
	var data []byte
	if token != nil {
		var storage models.Storage
		db, _ := pg.GetConn()
		storage = models.Storage{AccessToken: token.AccessToken,
			RefreshToken: token.RefreshToken,
			ExpiresAt:  token.Expiry,
			IsConnected:  true,
			Provider:provider,
		}
		db.Create(&storage)

		if db.NewRecord(storage) == false {
			// return connected message
			var connResp ConnectedResponse
			connResp.Provider = provider
			connResp.Status = 200
			data, err = json.Marshal(connResp)

			if err != nil {
				message = fmt.Sprintf("Error ocurred: %v\n", err)
			}
		} else {
			message = "Storage entity failed to save"
			err = errors.New(message)
		}

	}

	if err != nil {
		// else save token data
		var errResp ErrorResponse
		errResp.Message = message
		errResp.Status = 500
		data, err = json.Marshal(&errResp)

		if err != nil {
			message = fmt.Sprintf("Error ocurred: %v\n", err)
			errResp.Message = message
		}

	}
	r.HTML(200, "storage_callback", string(data))
}
