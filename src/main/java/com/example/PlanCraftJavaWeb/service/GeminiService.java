package com.example.PlanCraftJavaWeb.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=";

    public JSONObject generateRoadmapJson(String goal, String description) {
        RestTemplate restTemplate = new RestTemplate();

        int currentYear = java.time.LocalDate.now().getYear();
        java.time.LocalDate today = java.time.LocalDate.now();
        String todayStr = today.toString(); // yyyy-MM-dd
        String prompt = String.format(
            "Hãy tạo một lộ trình mục tiêu dưới dạng JSON với cấu trúc như sau (không sinh id, user, goal, stage, status, progressPercentage): " +
            "Goal: name, deadline, reason, description, stages; " +
            "Stage: name, description, startDate, endDate, tasks; " +
            "Task: name, description, date. " +
            "Lưu ý: \n" +
            "- Ngày bắt đầu của giai đoạn đầu tiên và nhiệm vụ đầu tiên PHẢI là ngày hiện tại: %s.\n" +
            "- Các nhiệm vụ tiếp theo phải có ngày tăng dần từ ngày này, không được lùi về trước.\n" +
            "- Mỗi stage BẮT BUỘC phải có trường startDate và endDate, định dạng yyyy-MM-dd, và không được nhỏ hơn ngày hiện tại.\n" +
            "- Mỗi stage phải có danh sách nhiệm vụ (tasks) được liệt kê chi tiết cho từng ngày, mỗi ngày một nhiệm vụ rõ ràng, có trường date (yyyy-MM-dd) tương ứng, và không được nhỏ hơn ngày hiện tại.\n" +
            "- Không sinh trường trạng thái (status) và tiến độ (progressPercentage) cho stage/task.\n" +
            "- Đảm bảo đúng định dạng JSON, không thêm giải thích, không sinh id.\n" +
            "Ví dụ một stage đúng: {\"name\": \"Giai đoạn 1\", \"description\": \"...\", \"startDate\": \"%s\", \"endDate\": \"...\", \"tasks\": [{\"name\":\"Nhiệm vụ 1\",\"description\":\"...\",\"date\":\"%s\"}, ...]} . " +
            "Mục tiêu: %s. Mô tả: %s.",
            todayStr, todayStr, todayStr, goal, description
        );

        JSONObject requestBody = new JSONObject();
        JSONArray contents = new JSONArray();
        JSONObject content = new JSONObject();
        JSONArray parts = new JSONArray();
        parts.put(new JSONObject().put("text", prompt));
        content.put("parts", parts);
        contents.put(content);
        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            GEMINI_API_URL + apiKey, entity, String.class);

        JSONObject jsonResponse = new JSONObject(response.getBody());
        String roadmapJsonString = jsonResponse
            .getJSONArray("candidates")
            .getJSONObject(0)
            .getJSONObject("content")
            .getJSONArray("parts")
            .getJSONObject(0)
            .getString("text");

        roadmapJsonString = roadmapJsonString.trim();
        if (roadmapJsonString.startsWith("```json")) {
            roadmapJsonString = roadmapJsonString.replaceFirst("```json", "").trim();
        }
        if (roadmapJsonString.endsWith("```")) {
            roadmapJsonString = roadmapJsonString.substring(0, roadmapJsonString.length() - 3).trim();
        }

        JSONObject roadmap = new JSONObject(roadmapJsonString);
        
        // Làm sạch JSON: loại bỏ các trường không mong muốn
        cleanJsonObject(roadmap);
        
        return roadmap;
    }
    
    private void cleanJsonObject(JSONObject obj) {
        // Loại bỏ các trường không mong muốn
        String[] unwantedFields = {"id", "user", "goal", "stage"};
        for (String field : unwantedFields) {
            if (obj.has(field)) {
                obj.remove(field);
            }
        }
        
        // Xử lý stages nếu có
        if (obj.has("stages") && obj.get("stages") instanceof JSONArray) {
            JSONArray stages = obj.getJSONArray("stages");
            for (int i = 0; i < stages.length(); i++) {
                if (stages.get(i) instanceof JSONObject) {
                    JSONObject stage = stages.getJSONObject(i);
                    cleanJsonObject(stage);
                    
                    // Xử lý tasks trong stage
                    if (stage.has("tasks") && stage.get("tasks") instanceof JSONArray) {
                        JSONArray tasks = stage.getJSONArray("tasks");
                        for (int j = 0; j < tasks.length(); j++) {
                            if (tasks.get(j) instanceof JSONObject) {
                                JSONObject task = tasks.getJSONObject(j);
                                cleanJsonObject(task);
                            }
                        }
                    }
                }
            }
        }
    }
} 