package com.rr.todo.dto;

import com.rr.todo.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Response {
    String id;
    List<Task> list;
}
