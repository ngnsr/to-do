package com.rr.todo.controller;

import com.rr.todo.dto.ReorderDto;
import com.rr.todo.entity.Task;
import com.rr.todo.service.ToDoService;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ToDoController {

    private final ToDoService toDoService;

    public ToDoController(ToDoService toDoService) {
        this.toDoService = toDoService;
    }

     @GetMapping("/api/todo")
     public List<Task> getAllTasks() {
         return toDoService.getAllTasks();
     }

    @MessageMapping("/complete/{id}")
    @SendTo("/topic/todos")
    public List<Task> toggleCompleted(@DestinationVariable Long id) {
        System.out.println(id);
        toDoService.toggleCompleted(id);
        return toDoService.getAllTasks();
    }

    @MessageMapping("/add")
    @SendTo("/topic/todos")
    public List<Task> addTask(@RequestBody Task task) {
        toDoService.addTask(task);
        return toDoService.getAllTasks();
    }

    @MessageMapping("/reorder")
    @SendTo("/topic/todos")
    public List<Task> reorder(ReorderDto reorderDto) {
        return toDoService.updateOrder(reorderDto);
    }

}
