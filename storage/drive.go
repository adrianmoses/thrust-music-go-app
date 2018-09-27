package storage

import (
    "log"

    "golang.org/x/oauth2"
    config "github.com/ammoses89/thrust-outreach/config"
)

type Drive struct {
    conf *oauth2.Config
}

func NewDrive() *Drive {
    cfg := config.LoadConfig("config/config.yaml")
    conf := &oauth2.Config{
        ClientID:     cfg.Drive.ClientID,
        ClientSecret: cfg.Drive.ClientSecret,
        Endpoint: oauth2.Endpoint{
            AuthURL:  "https://accounts.google.com/o/oauth2/auth",
            TokenURL: "https://accounts.google.com/o/oauth2/token",
        },
        RedirectURL: "http://localhost:3000/api/storage/drive/callback",
        Scopes: []string{
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata",
        },
    }
    return &Drive{conf: conf}
}

func (drive *Drive) GetCodeURL(jwtToken string) string {
    oauth2RedirectURI := oauth2.SetAuthURLParam("redirect_uri", "http://localhost:3000/api/storage/drive/callback")
    oauth2ResponseType := oauth2.SetAuthURLParam("response_type", "code")
    
    url := drive.conf.AuthCodeURL(jwtToken, oauth2RedirectURI, oauth2ResponseType)
    return url
}

func (drive *Drive) ExchangeCodeForToken(code string) (*oauth2.Token, error) {
    tok, err := drive.conf.Exchange(oauth2.NoContext, code)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    return tok, nil
}