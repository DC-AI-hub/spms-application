package com.spms.backend.controller.dto.process;

public class TaskDTO {
    private String taskId;
    private String name;
    private String assignee;
    
    // Getters and Setters
    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }
}
