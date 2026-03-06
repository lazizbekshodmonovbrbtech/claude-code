---
name: spring-service-transaction
description: Spring Service qatlami arxitekturasi, @Transactional to'g'ri ishlatish, kritik transaction xatolari, ApplicationEvent bilan loose coupling. Service yozishda MAJBURIY o'qiladi.
---

# Java Spring — Service va @Transactional Qoidalari

## 1. SERVICE — ARXITEKTURA STANDARTI

```java
@Service
@Transactional(readOnly = true)   // ✅ DEFAULT: read-only — yozish methodlarida override
@RequiredArgsConstructor          // ✅ Constructor injection — @Autowired field TAQIQLANGAN
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public Page<UserResponse> findAll(UserSearchRequest req, Pageable pageable) {
        return userRepository.findAll(UserSpecification.build(req), pageable)
            .map(UserResponse::from);
    }

    @Override
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
            .map(UserResponse::from)
            .orElseThrow(() -> new ResourceNotFoundException("Foydalanuvchi topilmadi: " + id));
    }

    @Override
    @Transactional  // ✅ Yozish uchun override — readOnly = false
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email()))
            throw new BusinessException("Bu email band: " + request.email(), "EMAIL_EXISTS");

        User user = User.create(request.email(), request.name(),
                                passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);

        // ✅ Event — side-effect larni ajratish (email, audit, notification)
        eventPublisher.publishEvent(new UserCreatedEvent(saved.getId(), saved.getEmail()));

        log.info("User created: id={}, email={}", saved.getId(), saved.getEmail());
        return UserResponse.from(saved);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Foydalanuvchi topilmadi: " + id));

        if (request.name()  != null) user.updateName(request.name());
        if (request.email() != null) {
            if (!user.getEmail().equals(request.email()) &&
                userRepository.existsByEmail(request.email()))
                throw new BusinessException("Bu email band", "EMAIL_EXISTS");
            user.updateEmail(request.email());
        }
        // ✅ save() shart emas — @Transactional + dirty checking avtomatik saqlaydi
        return UserResponse.from(user);
    }
}
```

---

## 2. @TRANSACTIONAL — KRITIK XATOLAR

```java
// ❌ 1. Private method da @Transactional — AOP proxy ishlamaydi!
@Transactional
private void processUser(User user) { ... } // TRANSACTION YO'Q!

// ✅ FAQAT public method da
@Transactional
public void processUser(User user) { ... }

// ❌ 2. Self-invocation — transaction ishlaMaydi
@Service
public class OrderService {
    public void placeOrder(OrderRequest req) {
        this.createOrder(req);  // this. → proxy bypass! @Transactional ishlamaydi!
    }

    @Transactional
    public void createOrder(OrderRequest req) { ... }
}
// ✅ Yechim: alohida service ga ajrish, yoki self-injection

// ❌ 3. Checked exception da transaction rollback bo'lmaydi
@Transactional
public void riskyOp() throws IOException {
    // IOException checked — default rollback bo'lmaydi!
}
// ✅ rollbackFor aniq belgilang
@Transactional(rollbackFor = Exception.class)
public void riskyOp() throws IOException { ... }

// ❌ 4. @Transactional dan tashqarida lazy load
public UserResponse getUser(Long id) {  // @Transactional yo'q!
    User user = userRepository.findById(id).orElseThrow();
    return UserResponse.from(user.getOrders()); // LazyInitializationException!
}
// ✅ @Transactional(readOnly = true) qo'shing

// ❌ 5. Long transaction ichida external API call
@Transactional
public void processPayment(PaymentRequest req) {
    Order order = orderRepo.findById(req.orderId()).orElseThrow();
    paymentGateway.charge(req);  // Network call! DB connection ushlab turadi!
    order.markPaid();
}
// ✅ External call ni transaction tashqarisiga chiqaring
```

---

## 3. APPLICATION EVENTS — LOOSE COUPLING

```java
// ✅ Event class
public record UserCreatedEvent(Long userId, String email) {}

// ✅ Event publisher — service da
eventPublisher.publishEvent(new UserCreatedEvent(user.getId(), user.getEmail()));

// ✅ Event listener — alohida komponent
@Component
@Slf4j
public class UserEventHandler {

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    // ↑ Faqat transaction commit bo'lgandan keyin ishlaydi
    public void onUserCreated(UserCreatedEvent event) {
        try {
            emailService.sendWelcome(event.email());
            auditService.log("USER_CREATED", event.userId());
        } catch (Exception e) {
            // ❌ Exception throw qilmang — asosiy tx allaqachon commit bo'lgan
            log.error("User created event handler xatosi: userId={}", event.userId(), e);
        }
    }
}
```

---

## 4. @ASYNC KONFIGURATSIYA

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "taskExecutor")
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("Async-");
        // Queue to'lib ketganda — caller thread da ishlaydi (reject etmaydi)
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            log.error("Async method xatosi: {}", method.getName(), ex);
    }
}
```
