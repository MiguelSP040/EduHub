package utez.edu.mx.eduhub.modules.entities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Document(collection = "users")
public class UserEntity {

    @Id
    private String id;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;

    @NotBlank(message = "El apellido no puede estar vacío")
    private String surname;

    private String lastname;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    private String username;

    @NotBlank(message = "El correo no puede estar vacío")
    @Email(message = "El correo debe tener un formato válido")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El rol no puede estar vacío")
    private String role; // ROLE_ADMIN, ROLE_INSTRUCTOR, ROLE_STUDENT

    private String description;

    private Boolean isValidated;

    public UserEntity() {
    }

    public UserEntity(String id, String name, String surname, String lastname, String username, String email, String password, String role, String description, Boolean isValidated) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.description = description;
        this.isValidated = isValidated;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "El nombre no puede estar vacío") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "El nombre no puede estar vacío") String name) {
        this.name = name;
    }

    public @NotBlank(message = "El apellido no puede estar vacío") String getSurname() {
        return surname;
    }

    public void setSurname(@NotBlank(message = "El apellido no puede estar vacío") String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public @NotBlank(message = "El nombre de usuario no puede estar vacío") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "El nombre de usuario no puede estar vacío") String username) {
        this.username = username;
    }

    public @NotBlank(message = "El correo no puede estar vacío") @Email(message = "El correo debe tener un formato válido") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "El correo no puede estar vacío") @Email(message = "El correo debe tener un formato válido") String email) {
        this.email = email;
    }

    public @NotBlank(message = "La contraseña no puede estar vacía") @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "La contraseña no puede estar vacía") @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String password) {
        this.password = password;
    }

    public @NotBlank(message = "El rol no puede estar vacío") String getRole() {
        return role;
    }

    public void setRole(@NotBlank(message = "El rol no puede estar vacío") String role) {
        this.role = role;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getValidated() {
        return isValidated;
    }

    public void setValidated(Boolean validated) {
        isValidated = validated;
    }
}
