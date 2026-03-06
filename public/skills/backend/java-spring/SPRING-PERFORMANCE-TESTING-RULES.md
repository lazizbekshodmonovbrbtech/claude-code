---
name: spring-performance-testing
description: Spring Boot performance (cache, bulk operations, read replica), structured logging, MDC, Mockito unit testlari va Testcontainers integration testlari. Performance va test yozishda MAJBURIY o'qiladi.
---

# Java Spring — Performance, Logging va Testing

## 1. CACHE — TAKRORIY QUERY KAMAYTIRISH

```java
@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    // ✅ Cache — bir xil query ni qayta ishlamaslik
    @Cacheable(value = "products", key = "#id")
    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
            .map(ProductResponse::from)
            .orElseThrow(() -> new ResourceNotFoundException("Mahsulot topilmadi: " + id));
    }

    @CacheEvict(value = "products", key = "#id")
    @Transactional
    public ProductResponse update(Long id, UpdateProductRequest req) { ... }

    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public void delete(Long id) { ... }

    // ✅ @Transactional(readOnly = true) — read replica ga yo'naltirish imkoni
    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductResponse::from);
    }
}

// ✅ Cache konfiguratsiya — TTL bilan
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues();
        return RedisCacheManager.builder(factory).cacheDefaults(config).build();
    }
}
```

---

## 2. BULK OPERATIONS — YOZISH OPTIMIZATSIYA

```java
// ❌ XATO: Loop ichida save — N ta INSERT
for (CreateProductRequest req : requests) {
    productRepository.save(Product.create(req)); // N ta query!
}

// ✅ TO'G'RI: saveAll — batch INSERT
List<Product> products = requests.stream()
    .map(Product::create)
    .collect(Collectors.toList());
productRepository.saveAll(products); // 1 yoki bir necha batch query

// ✅ Batch size sozlash — application.properties
// spring.jpa.properties.hibernate.jdbc.batch_size=50
// spring.jpa.properties.hibernate.order_inserts=true
// spring.jpa.properties.hibernate.order_updates=true

// ✅ Bulk update — JPQL bilan
@Modifying
@Query("UPDATE Product p SET p.isActive = false WHERE p.categoryId = :catId")
@Transactional
int deactivateByCategory(@Param("catId") Long categoryId);
// ❌ 1000 ta product uchun loop — 1000 UPDATE emas, 1 ta UPDATE!
```

---

## 3. LOGGING — STRUCTURED VA XAVFSIZ

```java
@Service
@Slf4j
public class UserServiceImpl {

    public UserResponse create(CreateUserRequest req) {
        // ✅ Structured — field=value format
        log.info("User yaratilmoqda: email={}", req.email());

        // ❌ TAQIQLANGAN: password, token, credit card log qilish
        log.debug("Credentials: email={}, password={}", req.email(), req.password()); // XAVFLI!

        try {
            User saved = userRepository.save(User.create(/*...*/));
            log.info("User yaratildi: id={}, email={}", saved.getId(), saved.getEmail());
            return UserResponse.from(saved);
        } catch (Exception e) {
            log.error("User yaratishda xato: email={}", req.email(), e);
            throw e;
        }
    }
}
```

---

## 4. MDC — REQUEST TRACKING

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                     HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String traceId = Optional.ofNullable(req.getHeader("X-Trace-Id"))
            .orElse(UUID.randomUUID().toString());
        MDC.put("traceId", traceId);
        MDC.put("method", req.getMethod());
        MDC.put("path", req.getRequestURI());
        res.setHeader("X-Trace-Id", traceId);
        try {
            chain.doFilter(req, res);
        } finally {
            MDC.clear(); // ✅ MAJBURIY — thread pool da MDC qolmasin
        }
    }
}
```

---

## 5. UNIT TEST — MOCKITO

```java
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private ApplicationEventPublisher eventPublisher;
    @InjectMocks private UserServiceImpl userService;

    @Test
    void create_success() {
        // Arrange
        var req = new CreateUserRequest("ali@test.com", "Ali", "Password1");
        when(userRepository.existsByEmail("ali@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("hash");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act
        var result = userService.create(req);

        // Assert
        assertThat(result.email()).isEqualTo("ali@test.com");
        verify(eventPublisher).publishEvent(any(UserCreatedEvent.class));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void create_duplicateEmail_throws() {
        when(userRepository.existsByEmail("ali@test.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.create(
                new CreateUserRequest("ali@test.com", "Ali", "pass")))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("band");

        verify(userRepository, never()).save(any());
    }
}
```

---

## 6. INTEGRATION TEST — TESTCONTAINERS

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserControllerIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb").withUsername("test").withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired private TestRestTemplate rest;
    @Autowired private UserRepository userRepository;

    @Test
    @Sql("/test-data/users.sql")  // Test ma'lumotlarini yuklash
    void createUser_returns201() {
        var req = new CreateUserRequest("new@test.com", "Yangi", "Password1");
        var res = rest.postForEntity("/api/v1/users", req, UserResponse.class);

        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(res.getBody().email()).isEqualTo("new@test.com");
        assertThat(res.getHeaders().getLocation()).isNotNull();
        assertThat(userRepository.existsByEmail("new@test.com")).isTrue();
    }
}
```
