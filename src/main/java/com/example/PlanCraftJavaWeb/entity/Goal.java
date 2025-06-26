package com.example.PlanCraftJavaWeb.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private LocalDate deadline;
    private String reason;
    private String description;
    private String status;

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stage> stages;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<Stage> getStages() { return stages; }
    public void setStages(List<Stage> stages) { this.stages = stages; }

    // Method để tính tổng số nhiệm vụ
    public long getTotalTasks() {
        if (stages == null) return 0;
        return stages.stream()
                .filter(stage -> stage.getTasks() != null)
                .mapToLong(stage -> stage.getTasks().size())
                .sum();
    }

    // Method để tính số nhiệm vụ đã hoàn thành
    public long getCompletedTasks() {
        if (stages == null) return 0;
        return stages.stream()
                .filter(stage -> stage.getTasks() != null)
                .flatMap(stage -> stage.getTasks().stream())
                .filter(task -> "COMPLETED".equals(task.getStatus()))
                .count();
    }

    // Method để tính phần trăm hoàn thành dựa trên nhiệm vụ
    public double getTaskProgressPercentage() {
        long totalTasks = getTotalTasks();
        if (totalTasks == 0) return 0.0;
        return (double) getCompletedTasks() / totalTasks * 100;
    }
} 