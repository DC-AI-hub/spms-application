package com.spms.backend.repository.idm;

import com.spms.backend.repository.entities.idm.Department;
import com.spms.backend.repository.entities.idm.DepartmentType;
import com.spms.backend.repository.BaseRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface DepartmentRepository extends BaseRepository<Department, Long>, JpaSpecificationExecutor<Department> {

    List<Department> findByParentAndType(Long parent, DepartmentType type);


    @Query("SELECT d FROM Department d " +
            "JOIN FETCH d.users u " +
            "WHERE u.id = :userId")
    List<Department> findDepartmentWithUsers(Long userId);

    Page<Department> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
