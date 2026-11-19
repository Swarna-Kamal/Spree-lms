package com.spree.service;

import com.spree.dto.UserCreateRequest;
import com.spree.dto.UserResponse;
import com.spree.dto.UserUpdateRequest;
import com.spree.entity.Role;
import com.spree.entity.User;
import com.spree.exception.BadRequestException;
import com.spree.exception.ResourceNotFoundException;
import com.spree.repository.RoleRepository;
import com.spree.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToResponse(user);
    }

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        String roleName = request.getRoleName() != null ? request.getRoleName() : "STUDENT";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(role)
                .isActive(true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(user.getEmail())
                    && userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email is already in use");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getRoleName() != null) {
            Role role = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", request.getRoleName()));
            user.setRole(role);
        }
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        return mapToResponse(userRepository.save(user));
    }

    public void toggleUserActive(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(active);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String query) {
        return userRepository
                .findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        query, query, query)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countByRole(String roleName) {
        return userRepository.countByRoleName(roleName);
    }

    @Transactional(readOnly = true)
    public long countAll() {
        return userRepository.count();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().getName())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
