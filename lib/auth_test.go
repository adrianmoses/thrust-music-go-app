package lib

import (
    "fmt"
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestAuthIssueAndDecode(t *testing.T) {
    auth := NewAuth()

    token, err := auth.Issue(1, "ammoses89@gmail.com", 4)

    assert.NoError(t, err) 
    assert.IsType(t, "", token)

    claims, err := auth.Decode(token)
    assert.NoError(t, err)

    var claimID float64 = claims["id"].(float64)
    var userID int = int(claimID)
    var claimPrimaryArtistID float64 = claims["primary_artist_id"].(float64)
    var artistID int = int(claimPrimaryArtistID)

    assert.Equal(t, 1, userID)
    assert.Equal(t, "ammoses89@gmail.com", claims["email"])
    assert.Equal(t, 4, artistID)
}