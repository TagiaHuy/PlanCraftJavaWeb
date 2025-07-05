package com.example.PlanCraftJavaWeb.controller;

import com.example.PlanCraftJavaWeb.entity.Goal;
import com.example.PlanCraftJavaWeb.entity.User;
import com.example.PlanCraftJavaWeb.service.GoalService;
import com.example.PlanCraftJavaWeb.service.GeminiService;
import com.example.PlanCraftJavaWeb.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.entity.Task;
import java.util.HashMap;

@RestController
@RequestMapping("/api/goals")
public class GoalRestController {
    @Autowired
    private GoalService goalService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Optional<Goal> getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }

    @PostMapping("/ai-roadmap")
    public ResponseEntity<String> generateRoadmap(@RequestBody Map<String, String> payload) {
        String goal = payload.get("name");
        String description = payload.get("description");
        JSONObject roadmap = geminiService.generateRoadmapJson(goal, description);
        return ResponseEntity.ok(roadmap.toString());
    }

    @PostMapping("/ai-save")
    public ResponseEntity<Map<String, Object>> saveGoalFromAI(@RequestBody Goal goal) {
        // Lấy user hiện tại và gán vào goal
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        goal.setUser(user);

        // Gán mặc định trạng thái cho goal nếu thiếu
        if (goal.getStatus() == null || goal.getStatus().isEmpty()) {
            goal.setStatus("NOT_STARTED");
        }
        
        // Thiết lập quan hệ Goal -> Stage -> Task và gán mặc định trạng thái/tiến độ
        if (goal.getStages() != null) {
            for (Stage stage : goal.getStages()) {
                stage.setGoal(goal); // Thiết lập goal_id cho stage
                // Gán mặc định trạng thái và tiến độ nếu thiếu
                if (stage.getStatus() == null || stage.getStatus().isEmpty()) {
                    stage.setStatus("NOT_STARTED");
                }
                if (stage.getProgressPercentage() == null) {
                    stage.setProgressPercentage(0.0);
                }
                if (stage.getTasks() != null) {
                    for (Task task : stage.getTasks()) {
                        task.setStage(stage); // Thiết lập stage_id cho task
                        // Gán mặc định trạng thái nếu thiếu
                        if (task.getStatus() == null || task.getStatus().isEmpty()) {
                            task.setStatus("NOT_STARTED");
                        }
                        // Gán startDate/endDate từ trường 'date' nếu có
                        if (task.getStartDate() == null && task.getEndDate() == null) {
                            try {
                                java.lang.reflect.Field dateField = task.getClass().getDeclaredField("date");
                                dateField.setAccessible(true);
                                Object dateValue = dateField.get(task);
                                if (dateValue != null) {
                                    java.time.LocalDate date = java.time.LocalDate.parse(dateValue.toString());
                                    task.setStartDate(date);
                                    task.setEndDate(date);
                                }
                            } catch (Exception ignored) {}
                        }
                    }
                }
            }
        }
        
        Goal savedGoal = goalService.saveGoal(goal);
        
        // Trả về DTO đơn giản thay vì entity đầy đủ
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedGoal.getId());
        response.put("name", savedGoal.getName());
        response.put("status", "success");
        response.put("message", "Goal đã được lưu thành công");
        // Thêm các trường tổng hợp cho frontend nếu cần
        response.put("goalStatus", savedGoal.getStatus());
        response.put("totalTasks", savedGoal.getTotalTasks());
        response.put("completedTasks", savedGoal.getCompletedTasks());
        response.put("taskProgressPercentage", savedGoal.getTaskProgressPercentage());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal goal) {
        goal.setId(id);
        return goalService.saveGoal(goal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
} 