package com.spms.backend.service.process.impl;

import com.spms.backend.repository.entities.process.ProcessDefinitionEntity;
import com.spms.backend.repository.entities.process.ProcessVersionEntity;
import com.spms.backend.repository.entities.process.ProcessVersionStatus;
import com.spms.backend.repository.process.ProcessDefinitionRepository;
import com.spms.backend.repository.process.ProcessVersionRepository;
import com.spms.backend.service.exception.NotFoundException;
import com.spms.backend.service.exception.SpmsRuntimeException;
import com.spms.backend.service.exception.ValidationException;
import com.spms.backend.service.idm.UserService;
import com.spms.backend.service.model.idm.UserModel;
import com.spms.backend.service.model.process.ProcessInstanceModel;
import com.spms.backend.service.model.process.TaskModel;
import com.spms.backend.service.process.BusinessKeyGenerator;
import com.spms.backend.service.process.ProcessDefinitionService;
import com.spms.backend.service.process.ProcessInstanceService;
import org.flowable.engine.HistoryService;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.history.HistoricProcessInstance;
import org.flowable.engine.history.HistoricProcessInstanceQuery;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.flowable.common.engine.api.FlowableObjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 流程实例服务实现类，提供流程实例的启动、任务完成、状态查询等功能。
 *
 * <p>该类实现了 {@link ProcessInstanceService} 接口，负责与流程引擎交互，管理流程实例的生命周期。</p>
 *
 * <p>主要功能包括：</p>
 * <ul>
 *   <li>启动新的流程实例</li>
 *   <li>完成任务</li>
 *   <li>查询流程实例状态</li>
 *   <li>获取流程实例的任务列表</li>
 * </ul>
 *
 * @see ProcessInstanceService
 * @see ProcessEngine
 * @see RuntimeService
 */
@Service
public class ProcessInstanceServiceImpl implements ProcessInstanceService {

    private final UserService userService;
    private final ProcessEngine flowableEngine;
    private final BusinessKeyGenerator businessKeyGenerator;
    private final ProcessVersionRepository processVersionRepository;
    private final ProcessDefinitionRepository processDefinitionRepository;

    private static final Logger log = LoggerFactory.getLogger(ProcessInstanceServiceImpl.class);

    public ProcessInstanceServiceImpl(
            UserService userService,
            ProcessEngine flowableEngine,
            BusinessKeyGenerator businessKeyGenerator,
            ProcessVersionRepository processVersionRepository,
            ProcessDefinitionRepository processDefinitionRepository
    ) {
        this.userService = userService;
        this.flowableEngine = flowableEngine;
        this.businessKeyGenerator = businessKeyGenerator;
        this.processVersionRepository = processVersionRepository;
        this.processDefinitionRepository = processDefinitionRepository;
    }

