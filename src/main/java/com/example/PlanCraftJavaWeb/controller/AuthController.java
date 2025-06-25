package com.example.PlanCraftJavaWeb.controller;

import com.example.PlanCraftJavaWeb.entity.User;
import com.example.PlanCraftJavaWeb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String showRegisterForm() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegister(@RequestParam String username,
                                  @RequestParam String email,
                                  @RequestParam String password,
                                  @RequestParam String confirmPassword,
                                  Model model) {
        if (!password.equals(confirmPassword)) {
            model.addAttribute("error", "Mật khẩu không khớp!");
            return "register";
        }
        if (userRepository.findAll().stream().anyMatch(u -> u.getUsername().equals(username) || u.getEmail().equals(email))) {
            model.addAttribute("error", "Username hoặc Email đã tồn tại!");
            return "register";
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Mã hóa mật khẩu
        userRepository.save(user);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String processLogin(@RequestParam String usernameOrEmail,
                               @RequestParam String password,
                               Model model) {
        User user = userRepository.findAll().stream()
                .filter(u -> (u.getUsername().equals(usernameOrEmail) || u.getEmail().equals(usernameOrEmail))
                        && u.getPassword().equals(password))
                .findFirst().orElse(null);
        if (user == null) {
            model.addAttribute("error", "Sai thông tin đăng nhập!");
            return "login";
        }
        // Đăng nhập thành công, chuyển hướng đến trang danh sách user
        return "redirect:/users";
    }
} 