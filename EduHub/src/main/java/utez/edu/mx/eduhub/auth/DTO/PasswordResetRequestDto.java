package utez.edu.mx.eduhub.auth.DTO;

public class PasswordResetRequestDto {
    private String email;

    public PasswordResetRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
