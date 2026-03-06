# CLAUDE.md — Java Spring Backend

Bu fayl **barcha Java Spring backend loyihalar** uchun universal yo'riqnoma.

## Texnologiyalar

- Java 17+ · Spring Boot 3 · Spring Data JPA · Spring Security · PostgreSQL
- Test: JUnit 5 · Mockito · Testcontainers

---

## Skill Fayllar — Har Vazifada Majburiy O'qiladi

Claude Code har bir vazifani bajarishdan oldin quyidagi qoidaga ko'ra
tegishli skill fayllarni o'qiydi va ulardagi qoidalarga qat'iy amal qiladi.

### Entity yoki JPA munosabat yozayotganda

@.claude/skills/backend/java-spring/SPRING-ENTITY-JPA-RULES.md

### Repository, query yoki N+1 muammosi bilan ishlayotganda

@.claude/skills/backend/java-spring/SPRING-REPOSITORY-QUERY-RULES.md

### Service qatlami yoki @Transactional yozayotganda

@.claude/skills/backend/java-spring/SPRING-SERVICE-TRANSACTION-RULES.md

### REST Controller yoki DTO yozayotganda

@.claude/skills/backend/java-spring/SPRING-CONTROLLER-DTO-RULES.md

### Security, JWT yoki exception handling yozayotganda

@.claude/skills/backend/java-spring/SPRING-SECURITY-EXCEPTION-RULES.md

### Performance, logging, unit yoki integration test yozayotganda

@.claude/skills/backend/java-spring/SPRING-PERFORMANCE-TESTING-RULES.md

---

## Umumiy Majburiy Qoidalar

```
❌  FetchType.EAGER                  → doim LAZY
❌  @Enumerated(EnumType.ORDINAL)    → doim STRING
❌  findAll() pagination siz         → Pageable majburiy
❌  Entity ni response sifatida      → DTO/Record qaytarilsin
❌  @Autowired field injection        → final + @RequiredArgsConstructor
❌  @Transactional private method    → faqat public da ishlaydi
❌  this.method() self-invocation    → proxy bypass, transaction ishlamaydi
❌  Loop ichida save()               → saveAll() ishlatilsin
❌  Password yoki token log          → hech qachon logga yozilmaydi
❌  stackTrace foydalanuvchiga       → GlobalExceptionHandler generic xabar bersin

✅  @Transactional(readOnly = true)  → barcha read methodda
✅  @Transactional                   → barcha write methodda
✅  @Valid                           → barcha @RequestBody da
✅  BaseEntity                       → createdAt, updatedAt, @Version
✅  @Index                           → so'rovda ishlatiladigan columnlar
✅  Structured log                   → log.info("xabar: field={}", value)
✅  MDC.clear()                      → filter finally blokida
```

---

## O'z-O'zini Review — Kod Yozgandan Keyin Majburiy

> Har qanday kod yozib bo'lgach, javob berishdan **OLDIN** bu checklistni o'tkazing.
> Muammo topilsa — darhol tuzating.

```
ENTITY & JPA
□  EAGER fetch yo'qmi?
□  ORDINAL enum yo'qmi?
□  @ToString bidirectional da loop yo'qmi?
□  @Index kerakli columnlarda bormi?
□  Public setter o'rniga domain method ishlatilganmi?

REPOSITORY
□  N+1 muammo yo'qmi? (JOIN FETCH / @EntityGraph / @BatchSize)
□  Barcha list query da Pageable bormi?
□  findAll() pagination siz chaqirilmadimi?

SERVICE & TRANSACTION
□  Read → @Transactional(readOnly = true)?
□  Write → @Transactional?
□  Private method da @Transactional yo'qmi?
□  this.method() self-invocation yo'qmi?
□  External API call (email, SMS) transaction ichida emas?

CONTROLLER & DTO
□  Entity qaytarilmayaptimi? (DTO/Record bo'lsin)
□  @Valid barcha @RequestBody da bormi?
□  POST → 201 Created + Location header?
□  DELETE → 204 No Content?

SECURITY & EXCEPTION
□  Password/token log qilinmayaptimi?
□  stackTrace foydalanuvchiga ko'rinmayaptimi?
□  Barcha exception GlobalExceptionHandler da handle qilinganmi?

PERFORMANCE & SIFAT
□  Bulk write → saveAll()?
□  Constructor injection — @Autowired field yo'qmi?
□  System.out.println yo'qmi?

TEST
□  Yangi service methodi → Mockito unit test?
□  Yangi endpoint → Testcontainers integration test?
□  Happy path va error case ikkalasi test qilinganmi?
```

---

## Git Commit

> **Claude git commit QILMAYDI** — faqat commit message va o'zgartirilgan fayllar ro'yxatini beradi.

```
feat:     yangi funksionallik
fix:      xato tuzatish
refactor: kodni qayta yozish (logika o'zgarmasdan)
perf:     performance yaxshilash (N+1, batch, cache)
test:     test qo'shish
chore:    konfiguratsiya, dependency

Format: <type>(<scope>): <tavsif>
```

Vazifa tugagach Claude quyidagicha tavsiya beradi:

```
Tavsiya etilgan commit message:
  feat(user): add pagination to user list endpoint

O'zgartirilgan fayllar:
  src/main/java/.../UserController.java
  src/main/java/.../UserServiceImpl.java
  src/main/java/.../UserRepository.java

Commitni amalga oshirish uchun:
  git add src/main/java/.../UserController.java \
          src/main/java/.../UserServiceImpl.java \
          src/main/java/.../UserRepository.java
  git commit -m "feat(user): add pagination to user list endpoint"
```
