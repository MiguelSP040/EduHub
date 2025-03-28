package utez.edu.mx.eduhub.utils.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTUtil {

    private final String SECRET_KEY = "8SVK61SYxWVprHEPudEkfNgj+Ol/loVHJzqh80ts1ucYmeMJmM2WbDqh04e58Lh54i3YYwPB/cxxyndMaC63uA=="; // Clave secreta para firmar el token

    public String generateToken (UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken (claims,userDetails.getUsername());
    }

    private String createToken (Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractUsername (String token) {
        return extractClaim (token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired (String token) {
        return extractClaim (token, Claims::getExpiration).before(new Date());
    }

    public boolean validateToken (String token, UserDetails userDetails) {
        final String username = extractUsername (token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired (token));
    }

    public String generateTokenWithExpiration(String username, int expirationMinutes) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMinutes * 60 * 1000)) // Expiración en minutos
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


}
