package com.example.PlanCraftJavaWeb.controller;

import com.example.PlanCraftJavaWeb.entity.Task;
import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tasks")
public class TaskRestController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/stage/{stageId}")
    public List<Task> getTasksByStage(@PathVariable Long stageId) {
        return taskService.getTasksByStageId(stageId);
    }

    @GetMapping("/{id}")
    public Optional<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return taskService.saveTask(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateTaskStatus(@PathVariable Long id, @RequestParam String status) {
        Task task = taskService.getTaskById(id).orElseThrow();
        task.setStatus(status);
        Task updatedTask = taskService.saveTask(task);
        
        // Lấy stage để lấy progress mới nhất
        Stage stage = updatedTask.getStage();
        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedTask.getId());
        response.put("name", updatedTask.getName());
        response.put("description", updatedTask.getDescription());
        response.put("status", updatedTask.getStatus());
        response.put("stageProgress", stage != null ? stage.getProgressPercentage() : 0.0);
        
        return ResponseEntity.ok(response);
    }
} 