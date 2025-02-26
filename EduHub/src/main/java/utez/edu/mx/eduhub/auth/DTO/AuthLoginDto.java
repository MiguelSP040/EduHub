package utez.edu.mx.eduhub.auth.DTO;


import jakarta.validation.constraints.NotBlank;

public class AuthLoginDto {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String user;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    public AuthLoginDto() {
    }

    public AuthLoginDto(String password, String user) {
        this.password = password;
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
