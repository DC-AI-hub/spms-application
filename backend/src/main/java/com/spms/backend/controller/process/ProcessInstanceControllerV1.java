package com.spms.backend.controller.process;

import com.spms.backend.controller.BaseController;
import com.spms.backend.controller.ProcessConverter;
import com.spms.backend.controller.dto.process.ProcessInstanceDTO;
import com.spms.backend.controller.dto.process.ProcessInstanceRequest;
import com.spms.backend.controller.dto.process.TaskDTO;
import com.spms.backend.service.exception.NotFoundException;
import com.spms.backend.service.exception.SpmsRuntimeException;
import com.spms.backend.service.idm.UserService;
import com.spms.backend.service.model.process.ProcessInstanceModel;
import com.spms.backend.service.model.process.TaskModel;
import com.spms.backend.service.process.ProcessInstanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.spms.backend.service.model.idm.UserModel;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/process-instances")
public class ProcessInstanceControllerV1 extends BaseController {

    @Autowired
    private ProcessInstanceService processInstanceService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProcessConverter processConverter;

    /**
     * Starts a new process instance
     * Executes the currently active version of specified definition
     * 
     * @param request Process instance details
     * @return ProcessInstanceDTO with instance details
     * @throws NotFoundException if definition not found
     * @throws SpmsRuntimeException if process fails to start
     */
    @PostMapping
    public ResponseEntity<ProcessInstanceDTO> startProcessInstance(@RequestBody ProcessInstanceRequest request) {
        try {
            ProcessInstanceModel instance = processInstanceService.startInstance(
                    request.getDefinitionId(),
                    request.getFormId(),
                    request.getFormVariable(),
                    request.getVariable()
            );
            ProcessInstanceDTO dto = new ProcessInstanceDTO();
            dto.setInstanceId(instance.getInstanceId());
            dto.setDefinitionId(instance.getDefinitionId());
            dto.setStatus(instance.getStatus());
            dto.setStartTime(instance.getStartTime());
            return ResponseEntity.ok(dto);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gets status of a process instance
     * @param instanceId ID of the process instance to check
     * @return ProcessInstanceDTO containing instance details
     * @throws NotFoundException if instance not found
     * @throws SpmsRuntimeException if status retrieval fails
     */
    @GetMapping("/{instanceId}")
    public ResponseEntity<ProcessInstanceDTO> getProcessInstance(@PathVariable String instanceId) {
        try {
            ProcessInstanceModel instance = processInstanceService.getInstanceStatus(instanceId);
            ProcessInstanceDTO dto = new ProcessInstanceDTO();
            dto.setInstanceId(instance.getInstanceId());
            dto.setDefinitionId(instance.getDefinitionId());
            dto.setStatus(instance.getStatus());
            dto.setStartTime(instance.getStartTime());
            dto.setEndTime(instance.getEndTime());
            
            List<TaskDTO> taskDTOs = instance.getActiveTasks().stream()
                .map(task -> {
                    TaskDTO taskDTO = new TaskDTO();
                    taskDTO.setTaskId(task.getTaskId());
                    taskDTO.setName(task.getName());
                    taskDTO.setAssignee(task.getAssignee());
                    return taskDTO;
                })
                .toList();
            dto.setActiveTasks(taskDTOs);
            
            return ResponseEntity.ok(dto);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Retrieves all tasks for a process instance
     * 
     * @param instanceId ID of the process instance
     * @return List of TaskDTOs containing task details
     * @throws NotFoundException if instance not found
     */
    @GetMapping("/{instanceId}/tasks")
    public ResponseEntity<List<TaskDTO>> getInstanceTasks(
            @PathVariable String instanceId
    ) {
        try {
            List<TaskModel> models = processInstanceService.getInstanceTasks(instanceId);
            List<TaskDTO> dtos = models.stream()
                    .map(model -> {
                        TaskDTO dto = new TaskDTO();
                        dto.setTaskId(model.getTaskId());
                        dto.setName(model.getName());
                        dto.setAssignee(model.getAssignee());
                        return dto;
                    })
                    .toList();
            return ResponseEntity.ok(dtos);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Rejects a task in a process instance
     * @param instanceId ID of the process instance
     * @param taskId ID of the task to reject
     * @param rejectValues Rejection data containing variables
     * @return ResponseEntity with 200 OK if successful
     * @throws NotFoundException if instance/task not found
     * @throws SpmsRuntimeException if task rejection fails
     */
    @PostMapping("/{instanceId}/tasks/{taskId}/reject")
    public ResponseEntity<Void> rejectTask(
            @PathVariable String instanceId,
            @PathVariable String taskId,
            @RequestBody Map<String,Object> rejectValues) {
        try {
            Long currentUserId = userService.getCurrentUserId();
            processInstanceService.rejectTask(instanceId, taskId, currentUserId, rejectValues);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Completes a task in a process instance
     * @param instanceId ID of the process instance
     * @param taskId ID of the task to complete
     * @param completeObject Completed Object to complete tasks
     * @return ResponseEntity with 200 OK if successful
     */
    @PostMapping("/{instanceId}/tasks/{taskId}/complete")
    public ResponseEntity<Void> completeTask(
            @PathVariable String instanceId,
            @PathVariable String taskId,
            @RequestBody Map<String,Object> completeObject
            ) {
        try {
            Long currentUserId = userService.getCurrentUserId();
            processInstanceService.completeTask(instanceId, taskId, currentUserId,completeObject);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Retrieves all process instances
     * 
     * @param pageable Pagination information
     * @return List of ProcessInstanceDTOs
     */
    @GetMapping
    public ResponseEntity<List<ProcessInstanceDTO>> getAllProcessInstances(Pageable pageable) {
        try {
            List<ProcessInstanceModel> models = processInstanceService.getInstances(pageable);
            List<ProcessInstanceDTO> dtos = models.stream()
                .map(model -> {
                    ProcessInstanceDTO dto = new ProcessInstanceDTO();
                    dto.setInstanceId(model.getInstanceId());
                    dto.setDefinitionId(model.getDefinitionId());
                    dto.setStatus(model.getStatus());
                    dto.setStartTime(model.getStartTime());
                    dto.setEndTime(model.getEndTime());
                    
                    List<TaskDTO> taskDTOs = model.getActiveTasks().stream()
                        .map(task -> {
                            TaskDTO taskDTO = new TaskDTO();
                            taskDTO.setTaskId(task.getTaskId());
                            taskDTO.setName(task.getName());
                            taskDTO.setAssignee(task.getAssignee());
                            return taskDTO;
                        })
                        .toList();
                    dto.setActiveTasks(taskDTOs);
                    
                    return dto;
                })
                .toList();
            return ResponseEntity.ok(dtos);
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Retrieves process instances related to the current user
     * 
     * @param pageable Pagination information
     * @return List of ProcessInstanceDTOs
     */
    @GetMapping("/user")
    public ResponseEntity<List<ProcessInstanceDTO>> getUserRelatedProcessInstances(Pageable pageable) {
        try {
            UserModel currentUser = userService.getCurrentUser();
            List<ProcessInstanceModel> models = processInstanceService.getUserRelatedInstances(pageable, currentUser);
            List<ProcessInstanceDTO> dtos = models.stream()
                .map(model -> {
                    ProcessInstanceDTO dto = new ProcessInstanceDTO();
                    dto.setInstanceId(model.getInstanceId());
                    dto.setDefinitionId(model.getDefinitionId());
                    dto.setStatus(model.getStatus());
                    dto.setStartTime(model.getStartTime());
                    dto.setEndTime(model.getEndTime());
                    
                    List<TaskDTO> taskDTOs = model.getActiveTasks().stream()
                        .map(task -> {
                            TaskDTO taskDTO = new TaskDTO();
                            taskDTO.setTaskId(task.getTaskId());
                            taskDTO.setName(task.getName());
                            taskDTO.setAssignee(task.getAssignee());
                            return taskDTO;
                        })
                        .toList();
                    dto.setActiveTasks(taskDTOs);
                    
                    return dto;
                })
                .toList();
            return ResponseEntity.ok(dtos);
        } catch (SpmsRuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