    /**
     * 启动一个新的流程实例
     *
     * @param definitionId 流程定义ID
     * @param formId       表单ID（可选）
     * @param formContext  表单上下文数据（可选）
     * @param context      流程上下文数据（可选）
     * @return ProcessInstanceModel 包含流程实例的详细信息
     * @throws ValidationException  如果参数验证失败（如定义ID为空或用户ID为空）
     * @throws NotFoundException    如果流程定义或版本未找到
     * @throws SpmsRuntimeException 如果流程启动失败
     */
    @Override
    @Transactional
    public ProcessInstanceModel startInstance(Long definitionId, Long formId, Map<String, String> formContext, Map<String, String> context) {
        log.info("Starting process instance with definitionId: {}", definitionId);
        if (definitionId == null) {
            log.warn("Validation failed: Definition ID is null or empty");
            throw new ValidationException("Definition ID cannot be null or empty");
        }
        Long userId = userService.getCurrentUserId();
        if (userId == null) {
            log.warn("Validation failed: User ID is null for definitionId: {}", definitionId);
            throw new ValidationException("User ID cannot be null");
        }


        // Get the latest deployed version
        RuntimeService runtimeService = flowableEngine.getRuntimeService();
        try {

            ProcessDefinitionEntity procDef = processDefinitionRepository.getReferenceById(definitionId);
            ProcessVersionEntity processVersion = procDef.getVersions().stream().filter(x->x.getStatus() == ProcessVersionStatus.DEPLOYED)
                    .findFirst().orElseThrow(
                            ()->{
                                log.error("Process version not found for definitionId: {}", definitionId);
                                return new SpmsRuntimeException("Process version not found for definition ID: " + definitionId, null);
                            }
                    );
            // Find the process definition by process version
            ProcessDefinitionEntity processDefinition = processVersion.getProcessDefinition();
            if (processDefinition == null) {
                log.error("Process definition not found for versionId: {}", processVersion.getId());
                throw new SpmsRuntimeException("Process definition not found for version ID: " + processVersion.getId(), null);
            }

            // Generate the businessKey using the process version's key as prefix
            String businessKey = businessKeyGenerator.generateBusinessKey(processVersion.getKey(), "")
                    .getSeqStr('0', 10);  // Use '0' placeholder and 10-digit sequence

            ProcessInstance instance = runtimeService.createProcessInstanceBuilder()
                    .processDefinitionKey(processVersion.getKey())
                    .businessKey(businessKey)
                    .variables(Map.of("initiator", userId.toString()))
                    .start();

            log.info("Process instance started successfully: instanceId={}, definitionId={}",
                    instance.getId(), definitionId);

            return ProcessInstanceModel.builder()
                    .instanceId(instance.getId())
                    .definitionId(instance.getProcessDefinitionId())
                    .status("ACTIVE")
                    .startTime(System.currentTimeMillis())
                    .activeTasks(getInstanceTasks(instance.getId()))
                    .build();
        } catch (Exception ex) {
            throw new SpmsRuntimeException("Failed to start process instance", ex);
        }
    }

    @Override
    public void rejectTask(String instanceId, String taskId, Long userId, Map<String, Object> rejectValues) {
        log.info("Rejecting task: instanceId={}, taskId={}, userId={}", instanceId, taskId, userId);
        
        // Validate input parameters
        if (instanceId == null || instanceId.isEmpty()) {
            throw new ValidationException("Instance ID cannot be null or empty");
        }
        if (taskId == null || taskId.isEmpty()) {
            throw new ValidationException("Task ID cannot be null or empty");
        }
        if (userId == null) {
            throw new ValidationException("User ID cannot be null");
        }
        if (rejectValues == null || !rejectValues.containsKey("rejectionReason")) {
            throw new ValidationException("rejectionReason is required in rejectValues");
        }

        try {
            TaskService taskService = flowableEngine.getTaskService();
            RuntimeService runtimeService = flowableEngine.getRuntimeService();
            
            // Verify task exists and is assigned to user
            Task task = taskService.createTaskQuery()
                .taskId(taskId)
                .taskAssignee(userId.toString())
                .singleResult();
            
            if (task == null) {
                throw new NotFoundException("Task not found or not assigned to user");
            }

            // Set rejection variables
            taskService.setVariables(taskId, rejectValues);
            
            // Trigger BPMN event
            runtimeService.signalEventReceived("taskRejected", task.getExecutionId(), rejectValues);
            
            log.info("Task rejected successfully: taskId={}", taskId);
        } catch (FlowableObjectNotFoundException e) {
            throw new SpmsRuntimeException("Task or process instance not found", e);
        } catch (Exception e) {
            throw new SpmsRuntimeException("Failed to reject task", e);
        }
    }

    @Override
    @Transactional
    public void completeTask(String instanceId, String taskId, Long userId, Map<String, Object> completedValues) {
        log.info("Completing task: instanceId={}, taskId={}, userId={}", instanceId, taskId, userId);
        if (instanceId == null || instanceId.isEmpty()) {
            log.warn("Validation failed: Instance ID is null or empty");
            throw new ValidationException("Instance ID cannot be null or empty");
        }
        if (taskId == null || taskId.isEmpty()) {
            throw new ValidationException("Task ID cannot be null or empty");
        }
        if (userId == null) {
            throw new ValidationException("User ID cannot be null");
        }

        try {
            flowableEngine.getTaskService()
                    .complete(taskId, completedValues);
            log.info("Task completed successfully: taskId={}", taskId);
        } catch (Exception e) {
            throw new SpmsRuntimeException("Failed to complete task", e);
        }
    }

