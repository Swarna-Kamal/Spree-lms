package com.spree.controller;

import com.spree.dto.ApiResponse;
import com.spree.dto.UserCreateRequest;
import com.spree.dto.UserResponse;
import com.spree.dto.UserUpdateRequest;
import com.spree.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully",
                        userService.createUser(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated successfully",
                userService.updateUser(id, request)));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<Void>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        userService.toggleUserActive(id, active);
        return ResponseEntity.ok(ApiResponse.success("User active status updated", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam("q") String query) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(query)));
    }

    @GetMapping("/role/{roleName}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(
            @PathVariable String roleName) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(roleName)));
    }
}
