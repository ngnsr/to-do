package com.rr.todo.entity;

import jakarta.persistence.*;
import lombok.*;

import jakarta.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Description cannot be empty")
    private String description;

    @Column(nullable = false, columnDefinition="boolean default false")
    private Boolean completed = false;

    @Column(nullable = false)
    @OrderBy
    private Long orderPos;
}
