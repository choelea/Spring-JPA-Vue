package tech.icoding.sjv.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

//@Controller
public class AdminPageController {

    @GetMapping("/admin")
    public String admin() {
        return "forward:/admin/index.html";  // 注意是 forward，不是 redirect！
    }
}