    /**
     * 获取所有流程实例的分页列表
     *
     * @param pageable 分页信息（页码、页大小、排序）
     * @return 表示流程实例的 {@link ProcessInstanceModel} 对象列表
     * @throws SpmsRuntimeException 如果检索过程中发生错误
     */
    @Override
    public List<ProcessInstanceModel> getInstances(Pageable pageable) {
        log.debug("Fetching all process instances with pagination: {}", pageable);
        try {
            HistoricProcessInstanceQuery query = flowableEngine.getHistoryService()
                    .createHistoricProcessInstanceQuery()
                    .orderByProcessInstanceStartTime().desc();

            List<HistoricProcessInstance> instances = query.listPage(
                    (int) pageable.getOffset(),
                    pageable.getPageSize()
            );

            return instances.stream()
                    .map(this::toProcessInstanceModel)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching process instances", e);
            throw new SpmsRuntimeException("Failed to retrieve process instances", e);
        }
    }

    /**
     * 获取与用户相关的流程实例分页列表（包括用户启动的流程实例和用户被分配任务的流程实例）
     *
     * @param pageable 分页信息（页码、页大小、排序）
     * @param user 用户模型对象
     * @return 表示用户相关流程实例的 {@link ProcessInstanceModel} 对象列表
     * @throws SpmsRuntimeException 如果检索过程中发生错误
     */
    @Override
    public List<ProcessInstanceModel> getUserRelatedInstances(Pageable pageable, UserModel user) {
        log.debug("Fetching user-related process instances for user: {}", user.getId());
        try {
            String userId = user.getId().toString();
            HistoryService historyService = flowableEngine.getHistoryService();
            TaskService taskService = flowableEngine.getTaskService();

            // 查询用户启动的流程实例
            List<HistoricProcessInstance> startedProcesses = historyService
                    .createHistoricProcessInstanceQuery()
                    .variableValueEquals("initiator", userId)
                    .list();

            // 查询用户被分配任务的流程实例
            List<Task> userTasks = taskService.createTaskQuery()
                    .taskAssignee(userId)
                    .list();

            Set<String> processInstanceIds = userTasks.stream()
                    .map(Task::getProcessInstanceId)
                    .collect(Collectors.toSet());

            List<HistoricProcessInstance> taskProcesses = historyService
                    .createHistoricProcessInstanceQuery()
                    .processInstanceIds(processInstanceIds)
                    .list();

            // 合并并去重
            Set<HistoricProcessInstance> combined = new LinkedHashSet<>();
            combined.addAll(startedProcesses);
            combined.addAll(taskProcesses);

            // 应用分页
            List<HistoricProcessInstance> paginated = combined.stream()
                    .skip(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .toList();

            return paginated.stream()
                    .map(this::toProcessInstanceModel)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching user-related process instances for user: {}", user.getId(), e);
            throw new SpmsRuntimeException("Failed to retrieve user-related process instances", e);
        }
    }

    /**
     * Counts the number of incomplete (active) tasks across all process instances.
     *
     * @return the count of incomplete tasks
     * @throws SpmsRuntimeException if there's an error during the count operation
     */
    @Override
    public long countIncompleteTasks() {
        try {
            return flowableEngine.getTaskService().createTaskQuery().active().count();
        } catch (Exception e) {
            log.error("Error counting incomplete tasks", e);
            throw new SpmsRuntimeException("Failed to count incomplete tasks", e);
        }
    }

    /**
     * Counts the number of completed tasks across all process instances.
     *
     * @return the count of completed tasks
     * @throws SpmsRuntimeException if there's an error during the count operation
     */
    @Override
    public long countCompletedTasks() {
        try {
            return flowableEngine.getHistoryService().createHistoricTaskInstanceQuery().finished().count();
        } catch (Exception e) {
            log.error("Error counting completed tasks", e);
            throw new SpmsRuntimeException("Failed to count completed tasks", e);
        }
    }

    /**
     * Counts the number of currently running process instances.
     *
     * @return the count of active process instances
     * @throws SpmsRuntimeException if there's an error during the count operation
     */
    @Override
    public long countRunningProcesses() {
        try {
            return flowableEngine.getRuntimeService().createProcessInstanceQuery().active().count();
        } catch (Exception e) {
            log.error("Error counting running processes", e);
            throw new SpmsRuntimeException("Failed to count running processes", e);
        }
    }

    /**
     * 获取指定流程实例的状态信息。
     *
     * @param instanceId 流程实例的唯一标识符。
     * @return 包含流程实例状态信息的 {@link ProcessInstanceModel} 对象。
     * @throws ValidationException 如果实例ID为空或无效。
     * @throws NotFoundException   如果找不到对应的流程实例。
     * @apiNote 此方法会查询流程引擎的历史服务，获取流程实例的详细信息，包括状态（ACTIVE 或 COMPLETED）、开始时间、结束时间（如果存在）以及当前活动任务。
     */
    @Override
    @Transactional
    public ProcessInstanceModel getInstanceStatus(String instanceId) {
        log.debug("Getting instance status: instanceId={}", instanceId);
        if (instanceId == null || instanceId.isEmpty()) {
            log.warn("Validation failed: Instance ID is null or empty");
            throw new ValidationException("Instance ID cannot be null or empty");
        }

        HistoricProcessInstance processInstance = flowableEngine.getHistoryService()
                .createHistoricProcessInstanceQuery()
                .processInstanceId(instanceId)
                .singleResult();

        if (processInstance == null) {
            log.error("Process instance not found: instanceId={}", instanceId);
            throw new NotFoundException("Process instance not found");
        }

        return toProcessInstanceModel(processInstance);
    }

    /**
     * 将 HistoricProcessInstance 转换为 ProcessInstanceModel
     *
     * @param instance 要转换的 HistoricProcessInstance 对象
     * @return 转换后的 ProcessInstanceModel 对象
     */
    private ProcessInstanceModel toProcessInstanceModel(HistoricProcessInstance instance) {
        String instanceId = instance.getId();
        return ProcessInstanceModel.builder()
                .instanceId(instanceId)
                .definitionId(instance.getProcessDefinitionId())
                .status(instance.getEndTime() == null ? "ACTIVE" : "COMPLETED")
                .startTime(instance.getStartTime().getTime())
                .endTime(instance.getEndTime() != null ? instance.getEndTime().getTime() : null)
                .activeTasks(getInstanceTasks(instanceId))
                .build();
    }

    /**
     * 根据流程实例ID获取该实例的所有任务。
     *
     * @param instanceId 流程实例的唯一标识符，不能为null或空字符串。
     * @return 包含任务信息的列表，每个任务包括任务ID、名称和分配人。
     * @throws ValidationException 如果instanceId为null或空字符串，抛出此异常。
     */
    @Override
    public List<TaskModel> getInstanceTasks(String instanceId) {
        log.debug("Getting tasks for instance: instanceId={}", instanceId);
        if (instanceId == null || instanceId.isEmpty()) {
            log.warn("Validation failed: Instance ID is null or empty");
            throw new ValidationException("Instance ID cannot be null or empty");
        }

        List<Task> tasks = flowableEngine.getTaskService()
                .createTaskQuery()
                .processInstanceId(instanceId)
                .list();

        List<TaskModel> taskModels = tasks.stream()
                .map(task -> TaskModel.builder()
                        .taskId(task.getId())
                        .name(task.getName())
                        .assignee(task.getAssignee())
                        .build())
                .collect(Collectors.toList());

        log.debug("Found {} tasks for instance: instanceId={}", taskModels.size(), instanceId);
        return taskModels;
    }



}
