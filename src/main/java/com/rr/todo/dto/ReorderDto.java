package com.rr.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReorderDto {
    String clientId;
    int startIndex;
    int endIndex;
}
