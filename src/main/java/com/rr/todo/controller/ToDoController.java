package com.rr.todo.controller;

import com.rr.todo.dto.AddTaskDto;
import com.rr.todo.dto.ReorderDto;
import com.rr.todo.dto.Response;
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

    @MessageMapping("/complete/{taskId}/{clientId}")
    @SendTo("/topic/todos")
    public Response toggleCompleted(@DestinationVariable Long taskId, @DestinationVariable String clientId) {
        toDoService.toggleCompleted(taskId);
        return new Response(clientId, toDoService.getAllTasks());
    }

    @MessageMapping("/add")
    @SendTo("/topic/todos")
    public Response addTask(@RequestBody AddTaskDto addTaskDto) {
        toDoService.addTask(addTaskDto);
        return new Response(addTaskDto.getId(), toDoService.getAllTasks());
    }

    @MessageMapping("/reorder")
    @SendTo("/topic/todos")
    public Response reorder(ReorderDto reorderDto) {
        return new Response(reorderDto.getClientId(), toDoService.updateOrder(reorderDto));
    }

}
