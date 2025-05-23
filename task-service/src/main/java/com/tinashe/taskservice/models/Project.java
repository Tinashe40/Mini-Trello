package com.tinashe.taskservice.models;

import lombok.Data;

@Data
public class Project {
    private Long id;
    private String name;
    private String description;
    private String status;
    private Long createdBy;
}