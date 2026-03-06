---
name: spring-repository-query
description: Spring Data JPA repository qoidalari, N+1 muammosi va yechimlari, projection, EntityGraph, pagination. Repository yozishda MAJBURIY o'qiladi.
---

# Java Spring — Repository va Query Optimizatsiya

## 1. N+1 MUAMMO — ENG KENG TARQALGAN XATO

```java
// ❌ KLASSIK N+1 MUAMMO
List<User> users = userRepository.findAll();  // 1 query
for (User user : users) {
    // Har user uchun alohida query — N ta query!
    System.out.println(user.getOrders().size());
}
// Agar 100 user bo'lsa → 101 ta SQL query!

// ✅ YECHIM 1: JOIN FETCH
@Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.orders WHERE u.status = :status")
List<User> findByStatusWithOrders(@Param("status") UserStatus status);

// ✅ YECHIM 2: EntityGraph
@EntityGraph(attributePaths = {"orders", "orders.items"})
List<User> findAllByStatus(UserStatus status);

// ✅ YECHIM 3: @BatchSize — lazy load ni batch ga aylantiradi
@BatchSize(size = 30)
@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
private List<Order> orders;
// Endi 100 user uchun: 1 + ceil(100/30) = 5 query
```

---

## 2. REPOSITORY — PROFESSIONAL PATTERN

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Exists check — COUNT emas, EXISTS ishlatadi (tezroq)
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);

    // ✅ Pagination — hamma list query da Pageable MAJBURIY
    Page<User> findByStatus(UserStatus status, Pageable pageable);

    // ❌ XATO: findAll() — millionlab qator kelishi mumkin!
    // ✅ TO'G'RI: Pageable bilan
    Page<User> findAll(Pageable pageable);

    // ✅ Projection — faqat kerakli columnlar
    @Query("SELECT new com.app.dto.UserListItem(u.id, u.name, u.email) " +
           "FROM User u WHERE u.status = :status ORDER BY u.createdAt DESC")
    Page<UserListItem> findActiveUsers(@Param("status") UserStatus status, Pageable pageable);

    // ✅ Interface projection — dynamic proxy, SQL da faqat kerakli column
    List<UserSummary> findByRole(UserRole role);

    // ✅ Bulk update — 1000 ta record uchun 1 query
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id IN :ids")
    @Transactional
    int bulkUpdateStatus(@Param("ids") List<Long> ids, @Param("status") UserStatus status);

    // ✅ Soft delete — to'g'ridan-to'g'ri o'chirmasdan
    @Modifying
    @Query("UPDATE User u SET u.status = 'DELETED', u.deletedAt = :now WHERE u.id = :id")
    int softDelete(@Param("id") Long id, @Param("now") LocalDateTime now);
}
```

---

## 3. INTERFACE PROJECTION

```java
// ✅ Interface-based projection — Spring avtomatik implement qiladi
public interface UserSummary {
    Long getId();
    String getName();
    String getEmail();
    UserStatus getStatus();

    // Computed value — SpEL bilan
    @Value("#{target.name + ' <' + target.email + '>'}")
    String getDisplayName();
}

// Ishlatish — SQL da faqat id, name, email, status columns
List<UserSummary> summaries = userRepository.findByRole(UserRole.USER);
```

---

## 4. KATTA IN CLAUSE — BATCH GA BO'LISH

```java
// ❌ XATO: 10,000 ta id bilan IN clause — DB performance muammo
@Query("SELECT u FROM User u WHERE u.id IN :ids")
List<User> findByIds(@Param("ids") List<Long> ids);

// ✅ TO'G'RI: Batch ga bo'lish
@Service
public class UserBatchService {
    private static final int BATCH_SIZE = 500;

    public List<User> findByIds(List<Long> ids) {
        return Lists.partition(ids, BATCH_SIZE).stream()
            .flatMap(batch -> userRepository.findAllById(batch).stream())
            .collect(Collectors.toList());
    }
}
```

---

## 5. SPECIFICATION — DINAMIK FILTER

```java
// ✅ Specification pattern — murakkab, dinamik query uchun
public class UserSpecification {
    public static Specification<User> build(UserSearchRequest req) {
        return Specification
            .where(hasStatus(req.status()))
            .and(hasRole(req.role()))
            .and(nameLike(req.name()))
            .and(createdAfter(req.from()))
            .and(createdBefore(req.to()));
    }

    private static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }

    private static Specification<User> nameLike(String name) {
        return (root, query, cb) ->
            StringUtils.isBlank(name) ? null :
            cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}

// Service da:
Specification<User> spec = UserSpecification.build(request);
return userRepository.findAll(spec, pageable).map(UserResponse::from);
```

---

## 6. PAGINATION — STANDART SOZLASH

```java
// ✅ Controller da Pageable
@GetMapping
public Page<UserResponse> list(
    @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
    Pageable pageable
) {
    return userService.findAll(pageable);
}

// ✅ Count query optimizatsiya — JOIN FETCH + COUNT bo'lsa muammo
@Query(value = "SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.status = 'ACTIVE'",
       countQuery = "SELECT COUNT(u) FROM User u WHERE u.status = 'ACTIVE'")
Page<User> findActiveWithOrders(Pageable pageable);
```
