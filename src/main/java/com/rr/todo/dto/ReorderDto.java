package com.rr.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReorderDto {
    int startIndex;
    int endIndex;
}
