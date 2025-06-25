package com.example.PlanCraftJavaWeb.controller;

import com.example.PlanCraftJavaWeb.entity.Goal;
import com.example.PlanCraftJavaWeb.entity.Stage;
import com.example.PlanCraftJavaWeb.entity.Task;
import com.example.PlanCraftJavaWeb.entity.User;
import com.example.PlanCraftJavaWeb.service.GoalService;
import com.example.PlanCraftJavaWeb.service.StageService;
import com.example.PlanCraftJavaWeb.service.TaskService;
import com.example.PlanCraftJavaWeb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@Controller
public class DashboardController {
    @Autowired
    private GoalService goalService;
    @Autowired
    private StageService stageService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private UserService userService;

    // Trang chủ dashboard
    @GetMapping({"/dashboard", "/"})
    public String dashboard(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        Long userId = user.getId();
        model.addAttribute("goals", goalService.getGoalsByUserId(userId));
        return "dashboard";
    }

    // Trang tạo mục tiêu mới
    @GetMapping("/goals/create")
    public String showCreateGoal(Model model) {
        return "goal-create";
    }
    @PostMapping("/goals/create")
    public String createGoal(@RequestParam String name,
                             @RequestParam String deadline,
                             @RequestParam String reason,
                             @RequestParam String description) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        Goal goal = new Goal();
        goal.setUser(user);
        goal.setName(name);
        goal.setDeadline(LocalDate.parse(deadline));
        goal.setReason(reason);
        goal.setDescription(description);
        goal.setStatus("chưa bắt đầu");
        goalService.saveGoal(goal);
        return "redirect:/dashboard";
    }

    // Trang chi tiết mục tiêu
    @GetMapping("/goals/{id}")
    public String goalDetail(@PathVariable Long id, Model model) {
        Optional<Goal> goal = goalService.getGoalById(id);
        if (goal.isPresent()) {
            model.addAttribute("goal", goal.get());
            return "goal-detail";
        }
        return "redirect:/dashboard";
    }

    // Trang thêm giai đoạn mới
    @GetMapping("/stages/create")
    public String showCreateStage(@RequestParam Long goalId, Model model) {
        model.addAttribute("goalId", goalId);
        return "stage-create";
    }
    @PostMapping("/stages/create")
    public String createStage(@RequestParam Long goalId,
                              @RequestParam String name,
                              @RequestParam String description,
                              @RequestParam String startDate,
                              @RequestParam String endDate) {
        Stage stage = new Stage();
        Goal goal = goalService.getGoalById(goalId).orElse(null);
        stage.setGoal(goal);
        stage.setName(name);
        stage.setDescription(description);
        stage.setStartDate(LocalDate.parse(startDate));
        stage.setEndDate(LocalDate.parse(endDate));
        stage.setStatus("chưa bắt đầu");
        stageService.saveStage(stage);
        return "redirect:/goals/" + goalId;
    }

    // Trang chi tiết giai đoạn
    @GetMapping("/stages/{id}")
    public String stageDetail(@PathVariable Long id, Model model) {
        Optional<Stage> stage = stageService.getStageById(id);
        if (stage.isPresent()) {
            model.addAttribute("stage", stage.get());
            return "stage-detail";
        }
        return "redirect:/dashboard";
    }

    // Trang thêm nhiệm vụ mới
    @GetMapping("/tasks/create")
    public String showCreateTask(@RequestParam Long stageId, Model model) {
        model.addAttribute("stageId", stageId);
        return "task-create";
    }
    @PostMapping("/tasks/create")
    public String createTask(@RequestParam Long stageId,
                             @RequestParam String name,
                             @RequestParam String description) {
        Task task = new Task();
        Stage stage = stageService.getStageById(stageId).orElse(null);
        task.setStage(stage);
        task.setName(name);
        task.setDescription(description);
        task.setStatus("chưa làm");
        taskService.saveTask(task);
        return "redirect:/stages/" + stageId;
    }
} 