package utez.edu.mx.eduhub.modules.entities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "users")
public class UserEntity {

    @Id
    private String id;
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String name;
    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String surname;
    private String lastname;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    private String username;

    @NotBlank(message = "El correo no puede estar vacío")
    @Email(message = "El correo debe tener un formato válido")
    private String email;
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    public UserEntity() {
    }

    public UserEntity(String name, String surname, String lastname, String username, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public UserEntity(String id, String name, String surname, String lastname, String username, String email, String password) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "El nombre no puede estar vacío") @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "El nombre no puede estar vacío") @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres") String name) {
        this.name = name;
    }

    public @NotBlank(message = "El apellido no puede estar vacío") @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres") String getSurname() {
        return surname;
    }

    public void setSurname(@NotBlank(message = "El apellido no puede estar vacío") @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres") String surname) {
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
}
