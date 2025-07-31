package com.spms.backend.service.model.process;

import com.spms.backend.service.exception.ValidationException;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

/**
 * Represents a process instance with its status and tasks
 */
@Getter
public class ProcessInstanceModel {
    private final String instanceId;
    private final String definitionId;
    private final String status;
    private final Long startTime;
    private final Long endTime;
    private final List<TaskModel> activeTasks;

    private ProcessInstanceModel(Builder builder) {
        this.instanceId = builder.instanceId;
        this.definitionId = builder.definitionId;
        this.status = builder.status;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.activeTasks = builder.activeTasks != null ?
            Collections.unmodifiableList(builder.activeTasks) :
            Collections.emptyList();
    }

    /**
     * Creates a new builder instance
     * @return new Builder instance
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Validates the model state
     * @throws ValidationException if validation fails
     */
    public void validate() throws ValidationException {
        if (instanceId == null || instanceId.isEmpty()) {
            throw new ValidationException("Instance ID cannot be null or empty");
        }
        if (status == null || status.isEmpty()) {
            throw new ValidationException("Status cannot be null or empty");
        }
    }

    @Override
    public String toString() {
        return "ProcessInstanceModel{" +
            "instanceId='" + instanceId + '\'' +
            ", definitionId='" + definitionId + '\'' + 
            ", status='" + status + '\'' +
            ", startTime=" + startTime +
            ", endTime=" + endTime +
            ", activeTasks=" + activeTasks +
            '}';
    }

    /**
     * Builder for ProcessInstanceModel
     */
    public static class Builder {
        private String instanceId;
        private String definitionId;
        private String status;
        private Long startTime;
        private Long endTime;
        private List<TaskModel> activeTasks;

        public Builder instanceId(String instanceId) {
            this.instanceId = instanceId;
            return this;
        }

        public Builder definitionId(String definitionId) {
            this.definitionId = definitionId;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder startTime(Long startTime) {
            this.startTime = startTime;
            return this;
        }

        public Builder endTime(Long endTime) {
            this.endTime = endTime;
            return this;
        }

        public Builder activeTasks(List<TaskModel> activeTasks) {
            this.activeTasks = activeTasks;
            return this;
        }

        /**
         * Builds the ProcessInstanceModel
         * @return new ProcessInstanceModel instance
         * @throws ValidationException if validation fails
         */
        public ProcessInstanceModel build() throws ValidationException {
            ProcessInstanceModel model = new ProcessInstanceModel(this);
            model.validate();
            return model;
        }
    }
}
