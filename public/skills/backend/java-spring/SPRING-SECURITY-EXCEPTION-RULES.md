---
name: spring-security-exception
description: Spring Security JWT konfiguratsiya, GlobalExceptionHandler, typed exceptions, error response standartlari. Security va exception handling yozishda MAJBURIY o'qiladi.
---

# Java Spring — Security va Exception Handling

## 1. SPRING SECURITY KONFIGURATSIYA

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity     // @PreAuthorize uchun
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)          // REST API — stateless
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(
                    (req, res, e) -> res.setStatus(HttpStatus.UNAUTHORIZED.value()))
                .accessDeniedHandler(
                    (req, res, e) -> res.setStatus(HttpStatus.FORBIDDEN.value()))
            )
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // Strength 12 — production minimum
    }
}
```

---

## 2. GLOBAL EXCEPTION HANDLER

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex) {
        return ErrorResponse.of("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse handleBusiness(BusinessException ex) {
        return ErrorResponse.of(ex.getCode(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        List<FieldErrorDto> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> new FieldErrorDto(fe.getField(), fe.getDefaultMessage()))
            .collect(Collectors.toList());
        return new ValidationErrorResponse("VALIDATION_ERROR", "Validatsiya xatosi", errors);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleForbidden(AccessDeniedException ex) {
        return ErrorResponse.of("FORBIDDEN", "Ruxsat yo'q");
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConflict(OptimisticLockingFailureException ex) {
        return ErrorResponse.of("CONFLICT", "Ma'lumot o'zgartirilgan, qayta urinib ko'ring");
    }

    // ✅ KUTILMAGAN XATO — stacktrace HECH QACHON foydalanuvchiga ko'rinmasin!
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Kutilmagan xato [{} {}]: ", request.getMethod(), request.getRequestURI(), ex);
        return ErrorResponse.of("INTERNAL_ERROR", "Ichki server xatosi");
        // ❌ ex.getMessage() → server ichki ma'lumotlarini ochib beradi
    }
}
```

---

## 3. ERROR RESPONSE DTOs

```java
public record ErrorResponse(String code, String message, Instant timestamp) {
    public static ErrorResponse of(String code, String message) {
        return new ErrorResponse(code, message, Instant.now());
    }
}

public record ValidationErrorResponse(
    String code, String message, List<FieldErrorDto> errors, Instant timestamp
) {
    public ValidationErrorResponse(String code, String message, List<FieldErrorDto> errors) {
        this(code, message, errors, Instant.now());
    }
}

public record FieldErrorDto(String field, String message) {}
```

---

## 4. CUSTOM EXCEPTION CLASSES

```java
// ✅ Base exception
public class AppException extends RuntimeException {
    private final String code;
    private final int statusCode;

    public AppException(String message, String code, int statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

// ✅ Domain exceptions
public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String message) {
        super(message, "NOT_FOUND", 404);
    }
}

public class BusinessException extends AppException {
    public BusinessException(String message, String code) {
        super(message, code, 422);
    }
}
```

---

## 5. SECURITY ANTI-PATTERNLAR

```java
// ❌ 1. Password ni log qilish — SECURITY BREACH!
log.debug("Login: email={}, password={}", email, password);

// ✅ Hech qachon credential log qilmang
log.debug("Login attempt: email={}", email);

// ❌ 2. Stacktrace ni foydalanuvchiga qaytarish
return ResponseEntity.status(500).body(ex.getMessage()); // Server info ochiladi!

// ❌ 3. BCrypt strength 4-8 — zaiF
new BCryptPasswordEncoder(4); // Production uchun yetarli emas
// ✅ Minimum 12

// ❌ 4. Method security o'chirilgan
// @EnableMethodSecurity yo'q — @PreAuthorize ishlamaydi, so'zsiz ruxsat

// ❌ 5. Sensitive endpoint actuator — ochiq
management.endpoints.web.exposure.include=*  // Barcha endpoint ochiq — XAVFLI!
// ✅
management.endpoints.web.exposure.include=health,info

// ❌ 6. JWT secret hardcoded
private final String secret = "mySecret123";
// ✅ Environment variable dan
@Value("${jwt.secret}") private String secret;
```
