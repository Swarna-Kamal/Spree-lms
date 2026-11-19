package com.spree.service;

import com.spree.dto.DepartmentRequest;
import com.spree.dto.DepartmentResponse;
import com.spree.entity.Department;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("A department with this name already exists");
        }

        Department department = Department.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        return mapToResponse(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with ID: " + id));

        String name = request.getName().trim();

        if (departmentRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new BadRequestException("A department with this name already exists");
        }

        department.setName(name);
        department.setDescription(request.getDescription());

        return mapToResponse(departmentRepository.save(department));
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with ID: " + id));

        departmentRepository.delete(department);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .build();
    }
}