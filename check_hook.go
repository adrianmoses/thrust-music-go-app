package main

import (
    "fmt"
    "encoding/json"
    "io/ioutil"
    "time"
    "net/http"
)


func CreateCheckHookTask(req *http.Request, machine *Machine) string {
    var payload HookCheckPayload
    var msg string
    res, err := ioutil.ReadAll(req.Body)
    if err := json.Unmarshal(res, &payload); err != nil {
        fmt.Println("Could not parse JSON: %v", err)
    }

    metadata, err := json.Marshal(payload)

    if err != nil {
        msg  = fmt.Sprintf("Error ocurred: %v", err)
        return fmt.Sprintf("{\"error\": %s \"status\": 500}", msg)
    }

    task := NewTask("check_hook", string(metadata))
    duration, err := time.ParseDuration("10m")
    if err != nil {
        msg  = fmt.Sprintf("Error ocurred: %v", err)
        return fmt.Sprintf("{\"error\": %s \"status\": 500}", msg)
    }
    task.RunEvery = duration
    task.RunAt = time.Now().Add(task.RunEvery)
    machine.SendTask(task)
    return "{\"status\": 200}"
}

func CheckHook(task *Task) (bool, error) {
    return true, nil
}