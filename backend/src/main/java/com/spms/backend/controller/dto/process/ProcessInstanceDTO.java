package com.spms.backend.controller.dto.process;

import java.util.List;

public class ProcessInstanceDTO {
    private String instanceId;
    private String definitionId;
    private String status;
    private Long startTime;
    private Long endTime;
    private List<TaskDTO> activeTasks;
    
    // Getters and Setters
    public String getInstanceId() { return instanceId; }
    public void setInstanceId(String instanceId) { this.instanceId = instanceId; }
    public String getDefinitionId() { return definitionId; }
    public void setDefinitionId(String definitionId) { this.definitionId = definitionId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getStartTime() { return startTime; }
    public void setStartTime(Long startTime) { this.startTime = startTime; }
    public Long getEndTime() { return endTime; }
    public void setEndTime(Long endTime) { this.endTime = endTime; }
    public List<TaskDTO> getActiveTasks() { return activeTasks; }
    public void setActiveTasks(List<TaskDTO> activeTasks) { this.activeTasks = activeTasks; }
}
