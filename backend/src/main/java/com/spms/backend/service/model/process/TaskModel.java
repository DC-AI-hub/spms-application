package com.spms.backend.service.model.process;

import com.spms.backend.service.exception.ValidationException;

/**
 * Represents a workflow task with its properties
 */
public class TaskModel {
    private final String taskId;
    private final String name;
    private final String assignee;

    private TaskModel(Builder builder) {
        this.taskId = builder.taskId;
        this.name = builder.name;
        this.assignee = builder.assignee;
    }

    /**
     * Creates a new builder instance
     * @return new Builder instance
     */
    public static Builder builder() {
        return new Builder();
    }

    public String getTaskId() {
        return taskId;
    }

    public String getName() {
        return name;
    }

    public String getAssignee() {
        return assignee;
    }

    /**
     * Validates the model state
     * @throws ValidationException if validation fails
     */
    public void validate() throws ValidationException {
        if (taskId == null || taskId.isEmpty()) {
            throw new ValidationException("Task ID cannot be null or empty");
        }
        if (name == null || name.isEmpty()) {
            throw new ValidationException("Name cannot be null or empty");
        }
    }

    @Override
    public String toString() {
        return "TaskModel{" +
            "taskId='" + taskId + '\'' +
            ", name='" + name + '\'' +
            ", assignee='" + assignee + '\'' +
            '}';
    }

    /**
     * Builder for TaskModel
     */
    public static class Builder {
        private String taskId;
        private String name;
        private String assignee;

        public Builder taskId(String taskId) {
            this.taskId = taskId;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder assignee(String assignee) {
            this.assignee = assignee;
            return this;
        }

        /**
         * Builds the TaskModel
         * @return new TaskModel instance
         * @throws ValidationException if validation fails
         */
        public TaskModel build() throws ValidationException {
            TaskModel model = new TaskModel(this);
            model.validate();
            return model;
        }
    }
}
