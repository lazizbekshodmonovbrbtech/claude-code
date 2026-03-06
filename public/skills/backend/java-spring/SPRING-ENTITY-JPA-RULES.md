---
name: spring-entity-jpa
description: Java Spring Entity dizayni, JPA kritik xatolari — EAGER fetch taqiqlangan, Enum ORDINAL taqiqlangan, equals/hashCode, toString loop. Entity yozishda MAJBURIY o'qiladi.
---

# Java Spring — Entity va JPA Qoidalari

## 1. ENTITY — PRODUCTION STANDART

```java
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_email",          columnList = "email"),
        @Index(name = "idx_users_status_created", columnList = "status, created_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA uchun, tashqaridan yaratish taqiqlangan
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)          // ✅ MAJBURIY STRING
    @Column(nullable = false, length = 20)
    private UserStatus status;

    // ✅ Factory method — new User() o'rniga
    public static User create(String email, String name, String passwordHash) {
        User user = new User();
        user.email        = email;
        user.name         = name;
        user.passwordHash = passwordHash;
        user.status       = UserStatus.ACTIVE;
        return user;
    }

    // ✅ Domain methodlar — biz logikasi entity ichida
    public void deactivate() {
        if (this.status == UserStatus.DELETED)
            throw new BusinessException("O'chirilgan user ni deaktivatsiya qilib bo'lmaydi");
        this.status = UserStatus.INACTIVE;
    }

    public void updateName(String name) { this.name = name; }
}
```

---

## 2. BASE ENTITY — UMUMIY MAYDONLAR

```java
@MappedSuperclass
@Getter
public abstract class BaseEntity {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version  // ✅ Optimistic locking — concurrent update ni oldini oladi
    private Integer version;

    // ✅ Business key asosida equals/hashCode — id null bo'lishi mumkin
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BaseEntity)) return false;
        BaseEntity other = (BaseEntity) o;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() { return getClass().hashCode(); }
}
```

---

## 3. KRITIK JPA XATOLARI

```java
// ❌ 1. EAGER fetch — N+1 va performance katastrofasi
@OneToMany(fetch = FetchType.EAGER)   // MUTLAQO TAQIQLANGAN!
private List<Order> orders;
// Har User yuklananda barcha Order lar ham yuklanadi

// ✅ ALWAYS LAZY
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
           orphanRemoval = true, fetch = FetchType.LAZY)
private List<Order> orders = new ArrayList<>();

// ❌ 2. Enum ORDINAL — enum o'zgarsa DB ma'lumotlar buziLAdi
@Enumerated(EnumType.ORDINAL)  // TAQIQLANGAN! DB da 0,1,2 saqlanadi
private UserStatus status;

// ✅ ALWAYS STRING
@Enumerated(EnumType.STRING)   // DB da 'ACTIVE','INACTIVE' saqlanadi
private UserStatus status;

// ❌ 3. Lombok @ToString — bidirectional relation da StackOverflow
@ToString  // User → orders → user → orders → ... !!!
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}

// ✅ Faqat kerakli fieldlar
@ToString(onlyExplicitlyIncluded = true)
@ToString.Include private Long id;
@ToString.Include private String email;

// ❌ 4. Public setter — entity ni tashqaridan ixtiyoriy o'zgartirish mumkin
@Setter  // Barcha maydonlarga public setter — xavfli!
public class User { ... }

// ✅ Faqat domain methodlar orqali o'zgartirish
public void updateEmail(String email) {
    // Validation, business rule check...
    this.email = email;
}
```

---

## 4. RELATIONSHIP MAPPING

```java
// ✅ @ManyToOne — foreign key egasi
@ManyToOne(fetch = FetchType.LAZY)  // LAZY majburiy!
@JoinColumn(name = "user_id", nullable = false)
private User user;

// ✅ @ManyToMany — join table bilan
@ManyToMany(fetch = FetchType.LAZY)
@JoinTable(
    name = "user_roles",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id")
)
private Set<Role> roles = new HashSet<>();  // Set — duplicate yo'q

// ❌ ManyToMany da List — duplicate va cartesian product muammo
private List<Role> roles; // XATO!

// ✅ Bidirectional — helper method bilan manage qiling
public void addOrder(Order order) {
    orders.add(order);
    order.setUser(this);  // Ikki tomonga ham set
}

public void removeOrder(Order order) {
    orders.remove(order);
    order.setUser(null);
}
```
