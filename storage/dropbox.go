package storage

import (
    "log"

    "golang.org/x/oauth2"
    config "github.com/ammoses89/thrust-outreach/config"
)

type Dropbox struct {
    conf *oauth2.Config
}

func NewDropbox() *Dropbox {
    cfg := config.LoadConfig("config/config.yaml")
    conf := &oauth2.Config{
        ClientID:     cfg.Dropbox.ClientID,
        ClientSecret: cfg.Dropbox.ClientSecret,
        Endpoint: oauth2.Endpoint{
            AuthURL:  "https://www.dropbox.com/oauth2/authorize",
            TokenURL: "https://api.dropboxapi.com/oauth2/token",
        },
        RedirectURL: "http://localhost:3000/api/storage/dropbox/callback",
    }
    return &Dropbox{conf: conf}
}

func (dbx *Dropbox) GetCodeURL(jwtToken string) string {
    oauth2RedirectURI := oauth2.SetAuthURLParam("redirect_uri", "http://localhost:3000/api/storage/dropbox/callback")
    oauth2ResponseType := oauth2.SetAuthURLParam("response_type", "code")

    url := dbx.conf.AuthCodeURL(jwtToken, oauth2RedirectURI, oauth2ResponseType)
    return url
}

func (dbx *Dropbox) ExchangeCodeForToken(code string) (*oauth2.Token, error) {
    token, err := dbx.conf.Exchange(oauth2.NoContext, code)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    return token, nil
}