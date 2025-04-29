package tech.icoding.sjv.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 对以 /admin 开头的路径（且不是静态资源）统一重定向到 index.html
        registry.addViewController("/admin/{path:[^\\.]*}")
                .setViewName("redirect:/admin/index.html");
        registry.addViewController("/admin/{path:^(?!static|index\\.html).*}/{subPath:[^\\.]*}")
                .setViewName("redirect:/admin/index.html");
    }
}