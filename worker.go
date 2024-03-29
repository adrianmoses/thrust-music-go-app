package main

import (
    "fmt"
    "time"
    "errors"
    "log"
    "reflect"
)

type Worker struct {
    Name string
    machine *Machine
}

const MAX_RETRIES = 5

func NewWorker(name string, mach *Machine) *Worker {
    return &Worker{Name: name, machine: mach}
}

func (w *Worker) Process(task *Task) error {
    // will take a task and run task with args
    var err error
    taskFunc := w.machine.GetRegisteredTask(task.Name)
    if taskFunc == nil {
        errMsg := fmt.Sprintf("Invalid Task Name: %v", task.Name)
        return errors.New(errMsg)
    }
    reflectedTask := reflect.ValueOf(taskFunc)

    taskArg := []reflect.Value{reflect.ValueOf(task)}
    results := reflectedTask.Call(taskArg)

    log.Println("Func called successfully")
    if !results[1].IsNil() && task.Retries >= MAX_RETRIES {
        // add to results queue as uncessful
        if task.Retries >= MAX_RETRIES {
            err = results[1].Interface().(error)
            task.FinishWithError(err)
            w.machine.SendTaskResult(task)
        } else {
            err = nil
            log.Println("Retrying task...")
            task.Retries += 1
            task.Status = "QUEUED"
            w.machine.SendTask(task)
        }
        return err 
    }
    // add to results queue as successful
    if task.RunEvery == 0 {
        task.FinishWithSuccess()
        w.machine.SendTaskResult(task)
    } else {
        // update task run at
        task.RunAt = time.Now().Add(task.RunEvery)
        w.machine.SendTask(task)
    }
    return nil
}


func (w *Worker) Run() error {
    broker := w.machine.GetBroker()
    errChan := make(chan error)
    go func() {
        for {
            retry, err := broker.Dequeue(w)
            if retry {
                fmt.Println("Retrying...")
            } else {
                errChan <- err
                return
            }
        }
    }()

    return <-errChan
}

func (w *Worker) Stop() {
    broker := w.machine.GetBroker()
    broker.StopDequeue()
}

