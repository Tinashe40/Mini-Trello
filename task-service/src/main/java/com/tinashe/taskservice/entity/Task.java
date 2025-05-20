package com.tinashe.taskservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TODO;
    
    private Long projectId;
    private Long assigneeId; // User ID from User Service
}

enum TaskStatus {
    TODO, IN_PROGRESS, DONE
}