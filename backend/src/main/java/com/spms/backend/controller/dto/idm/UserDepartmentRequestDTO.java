package com.spms.backend.controller.dto.idm;

import java.util.List;

public class UserDepartmentRequestDTO {
    private List<Long> userIds;

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }
}
