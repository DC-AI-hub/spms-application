package com.spms.backend.service.process;

import com.spms.backend.service.model.idm.UserModel;
import com.spms.backend.service.model.process.ProcessInstanceModel;
import com.spms.backend.service.model.process.TaskModel;
import com.spms.backend.service.exception.NotFoundException;
import com.spms.backend.service.exception.SpmsRuntimeException;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ProcessInstanceService {
    /**
     * Starts a new process instance
     * @param definitionId Process definition ID
     * @return ProcessInstanceModel with instance details
     * @throws NotFoundException if definition not found
     * @throws SpmsRuntimeException if process fails to start
     */
    ProcessInstanceModel startInstance(Long definitionId,Long formId,Map<String,String> formValue, Map<String,String> context)
        throws NotFoundException, SpmsRuntimeException;

    /**
     * Gets the complete status of a process instance
     * @param instanceId The process instance ID
     * @return ProcessInstanceModel with current status and active tasks
     * @throws NotFoundException if instance not found
     * @throws SpmsRuntimeException if status retrieval fails
     */
    ProcessInstanceModel getInstanceStatus(String instanceId) throws NotFoundException, SpmsRuntimeException;

    /**
     * Gets all tasks for a process instance
     * @param instanceId Process instance ID
     * @return List of TaskModels
     * @throws NotFoundException if instance not found
     */
    List<TaskModel> getInstanceTasks(String instanceId) throws NotFoundException;

    /**
     * Completes a task in a process instance
     * @param instanceId Process instance ID
     * @param taskId Task ID to complete
     * @param userId Completing user ID
     * @throws NotFoundException if instance/task not found
     * @throws SpmsRuntimeException if task completion fails
     */
    void completeTask(String instanceId, String taskId, Long userId, Map<String,Object> completedValues)
        throws NotFoundException, SpmsRuntimeException;

    void rejectTask(String instanceId,String taskId, Long userId,Map<String,Object> rejectValues);

    /*TODO: ADD COMMENT*/
    List<ProcessInstanceModel> getInstances(Pageable pageable);

    /*TODO: Add Comment*/
    List<ProcessInstanceModel> getUserRelatedInstances(Pageable pageable, UserModel user);
    
    /**
     * Count incomplete tasks
     * @return the total number of incomplete tasks
     */
    long countIncompleteTasks();
    
    /**
     * Count completed tasks
     * @return the total number of completed tasks
     */
    long countCompletedTasks();
    
    /**
     * Count running processes
     * @return the total number of running processes
     */
    long countRunningProcesses();
}
