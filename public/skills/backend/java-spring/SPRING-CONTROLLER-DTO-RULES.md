---
name: spring-controller-dto
description: Spring REST Controller standartlari, DTO pattern (Entity tashqariga chiqarish TAQIQLANGAN), validation, HTTP semantics. Controller va DTO yozishda MAJBURIY o'qiladi.
---

# Java Spring — Controller va DTO Qoidalari

## 1. REST CONTROLLER — STANDART

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // ✅ Pagination majburiy — @PageableDefault bilan
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> findAll(
            @Valid UserSearchRequest request,
            @PageableDefault(size = 20, sort = "createdAt",
                             direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(userService.findAll(request, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // ✅ POST → 201 Created + Location header
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
        UserResponse response = userService.create(req);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest().path("/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    // ✅ PUT → 200 OK (to'liq update)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(userService.update(id, req));
    }

    // ✅ DELETE → 204 No Content
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

---

## 2. DTO — RECORD PATTERN (Java 17+)

```java
// ✅ Request DTO — validation annotatsiyalar bilan
public record CreateUserRequest(
    @NotBlank(message = "Email majburiy")
    @Email(message = "Email formati noto'g'ri")
    @Size(max = 255)
    String email,

    @NotBlank(message = "Ism majburiy")
    @Size(min = 2, max = 100, message = "Ism 2-100 belgi bo'lsin")
    String name,

    @NotBlank(message = "Parol majburiy")
    @Size(min = 8, max = 72, message = "Parol 8-72 belgi bo'lsin")
    String password
) {}

// ✅ Update DTO — barcha maydon optional (partial update)
public record UpdateUserRequest(
    @Email @Size(max = 255) String email,   // null bo'lsa o'zgarmaydi
    @Size(min = 2, max = 100) String name
) {}

// ✅ Response DTO — factory method bilan
public record UserResponse(
    Long id, String email, String name, UserStatus status, LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(),
                                user.getName(), user.getStatus(), user.getCreatedAt());
    }
}
```

---

## 3. ENTITY TASHQARIGA CHIQARISH TAQIQLANGAN

```java
// ❌ KRITIK XATO: Entity ni to'g'ridan-to'g'ri return qilish
@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow();
    // passwordHash, version, lazy collections expose bo'ladi!
    // Serializatsiya muammolari, performance, security xavfi
}

// ❌ XATO: Repository ni controller da to'g'ridan-to'g'ri inject
@Autowired
private UserRepository userRepository; // Service orqali o'ting!

// ✅ HAMISHA DTO qaytaring
@GetMapping("/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id)); // UserResponse
}
```

---

## 4. HTTP SEMANTICS — TO'G'RI STATUS CODES

```
GET    /users          → 200 OK + Page<UserResponse>
GET    /users/{id}     → 200 OK | 404 Not Found
POST   /users          → 201 Created + Location header + UserResponse
PUT    /users/{id}     → 200 OK + UserResponse
PATCH  /users/{id}     → 200 OK + UserResponse (partial update)
DELETE /users/{id}     → 204 No Content

400 Bad Request        → Validation xatosi
401 Unauthorized       → Token yo'q yoki muddati o'tgan
403 Forbidden          → Ruxsat yo'q
404 Not Found          → Resource topilmadi
409 Conflict           → Duplicate (email allaqachon band)
422 Unprocessable      → Biznes qoidasi buzildi
500 Internal Error     → Kutilmagan xato (stacktrace ko'rinmasin!)
```

---

## 5. CONTROLLER ANTI-PATTERNLAR

```java
// ❌ 1. Biznes logika controller da
@PostMapping
public ResponseEntity<UserResponse> create(@RequestBody CreateUserRequest req) {
    if (userRepository.existsByEmail(req.email()))  // XATO! Repository controller da
        return ResponseEntity.badRequest().build();
    // ... logika controller da — XATO!
}

// ❌ 2. Exception ni controller da catch qilish
@GetMapping("/{id}")
public UserResponse get(@PathVariable Long id) {
    try {
        return userService.findById(id);
    } catch (Exception e) {
        return null; // GlobalExceptionHandler ishlatilsin!
    }
}

// ❌ 3. @RequestBody ni validate qilmaslik
public ResponseEntity<?> create(@RequestBody CreateUserRequest req) {
    // @Valid yo'q — validation ishlamaydi!
}

// ❌ 4. Katta pagination limit
@PageableDefault(size = 1000) // 1000 ta record — performance muammo!
// ✅ Max 50-100 ga cheklang
@PageableDefault(size = 20)
// + configuration:
spring.data.web.pageable.max-page-size=100
```
