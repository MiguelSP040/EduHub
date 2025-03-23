package utez.edu.mx.eduhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EduHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduHubApplication.class, args);
    }

}
