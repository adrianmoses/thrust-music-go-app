package lib

import (
    "fmt"
    "github.com/dgrijalva/jwt-go"
)


type Auth struct {}

// Change this to something secure
var SECRET_KEY string = "C\x8E\xE3)\xD9\xC5Sp\x15\xEE\xA8tZ\xE9a>\x16\xE0\x83N\xB4\x8B\xBF\tcL\x1A\xD9\x15\aC7"

func NewAuth() *Auth {
    return &Auth{}
}

func (auth *Auth) Issue(id uint, email string, artist_id uint) (string, error) {

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "id": id,
        "email": email,
        "primary_artist_id": artist_id,
    })

    tokenString, err := token.SignedString([]byte(SECRET_KEY))
    return tokenString, err
}

func (auth *Auth) Decode(tokenString string) (jwt.MapClaims, error) {

    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
        }

        return []byte(SECRET_KEY), nil
    })

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return claims, nil
    } else {
        return nil, err
    }
}