package com.spms.backend.service.process;

import com.spms.backend.service.model.process.ProcessHistoryModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProcessHistoryService {

    /**
     * Retrieves a paginated history of processes started by a specific user
     *
     * @param userId   ID of the user who started the processes
     * @param pageable Pagination information
     * @return Page of process history models
     */
    Page<ProcessHistoryModel> getHistoryStartedByUser(String userId, Pageable pageable);

    /**
     * Retrieves a paginated history of processes handled by a specific user
     *
     * @param userId   ID of the user who handled the processes
     * @param pageable Pagination information
     * @return Page of process history models
     */
    Page<ProcessHistoryModel> getHistoryHandledByUser(String userId, Pageable pageable);

}
