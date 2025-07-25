package com.example.PlanCraftJavaWeb.service;

import com.example.PlanCraftJavaWeb.entity.Task;
import com.example.PlanCraftJavaWeb.repository.TaskRepository;
import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.entity.Goal;
import com.example.PlanCraftJavaWeb.service.StageService;
import com.example.PlanCraftJavaWeb.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private StageService stageService;
    @Autowired
    private GoalService goalService;

    public List<Task> getTasksByStageId(Long stageId) {
        return taskRepository.findByStageId(stageId);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        Task savedTask = taskRepository.save(task);
        // Cập nhật tiến độ stage và goal
        updateStageAndGoalProgress(savedTask);
        return savedTask;
    }

    private void updateStageAndGoalProgress(Task task) {
        Stage stage = task.getStage();
        if (stage == null) return;
        
        // Lấy lại stage từ DB để có danh sách task mới nhất
        stage = stageService.getStageById(stage.getId()).orElse(stage);
        
        // Tính toán progress percentage
        long totalTasks = stage.getTasks() != null ? stage.getTasks().size() : 0;
        long completedTasks = stage.getTasks() != null ? 
            stage.getTasks().stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count() : 0;
        
        // Cập nhật progress percentage
        double progressPercentage = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;
        stage.setProgressPercentage(Math.round(progressPercentage * 100.0) / 100.0); // Làm tròn 2 chữ số thập phân
        
        // Cập nhật trạng thái stage
        if (totalTasks > 0 && completedTasks == totalTasks) {
            stage.setStatus("COMPLETED");
        } else if (completedTasks > 0) {
            stage.setStatus("IN_PROGRESS");
        } else {
            stage.setStatus("NOT_STARTED");
        }
        
        stageService.saveStage(stage);
        
        // Cập nhật tiến độ goal
        Goal goal = stage.getGoal();
        if (goal == null) return;
        goal = goalService.getGoalById(goal.getId()).orElse(goal);
        long totalStages = goal.getStages() != null ? goal.getStages().size() : 0;
        long completedStages = goal.getStages() != null ? 
            goal.getStages().stream()
                .filter(s -> "COMPLETED".equalsIgnoreCase(s.getStatus()))
                .count() : 0;
        
        if (totalStages > 0 && completedStages == totalStages) {
            goal.setStatus("COMPLETED");
        } else if (completedStages > 0) {
            goal.setStatus("IN_PROGRESS");
        } else {
            goal.setStatus("NOT_STARTED");
        }
        
        goalService.saveGoal(goal);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
} 