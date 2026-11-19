package com.spree.repository;

import com.spree.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByCourseIdOrderByModuleOrderAsc(Long courseId);
    long countByCourseId(Long courseId);
}
