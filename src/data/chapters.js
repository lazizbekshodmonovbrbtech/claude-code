// ──────────────────────────────────────────────
//  Claude Code — O'zbekcha Professional Qo'llanma
//  17 bo'lim | Barcha ma'lumotlar tekshirilgan
//  Oxirgi yangilanish: 2026-mart
// ──────────────────────────────────────────────

const t = (title, dots) => `
  <div class="terminal-bar">
    <span class="terminal-dot bg-[#ff5f57]"></span>
    <span class="terminal-dot bg-[#febc2e]"></span>
    <span class="terminal-dot bg-[#28c840]"></span>
    <span class="text-slate-400 text-xs font-mono ml-2">${title}</span>
  </div>`

const tb = (title, ...lines) => `
<div class="terminal-block">
  ${t(title)}
  <div class="terminal-body">
    ${lines.join('\n    ')}
  </div>
</div>`

const line = (cls, text) => `<div class="code-line ${cls}">${text}</div>`
const comment = text => line('comment', text)
const prompt = text => line('prompt', text)
const success = text => line('success', text)
const error = text => line('error', text)
const warning = text => line('warning', text)
const action = text => line('action', text)
const plain = text => line('', text)
const gap = () => plain(' ')

// JSON syntax highlighted line
const json = text => {
  const indent = text.match(/^(\s*)/)[1]
  const nbsp = '&nbsp;'.repeat(indent.length)
  const trimmed = text.trimStart()
  const highlighted = trimmed
    .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="json-key">$1</span>:')
    .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="json-string">$1</span>')
    .replace(/([{}[\]])/g, '<span class="json-bracket">$1</span>')
  return line('json-line', nbsp + highlighted)
}

export const chapters = [
  // ═══════════════════════════════════════
  // 01 — KIRISH VA O'RNATISH
  // ═══════════════════════════════════════
  {
    id: 'kirish',
    num: '01',
    title: "Kirish va O'rnatish",
    icon: '\uD83D\uDE80',
    desc: "Claude Code nima, o'rnatish, narxlar, birinchi sessiya",
    content: `
<h2>1. Kirish va O'rnatish</h2>

<h3>Claude Code nima?</h3>
<p>Claude Code \u2014 Anthropic tomonidan yaratilgan <strong>terminal-based AI coding agent</strong>. Bu oddiy chatbot emas \u2014 u sizning kompyuteringizdagi fayllarni o'qiy oladi, yoza oladi, terminalda buyruqlar ishga tushira oladi va Git bilan ishlaydi. Qisqasi \u2014 to'liq huquqli dasturlash hamkoringiz.</p>
<p>Oddiy AI chatbotdan farqi:</p>
<ul>
  <li><strong>Fayl tizimiga to'liq kirish</strong> \u2014 loyihangiz ichidagi barcha fayllarni o'qiydi va yozadi</li>
  <li><strong>Terminal buyruqlar</strong> \u2014 <code>mvn test</code>, <code>npm run build</code>, <code>git commit</code> \u2014 hammasini o'zi bajaradi</li>
  <li><strong>Kontekst xotirasi</strong> \u2014 CLAUDE.md orqali loyihangiz qoidalarini eslab qoladi</li>
  <li><strong>Katta context oynasi</strong> \u2014 juda katta kod bazalarini ham tushunadi</li>
</ul>

<h3>O'rnatish</h3>
<p>Claude Code'ni o'rnatishning ikki yo'li bor. <strong>Native installer</strong> tavsiya etiladi:</p>

${tb('terminal \u2014 native installer (tavsiya)',
  comment('# macOS / Linux / WSL:'),
  prompt('curl -fsSL https://claude.ai/install.sh | bash'),
  gap(),
  comment('# Windows PowerShell:'),
  prompt('irm https://claude.ai/install.ps1 | iex'),
  gap(),
  comment('# npm orqali ham mumkin (eski usul):'),
  prompt('npm install -g @anthropic-ai/claude-code'),
  gap(),
  comment('# Ishga tushirish:'),
  prompt('claude'),
  success('\u2713 Claude Code ishga tushdi!')
)}

<h3>OAuth vs API Key</h3>
<table>
  <thead><tr><th>Usul</th><th>Narx</th><th>Limit</th><th>Tavsiya</th></tr></thead>
  <tbody>
    <tr><td><strong>OAuth (claude.ai)</strong></td><td>$20\u2013200/oy flat</td><td>Haftalik limit</td><td>Ko'p foydalanish uchun</td></tr>
    <tr><td><strong>API Key</strong></td><td>Token hisobi</td><td>Yo'q</td><td>CI/CD, automation</td></tr>
    <tr><td><strong>Pro ($20/oy)</strong></td><td>Flat</td><td>Maqul</td><td>Boshlash uchun ideal</td></tr>
    <tr><td><strong>Max 5x ($100/oy)</strong></td><td>Flat</td><td>5x ko'p</td><td>Professional</td></tr>
    <tr><td><strong>Max 20x ($200/oy)</strong></td><td>Flat</td><td>20x ko'p</td><td>Katta jamoalar</td></tr>
  </tbody>
</table>

<h3>Birinchi sessiya</h3>
<p>Loyihangiz papkasida <code>claude</code> buyrug'ini ishga tushiring. Eng muhim slash buyruqlar:</p>
<ul>
  <li><code>/init</code> \u2014 loyiha tuzilmasini skanlab CLAUDE.md yaratadi</li>
  <li><code>/model</code> \u2014 Opus, Sonnet, Haiku orasidan tanlash</li>
  <li><code>/cost</code> \u2014 joriy sessiya xarajatini ko'rish</li>
  <li><code>/doctor</code> \u2014 o'rnatish muammolarini aniqlash</li>
  <li><code>/compact</code> \u2014 kontekstni siqib, xotirani bo'shatish</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 02 — PROFESSIONAL PROMPTLASH
  // ═══════════════════════════════════════
  {
    id: 'promptlash',
    num: '02',
    title: "Professional Promptlash",
    icon: '\uD83D\uDCDD',
    desc: "Samarali prompt yozish, Java va TypeScript misollari",
    content: `
<h2>2. Professional Promptlash</h2>
<p>Claude Code'dan maksimal natija olish uchun prompt yozish san'ati. Yaxshi prompt = yaxshi natija.</p>

<h3>Asosiy qoidalar</h3>
<ul>
  <li><strong>Aniq fayl ko'rsating</strong> \u2014 <code>@src/service/UserService.java</code></li>
  <li><strong>Pattern ko'rsating</strong> \u2014 "ProductService.java uslubida yoz"</li>
  <li><strong>Kichik vazifalar</strong> \u2014 mega-prompt o'rniga bitta-bitta bering</li>
  <li><strong>Kontekst bering</strong> \u2014 "Bu Spring Boot 3.2 loyiha, PostgreSQL ishlatamiz"</li>
</ul>

<h3>Java \u2014 Yaxshi vs Yomon Prompt</h3>
${tb('claude \u2014 Java misol',
  comment('# \u274C Yomon:'),
  error('UserService ga bir narsa qo\'sh'),
  gap(),
  comment('# \u2705 Yaxshi:'),
  prompt('@src/main/java/com/app/service/UserService.java ni ko\'rib,'),
  prompt('getUserById() metodiga Optional&lt;User&gt; qaytarish qo\'sh.'),
  prompt('ProductService.java dagi pattern\'ga amal qil.'),
  prompt('JUnit 5 testi ham kerak.')
)}

<h3>TypeScript \u2014 Yaxshi Prompt Misoli</h3>
${tb('claude \u2014 TypeScript misol',
  comment('# \u2705 Aniq va natijali:'),
  prompt('@src/api/userRouter.ts ga yangi endpoint qo\'sh:'),
  prompt('GET /api/users/:id/orders \u2014 foydalanuvchi buyurtmalarini qaytarsin.'),
  prompt('Zod validatsiya, proper error handling,'),
  prompt('va src/api/productRouter.ts uslubida yoz.')
)}

<h3>Muhim slash buyruqlar</h3>
<table>
  <thead><tr><th>Buyruq</th><th>Vazifasi</th></tr></thead>
  <tbody>
    <tr><td><code>/compact</code></td><td>Context'ni siqadi (50% da ishlating)</td></tr>
    <tr><td><code>/model</code></td><td>Model almashtirish (Opus, Sonnet, Haiku)</td></tr>
    <tr><td><code>/cost</code></td><td>Token xarajatini ko'rish</td></tr>
    <tr><td><code>/context</code></td><td>Context band'ligini ko'rish</td></tr>
    <tr><td><code>/memory</code></td><td>CLAUDE.md ni tahrirlash</td></tr>
    <tr><td><code>/doctor</code></td><td>Muammolarni aniqlash</td></tr>
  </tbody>
</table>
`
  },

  // ═══════════════════════════════════════
  // 03 — CLAUDE.MD XOTIRASI
  // ═══════════════════════════════════════
  {
    id: 'claude-md',
    num: '03',
    title: 'Loyiha Xotirasi',
    icon: '\uD83E\uDDE0',
    desc: "CLAUDE.md \u2014 loyihangiz qoidalari va konteksti",
    content: `
<h2>3. Loyiha Xotirasi \u2014 CLAUDE.md</h2>
<p>CLAUDE.md \u2014 Claude'ning "loyiha IQ'si". Har sessiyada avtomatik o'qiladi, loyiha konventsiyalarini biladi.</p>

<h3>CLAUDE.md tuzilmasi (Java loyiha uchun)</h3>
${tb('CLAUDE.md',
  comment('# Loyiha: TaskManager'),
  plain('Java 21 + Spring Boot 3.2 + PostgreSQL'),
  gap(),
  comment('## Buyruqlar'),
  plain('mvn spring-boot:run'),
  plain('mvn test -Dtest=UserServiceTest'),
  gap(),
  comment('## Konventsiyalar'),
  plain('- UserService.java uslubiga amal qil'),
  plain('- Lombok @Builder, @Data majburiy'),
  plain('- Har endpoint uchun JUnit 5 test'),
  plain('- Swagger @Operation annotatsiya')
)}

<h3>Xotira ierarxiyasi</h3>
<p>Claude Code CLAUDE.md fayllarini quyidagi tartibda o'qiydi (barchasi birlashtiriladi):</p>
<ul>
  <li><strong>~/.claude/CLAUDE.md</strong> \u2014 global (barcha loyihalar uchun, masalan: "Doim o'zbek tilida javob ber")</li>
  <li><strong>./CLAUDE.md</strong> yoki <strong>./.claude/CLAUDE.md</strong> \u2014 loyiha darajasi (eng muhim)</li>
  <li><strong>./.claude/rules/</strong> \u2014 yo'l bo'yicha qoidalar (masalan: <code>api/*.md</code> faqat API fayllar uchun)</li>
  <li><strong>./.claude/skills/</strong> \u2014 qayta foydalaniladigan bilimlar</li>
</ul>

<h3>TypeScript loyiha uchun misol</h3>
${tb('CLAUDE.md \u2014 TypeScript',
  comment('# Loyiha: E-Commerce API'),
  plain('Node.js 20 + TypeScript 5.3 + Prisma + PostgreSQL'),
  gap(),
  comment('## Buyruqlar'),
  plain('npm run dev        # development server'),
  plain('npm test           # vitest'),
  plain('npm run build      # production build'),
  gap(),
  comment('## Konventsiyalar'),
  plain('- Zod validatsiya har endpointda'),
  plain('- camelCase nomlar, PascalCase tiplar'),
  plain('- src/api/productRouter.ts uslubida yoz'),
  plain('- Barcha public funksiyalarga JSDoc')
)}

<h3>Muhim qoida</h3>
<p><strong>CLAUDE.md ni 150 qatordan qisqa saqlang.</strong> Ko'p bo'lsa \u2014 Rules va Skills'ga ko'chiring. <code>/memory</code> buyrug'i bilan tezkor tahrirlash mumkin.</p>
`
  },

  // ═══════════════════════════════════════
  // 04 — ISH OQIMLARI
  // ═══════════════════════════════════════
  {
    id: 'workflow',
    num: '04',
    title: "Workflow va Ish Tartibi",
    icon: '\u2699\uFE0F',
    desc: "Vazifalar rejasi, model tanlash, git va kunlik tartib",
    content: `
<h2>4. Tizimli Ish Oqimlari</h2>
<p>Professional Claude Code foydalanishning asosi \u2014 tizimli yondashuv.</p>

<h3>4.1 Task List \u2014 Vazifalar Ro'yxati</h3>
<p>CLAUDE.md ichida vazifalar ro'yxati yuritish Claude'ga nima qilish kerakligini aniq ko'rsatadi:</p>
${tb('CLAUDE.md \u2014 task list',
  comment('## Joriy Vazifalar'),
  success('- [x] UserService \u2014 Optional qo\'shildi'),
  success('- [x] JUnit testlar yozildi'),
  warning('- [ ] OrderController \u2014 CRUD endpoints'),
  warning('- [ ] Swagger dokumentatsiya'),
  warning('- [ ] Docker konfiguratsiya')
)}

<h3>4.2 Model Tanlash Strategiyasi</h3>
<table>
  <thead><tr><th>Vazifa</th><th>Model</th><th>Sabab</th></tr></thead>
  <tbody>
    <tr><td>Murakkab arxitektura, bug</td><td><strong>Opus</strong></td><td>Chuqur fikrlash, eng sifatli</td></tr>
    <tr><td>Kunlik feature, refactoring</td><td><strong>Sonnet</strong></td><td>Tezlik va sifat balansi</td></tr>
    <tr><td>Fayl o'qish, qidiruv</td><td><strong>Haiku</strong></td><td>Arzon, tez</td></tr>
    <tr><td>CI/CD (headless)</td><td><strong>Sonnet</strong></td><td>Ko'p chaqiriladi, arzon</td></tr>
  </tbody>
</table>

<h3>4.3 Git Workflow</h3>
<ul>
  <li>Har kichik vazifadan keyin commit qiling</li>
  <li>Conventional Commits: <code>feat(auth): add JWT token</code></li>
  <li><code>/compact</code> ni ~50% da qo'lda ishlating</li>
  <li>Bir vaqtda bitta vazifa \u2014 mega-promptlar xavfli</li>
</ul>

<h3>4.4 Samarali ishlash formulasi</h3>
${tb('Optimal workflow',
  comment('# 1-qadam: Kontekst bering'),
  prompt('/init'),
  gap(),
  comment('# 2-qadam: Aniq vazifa'),
  prompt('UserService.java ga findByEmail metod qo\'sh'),
  gap(),
  comment('# 3-qadam: Tekshirish'),
  prompt('Testlarni ishga tushir va natijani ko\'rsat'),
  gap(),
  comment('# 4-qadam: Commit'),
  prompt('O\'zgarishlarni commit qil: feat(user): add findByEmail'),
  gap(),
  comment('# 5-qadam: Keyingi vazifa (yangi kontekst)'),
  prompt('/compact'),
  prompt('Endi OrderController ni yozamiz...')
)}
`
  },

  // ═══════════════════════════════════════
  // 05 — SKILLS
  // ═══════════════════════════════════════
  {
    id: 'skills-andozalar',
    num: '05',
    title: "Skills va Andozalar",
    icon: '\uD83D\uDCDA',
    desc: "Skills \u2014 qayta foydalaniladigan pattern va qoliplar",
    content: `
<h2>5. Skills \u2014 Domain Bilimlari</h2>
<p>Skills \u2014 qayta foydalaniladigan bilim fayllari. Bir marta yozing, har doim ishlating. CLAUDE.md ni toza saqlashda juda foydali.</p>

<h3>Skill yaratish</h3>
${tb('.claude/skills/java-spring-patterns.md',
  comment('---'),
  plain('name: java-spring-patterns'),
  plain('description: Spring Boot servis pattern\'lari'),
  comment('---'),
  gap(),
  comment('## Service Pattern'),
  plain('@Service @Transactional @RequiredArgsConstructor'),
  plain('findById -> Optional, orElseThrow(NotFoundException)'),
  gap(),
  comment('## Test Pattern'),
  plain('@ExtendWith(MockitoExtension.class)'),
  plain('@Mock Repository, @InjectMocks Service')
)}

<h3>Skill turlari</h3>
<table>
  <thead><tr><th>Skill nomi</th><th>Vazifasi</th></tr></thead>
  <tbody>
    <tr><td><code>java-spring-patterns</code></td><td>Spring Boot service, repo, test pattern'lari</td></tr>
    <tr><td><code>ts-api-patterns</code></td><td>TypeScript API, Zod validatsiya, tip pattern'lari</td></tr>
    <tr><td><code>js-testing-patterns</code></td><td>Jest, Vitest test yozish qoliplari</td></tr>
    <tr><td><code>vue-component-patterns</code></td><td>Composition API, Pinia, defineProps pattern</td></tr>
    <tr><td><code>docker-patterns</code></td><td>Dockerfile, docker-compose best practice</td></tr>
  </tbody>
</table>

<h3>Skills vs Rules</h3>
<ul>
  <li><strong>Skills</strong> \u2014 qayta foydalaniladigan bilim: pattern'lar, boilerplate, best practice</li>
  <li><strong>Rules</strong> \u2014 ma'lum fayl yo'llariga oid qoidalar: "api/ papkadagi fayllar uchun Zod validatsiya ishlat"</li>
  <li><strong>CLAUDE.md</strong> \u2014 umumiy loyiha konteksti: stack, buyruqlar, asosiy konventsiyalar</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 06 — AGENTLI MUHANDISLIK
  // ═══════════════════════════════════════
  {
    id: 'agents',
    num: '06',
    title: "Maxsus Agentlar",
    icon: '\uD83E\uDD16',
    desc: "Ixtisoslashgan agentlar yaratish va ishlatish",
    content: `
<h2>6. Agentli Muhandislik</h2>
<p>Maxsus agentlar \u2014 loyihangizdagi turli rollar uchun sozlangan Claude nusxalari. Har bir agent o'z sohasida ixtisoslashgan.</p>

<h3>Agent yaratish</h3>
${tb('.claude/agents/java-backend.md',
  comment('---'),
  plain('name: java-backend'),
  plain('description: Spring Boot backend ixtisoslashgan agent'),
  plain('skills: [java-spring-patterns]'),
  comment('---'),
  gap(),
  plain('Siz Java 21 + Spring Boot 3.2 mutaxassisisiz.'),
  plain('Lombok, JPA, Security, JUnit 5 \u2014 barcha best practice'),
  plain('bilasiz. Har yangi metodga JavaDoc qo\'shasiz.')
)}

<h3>Agentlarni ishlatish</h3>
${tb('terminal',
  comment('# Maxsus agent bilan sessiya boshlash:'),
  prompt('claude --agent java-backend'),
  prompt('claude --agent ts-frontend'),
  prompt('claude --agent js-node'),
  gap(),
  comment('# Mavjud agentlar ro\'yxati:'),
  prompt('/agents')
)}

<h3>Agent misollari</h3>
<table>
  <thead><tr><th>Agent</th><th>Ixtisoslik</th><th>Qachon ishlatish</th></tr></thead>
  <tbody>
    <tr><td><code>java-backend</code></td><td>Spring Boot, JPA, Security</td><td>Backend API, servislar</td></tr>
    <tr><td><code>ts-frontend</code></td><td>Vue 3, React, TypeScript</td><td>UI komponentlar, state</td></tr>
    <tr><td><code>db-architect</code></td><td>SQL, migratsiyalar</td><td>Schema o'zgartirish</td></tr>
    <tr><td><code>test-writer</code></td><td>JUnit, Vitest, Jest</td><td>Faqat test yozish</td></tr>
    <tr><td><code>code-reviewer</code></td><td>Code review, security</td><td>PR tekshirish</td></tr>
  </tbody>
</table>
`
  },

  // ═══════════════════════════════════════
  // 07 — HOOKS
  // ═══════════════════════════════════════
  {
    id: 'hooks',
    num: '07',
    title: "Hooks va Avtomatlashtirish",
    icon: '\u26A1',
    desc: "Hooks \u2014 kod yozilganda avtomatik sifat nazorati",
    content: `
<h2>7. Hooks \u2014 Hayot Aylanish Hodisalari</h2>
<p>Hooks \u2014 Claude harakatlaridan oldin yoki keyin avtomatik ishlaydigan skriptlar. Sifat nazorati uchun juda foydali.</p>

<h3>Asosiy Hook turlari</h3>
<table>
  <thead><tr><th>Hook</th><th>Qachon ishlaydi</th><th>Misol</th></tr></thead>
  <tbody>
    <tr><td><code>PreToolUse</code></td><td>Tool ishlatishdan oldin</td><td>Xavfli buyruqni bloklash</td></tr>
    <tr><td><code>PostToolUse</code></td><td>Tool ishlatgandan keyin</td><td>Checkstyle, Prettier avtomatik</td></tr>
    <tr><td><code>Stop</code></td><td>Vazifa tugagandan keyin</td><td>mvn test / npm test avtomatik</td></tr>
    <tr><td><code>SessionStart</code></td><td>Sessiya boshida</td><td>git pull, muhit sozlash</td></tr>
    <tr><td><code>SessionEnd</code></td><td>Sessiya tugaganda</td><td>Log saqlash</td></tr>
    <tr><td><code>UserPromptSubmit</code></td><td>Prompt yuborilganda</td><td>Prompt validatsiya</td></tr>
    <tr><td><code>Notification</code></td><td>Bildirishnoma kerak bo'lganda</td><td>Slack xabar yuborish</td></tr>
    <tr><td><code>PreCompact</code></td><td>Compact qilishdan oldin</td><td>Muhim ma'lumotni saqlash</td></tr>
  </tbody>
</table>

<h3>Java Checkstyle Hook</h3>
${tb('.claude/settings.json \u2014 hooks',
  json('{'),
  json('  "hooks": {'),
  json('    "PostToolUse": [{'),
  json('      "matcher": "Write|Edit",'),
  json('      "hooks": [{'),
  json('        "type": "command",'),
  json('        "command": "mvn checkstyle:check -q"'),
  json('      }]'),
  json('    }]'),
  json('  }'),
  json('}')
)}

<h3>TypeScript \u2014 Prettier Hook</h3>
${tb('.claude/settings.json \u2014 prettier',
  json('{'),
  json('  "hooks": {'),
  json('    "PostToolUse": [{'),
  json('      "matcher": "Write|Edit",'),
  json('      "hooks": [{'),
  json('        "type": "command",'),
  json('        "command": "npx prettier --write ."'),
  json('      }]'),
  json('    }],'),
  json('    "Stop": [{'),
  json('      "hooks": [{'),
  json('        "type": "command",'),
  json('        "command": "npm test"'),
  json('      }]'),
  json('    }]'),
  json('  }'),
  json('}')
)}

<p><strong>Muhim:</strong> Hook xatosi Claude'ga qaytariladi va u xatoni tuzatishga harakat qiladi. Bu sifat nazoratining eng kuchli mexanizmi.</p>
`
  },

  // ═══════════════════════════════════════
  // 08 — MCP SERVERLAR
  // ═══════════════════════════════════════
  {
    id: 'mcp',
    num: '08',
    title: "MCP \u2014 Tashqi Toollar",
    icon: '\uD83D\uDD0C',
    desc: "MCP \u2014 GitHub, PostgreSQL, Playwright integratsiya",
    content: `
<h2>8. MCP Serverlar \u2014 Tashqi Toollar</h2>
<p>Model Context Protocol (MCP) \u2014 Claude'ga tashqi toollarni ulash standarti. USB-C kabi \u2014 bitta standart, ko'p qurilma.</p>

<h3>Asosiy MCP serverlar</h3>
<table>
  <thead><tr><th>Server</th><th>Nima beradi</th><th>O'rnatish</th></tr></thead>
  <tbody>
    <tr><td><strong>GitHub MCP</strong></td><td>PR, issue, repo boshqaruvi</td><td><code>npx @modelcontextprotocol/server-github</code></td></tr>
    <tr><td><strong>PostgreSQL MCP</strong></td><td>DB so'rovlar, schema ko'rish</td><td><code>npx @modelcontextprotocol/server-postgres</code></td></tr>
    <tr><td><strong>Playwright MCP</strong></td><td>Brauzer avtomatizatsiya, test</td><td><code>npx @playwright/mcp@latest</code></td></tr>
    <tr><td><strong>Filesystem MCP</strong></td><td>Tashqi papkalarga kirish</td><td><code>npx @modelcontextprotocol/server-filesystem</code></td></tr>
  </tbody>
</table>

<h3>.mcp.json konfiguratsiya</h3>
<p>Loyiha ildizida <code>.mcp.json</code> fayl yarating. Bu Git'ga qo'shiladi va jamoa bilan bo'lishiladi:</p>
${tb('.mcp.json',
  json('{'),
  json('  "mcpServers": {'),
  json('    "github": {'),
  json('      "command": "npx",'),
  json('      "args": ["@modelcontextprotocol/server-github"],'),
  json('      "env": { "GITHUB_TOKEN": "ghp_..." }'),
  json('    },'),
  json('    "postgres": {'),
  json('      "command": "npx",'),
  json('      "args": ['),
  json('        "@modelcontextprotocol/server-postgres",'),
  json('        "postgresql://user:pass@localhost/mydb"'),
  json('      ]'),
  json('    }'),
  json('  }'),
  json('}')
)}

<h3>MCP bilan ishlash</h3>
<ul>
  <li><code>/mcp</code> buyrug'i bilan mavjud serverlarni ko'rish</li>
  <li>Claude avtomatik MCP toollarni aniqlaydi va ishlatadi</li>
  <li>Masalan: "GitHub'dagi #42 issue'ni ko'rsat" \u2014 GitHub MCP orqali bajariladi</li>
  <li>PostgreSQL MCP bilan: "users jadvalidagi oxirgi 10 yozuvni ko'rsat"</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 09 — PERMISSIONS VA XAVFSIZLIK
  // ═══════════════════════════════════════
  {
    id: 'permissions',
    num: '09',
    title: "Ruxsatlar va Xavfsizlik",
    icon: '\uD83D\uDD12',
    desc: "Ruxsat rejimlari, xavfli buyruqlarni bloklash",
    content: `
<h2>9. Permissions va Xavfsizlik</h2>
<p>Claude Code sizning kompyuteringizda to'g'ridan-to'g'ri ishlaydi. Shuning uchun ruxsatlar tizimi juda muhim.</p>

<h3>Permission rejimlari</h3>
<table>
  <thead><tr><th>Rejim</th><th>Tavsif</th><th>Qachon ishlatish</th></tr></thead>
  <tbody>
    <tr><td><strong>default</strong></td><td>Har bir amal uchun ruxsat so'raydi</td><td>Boshlang'ich, xavfsiz</td></tr>
    <tr><td><strong>acceptEdits</strong></td><td>Fayl o'zgartirishlarni avtomatik qabul qiladi</td><td>Ishonchli loyihada</td></tr>
    <tr><td><strong>plan</strong></td><td>Faqat o'qish, hech narsa o'zgartirmaydi</td><td>Kod tahlili, review</td></tr>
    <tr><td><strong>dontAsk</strong></td><td>Oldindan ruxsat berilmaganlarni rad etadi</td><td>Qat'iy nazorat kerak bo'lganda</td></tr>
    <tr><td><strong>bypassPermissions</strong></td><td>Barcha ruxsatlarni o'tkazib yuboradi</td><td>Faqat CI/CD, Docker ichida</td></tr>
  </tbody>
</table>

<h3>Settings orqali ruxsatlar</h3>
<p><code>.claude/settings.json</code> faylida aniq ruxsatlar berish mumkin:</p>
${tb('.claude/settings.json \u2014 permissions',
  json('{'),
  json('  "permissions": {'),
  json('    "allow": ['),
  json('      "Read",'),
  json('      "Glob",'),
  json('      "Grep",'),
  json('      "Bash(mvn test)",'),
  json('      "Bash(npm test)",'),
  json('      "Bash(git status)",'),
  json('      "Bash(git diff)"'),
  json('    ],'),
  json('    "deny": ['),
  json('      "Bash(rm -rf *)",'),
  json('      "Bash(curl*|*sudo*)"'),
  json('    ]'),
  json('  }'),
  json('}')
)}

<h3>Xavfsizlik qoidalari</h3>
<ul>
  <li><strong>Hech qachon</strong> <code>bypassPermissions</code> ni lokal ishlatmang \u2014 faqat izolyatsiya qilingan muhitda</li>
  <li><strong>API kalitlarni</strong> CLAUDE.md yoki .mcp.json ga to'g'ridan-to'g'ri yozmang \u2014 muhit o'zgaruvchilari ishlating</li>
  <li><strong>deny</strong> ro'yxatida xavfli buyruqlarni bloklang: <code>rm -rf</code>, <code>sudo</code>, <code>curl | sh</code></li>
  <li><strong>.claude/settings.json</strong> ni Git'ga qo'shing \u2014 jamoadagi barcha a'zolar bir xil ruxsatlarda ishlaydi</li>
</ul>

<h3>CI/CD uchun xavfsiz sozlash</h3>
${tb('GitHub Actions \u2014 xavfsiz rejim',
  comment('# Docker container ichida xavfsiz:'),
  prompt('claude -p "Kodni tekshir" \\'),
  prompt('  --permission-mode bypassPermissions'),
  gap(),
  comment('# API kalitni secret sifatida bering:'),
  plain('env:'),
  plain('  ANTHROPIC_API_KEY: ${"{"}{"{"}  secrets.ANTHROPIC_KEY  {"}"}{"}"}'  )
)}
`
  },

  // ═══════════════════════════════════════
  // 10 — CI/CD VA HEADLESS
  // ═══════════════════════════════════════
  {
    id: 'cicd',
    num: '10',
    title: "CI/CD va Headless Rejim",
    icon: '\uD83D\uDD04',
    desc: "CI/CD \u2014 GitHub Actions, Docker, headless rejim",
    content: `
<h2>10. CI/CD va Headless Rejim</h2>
<p>Claude Code'ni GitHub Actions, Docker va boshqa CI/CD pipeline'larda avtomatik ishlatish. <code>-p</code> (print) flagi bilan interaktiv bo'lmagan rejimda ishlaydi.</p>

<h3>Headless rejim</h3>
${tb('terminal \u2014 headless',
  comment('# Bitta vazifani headless bajarish:'),
  prompt('claude -p "Bu kodni tekshir va xatolarni tuzat"'),
  gap(),
  comment('# JSON formatda natija:'),
  prompt('claude -p "PR review" --output-format json'),
  gap(),
  comment('# Stream JSON (real-time):'),
  prompt('claude -p "Analyze" --output-format stream-json'),
  gap(),
  comment('# Git diff bilan PR review:'),
  prompt('git diff main...feature | claude -p "Tekshir"')
)}

<h3>GitHub Actions \u2014 Java Maven</h3>
${tb('.github/workflows/claude-review.yml',
  plain('name: Claude PR Review'),
  plain('on: [pull_request]'),
  plain('jobs:'),
  plain('  review:'),
  plain('    runs-on: ubuntu-latest'),
  plain('    steps:'),
  plain('      - uses: actions/checkout@v4'),
  plain('      - run: curl -fsSL https://claude.ai/install.sh | bash'),
  plain('      - run: |'),
  plain('          git diff origin/main...HEAD | \\'),
  plain('          claude -p "Java kodni tekshir: \\'),
  plain('            code style, xavfsizlik, test coverage" \\'),
  plain('          --output-format json'),
  plain('        env:'),
  plain('          ANTHROPIC_API_KEY: ${"{"}{"{"}  secrets.ANTHROPIC_KEY  {"}"}{"}"}'  )
)}

<h3>Docker ichida</h3>
${tb('Dockerfile',
  plain('FROM node:20-slim'),
  plain('RUN curl -fsSL https://claude.ai/install.sh | bash'),
  plain('WORKDIR /app'),
  plain('COPY . .'),
  plain('RUN claude -p "Loyihani tekshir" \\'),
  plain('    --permission-mode bypassPermissions')
)}

<h3>Headless output formatlari</h3>
<table>
  <thead><tr><th>Format</th><th>Foydalanish</th></tr></thead>
  <tbody>
    <tr><td><code>text</code></td><td>Oddiy matn (default)</td></tr>
    <tr><td><code>json</code></td><td>Tuzilmali javob \u2014 boshqa toollar bilan integratsiya uchun</td></tr>
    <tr><td><code>stream-json</code></td><td>Real-time stream \u2014 uzoq vazifalar uchun</td></tr>
  </tbody>
</table>
`
  },

  // ═══════════════════════════════════════
  // 11 — CONTEXT BOSHQARUVI
  // ═══════════════════════════════════════
  {
    id: 'context',
    num: '11',
    title: "Context Boshqaruvi",
    icon: '\uD83C\uDFAF',
    desc: "Context oynasi, compact va samarali strategiyalar",
    content: `
<h2>11. Context Boshqaruvi</h2>
<p>Claude Code'ning katta context oynasi bor. Uni samarali boshqarish \u2014 professional ishlashning kalitidir.</p>

<h3>Context oynasi qanday ishlaydi</h3>
<ul>
  <li><strong>Katta context oynasi</strong> \u2014 bir sessiyada ko'p fayllarni o'qib, tahlil qila oladi</li>
  <li>Har bir fayl o'qish, terminal natijasi, suhbat \u2014 barchasi context'ni to'ldiradi</li>
  <li>Context to'lganda Claude Code avtomatik eski ma'lumotlarni siqadi</li>
  <li><strong>/context</strong> buyrug'i bilan joriy band'likni ko'ring</li>
</ul>

<h3>Context strategiyalari</h3>
<table>
  <thead><tr><th>Strategiya</th><th>Qachon ishlatish</th></tr></thead>
  <tbody>
    <tr><td><code>/compact</code> \u2014 qo'lda siqish</td><td>~50% to'lganda, yangi vazifaga o'tishda</td></tr>
    <tr><td><code>@fayl</code> \u2014 aniq fayl ko'rsatish</td><td>Har doim! "Barcha fayllarni o'qi" demang</td></tr>
    <tr><td>Kichik vazifalar</td><td>Har doim! 1 vazifa = 1 sessiya</td></tr>
    <tr><td>Yangi sessiya</td><td>Vazifa butunlay o'zgarganda</td></tr>
  </tbody>
</table>

<h3>Context to'lib ketganda nima bo'ladi?</h3>
${tb('terminal \u2014 context boshqaruvi',
  comment('# 1. Joriy context holatini tekshiring:'),
  prompt('/context'),
  action('  Context: 142K / 200K (71%)'),
  gap(),
  comment('# 2. Agar ko\'p bo\'lsa \u2014 compact qiling:'),
  prompt('/compact'),
  success('  \u2713 Context siqildi: 142K -> 45K'),
  gap(),
  comment('# 3. Agar hali ko\'p bo\'lsa \u2014 yangi sessiya:'),
  comment('# Ctrl+C bilan chiqib, qayta boshlang.'),
  comment('# CLAUDE.md tufayli kontekst saqlanadi!')
)}

<h3>Eng katta xatolar</h3>
<ul>
  <li><strong>\u274C Butun papkani o'qitish</strong> \u2014 "src/ dagi barcha fayllarni o'qi" \u2014 context tezda to'ladi</li>
  <li><strong>\u274C /compact ni unutish</strong> \u2014 50% da ishlating, 80% gacha kutmang</li>
  <li><strong>\u274C Mega-prompt</strong> \u2014 "10 fayl yaratib, test yozib, deploy qil" \u2014 sifat pasayadi</li>
  <li><strong>\u2705 To'g'ri usul</strong> \u2014 aniq @fayl, kichik vazifa, muntazam /compact</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 12 — DEBUGGING VA XATOLAR
  // ═══════════════════════════════════════
  {
    id: 'debugging',
    num: '12',
    title: "Debugging va Xato Tuzatish",
    icon: '\uD83D\uDC1B',
    desc: "/doctor diagnostika, debug rejim, muammolar yechimi",
    content: `
<h2>12. Debugging va Xatolar Bilan Ishlash</h2>
<p>Claude Code bilan ishlaganda duch keladigan xatolar va ularni hal qilish yo'llari.</p>

<h3>/doctor \u2014 diagnostika</h3>
<p><code>/doctor</code> buyrug'i quyidagilarni tekshiradi:</p>
<ul>
  <li>O'rnatish turi va versiya</li>
  <li>Yangilanish mavjudligi</li>
  <li>Settings fayllarida xatolar</li>
  <li>MCP server konfiguratsiya muammolari</li>
  <li>Context ishlatilishi holati</li>
  <li>Plugin va agent yuklash xatolari</li>
</ul>

${tb('terminal \u2014 /doctor',
  prompt('/doctor'),
  success('  \u2713 Installation: native (v1.0.20)'),
  success('  \u2713 Authentication: OAuth (claude.ai)'),
  success('  \u2713 MCP servers: 2 connected'),
  warning('  \u26A0 Settings: 1 warning'),
  action('    .claude/settings.json: unknown key "customField"'),
  success('  \u2713 Context: 23K / 200K (11%)')
)}

<h3>Debug rejim</h3>
${tb('terminal \u2014 debug',
  comment('# To\'liq debug ma\'lumoti:'),
  prompt('claude --debug'),
  gap(),
  comment('# Faqat ma\'lum kategoriyalar:'),
  prompt('claude --debug "api,mcp"'),
  gap(),
  comment('# Ayrim kategoriyalarni chiqarib tashlash:'),
  prompt('claude --debug "!statsig,!file"'),
  gap(),
  comment('# Muhit o\'zgaruvchisi orqali ham mumkin:'),
  prompt('CLAUDE_DEBUG=1 claude')
)}

<h3>Ko'p uchraydigan muammolar</h3>
<table>
  <thead><tr><th>Muammo</th><th>Sabab</th><th>Yechim</th></tr></thead>
  <tbody>
    <tr><td>Context tezda to'ladi</td><td>Katta fayllar, ko'p o'qish</td><td><code>/compact</code>, aniq @fayl</td></tr>
    <tr><td>Claude noto'g'ri fayl o'zgartiradi</td><td>Noaniq prompt</td><td>Aniq fayl yo'li va pattern ko'rsating</td></tr>
    <tr><td>MCP server ulanmaydi</td><td>Konfiguratsiya xatosi</td><td><code>/doctor</code> va <code>/mcp</code> bilan tekshiring</td></tr>
    <tr><td>Hook ishlamaydi</td><td>JSON sintaksis xatosi</td><td>settings.json ni validatsiya qiling</td></tr>
    <tr><td>Test muvaffaqiyatsiz</td><td>Claude eski API ishlatgan</td><td>CLAUDE.md da versiyalarni aniq ko'rsating</td></tr>
    <tr><td>Sekin ishlaydi</td><td>Opus model, katta fayl</td><td>Sonnet/Haiku ga o'ting, kichik vazifalar</td></tr>
  </tbody>
</table>

<h3>Xatoni Claude'ga tuzattirish</h3>
${tb('terminal \u2014 xato tuzatish',
  comment('# Test muvaffaqiyatsiz bo\'lsa:'),
  prompt('npm test xato berdi. Xato logini ko\'rib tuzat.'),
  gap(),
  comment('# Build xatosi:'),
  prompt('mvn clean install muvaffaqiyatsiz. Xatoni ko\'rsat va tuzat.'),
  gap(),
  comment('# Stack trace bilan:'),
  prompt('Bu xato chiqdi: [xato matnini paste qiling]'),
  prompt('Sababini tushuntir va tuzat.')
)}
`
  },

  // ═══════════════════════════════════════
  // 13 — MULTI-FILE REFACTORING
  // ═══════════════════════════════════════
  {
    id: 'refactoring',
    num: '13',
    title: "Refactoring Strategiyalari",
    icon: '\uD83D\uDEE0\uFE0F',
    desc: "Ko'p faylda bir vaqtda o'zgartirish strategiyalari",
    content: `
<h2>13. Multi-file Refactoring</h2>
<p>Claude Code'ning eng kuchli tomoni \u2014 ko'p faylda bir vaqtda izchil o'zgartirish qilish. Bu yerda to'g'ri strategiya juda muhim.</p>

<h3>Kichik refactoring (2\u20135 fayl)</h3>
<p>Kichik o'zgarishlar uchun to'g'ridan-to'g'ri buyruq bering:</p>
${tb('claude \u2014 kichik refactoring',
  prompt('UserService, OrderService va ProductService dagi'),
  prompt('findById metodlarini Optional qaytaradigan qilib o\'zgartir.'),
  prompt('Har birida orElseThrow(NotFoundException::new) ishlat.'),
  prompt('Testlarni ham yangilab, ishga tushir.')
)}

<h3>Katta refactoring (5+ fayl)</h3>
<p>Katta o'zgarishlar uchun bosqichma-bosqich yondashuv:</p>
${tb('claude \u2014 katta refactoring strategiyasi',
  comment('# 1-qadam: Tahlil'),
  prompt('Loyihadagi barcha @Repository fayllarni toping'),
  prompt('va ularning hozirgi pattern\'ini tahlil qiling.'),
  gap(),
  comment('# 2-qadam: Bir faylda sinab ko\'ring'),
  prompt('UserRepository.java ni yangi pattern\'ga o\'tkazing.'),
  prompt('Test yozing va ishga tushiring.'),
  gap(),
  comment('# 3-qadam: Compact qiling'),
  prompt('/compact'),
  gap(),
  comment('# 4-qadam: Qolganlarini o\'tkazing'),
  prompt('UserRepository.java dagi yangi pattern\'ga qarab,'),
  prompt('OrderRepository va ProductRepository ni ham o\'zgartiring.'),
  gap(),
  comment('# 5-qadam: Barcha testlarni tekshiring'),
  prompt('mvn test ishga tushir va natijani ko\'rsat.')
)}

<h3>Refactoring strategiyalari</h3>
<table>
  <thead><tr><th>Holat</th><th>Strategiya</th></tr></thead>
  <tbody>
    <tr><td>Nom o'zgartirish (rename)</td><td>Bir buyruqda: "barcha joylarda UserDTO ni UserResponse ga almashtir"</td></tr>
    <tr><td>Pattern o'zgartirish</td><td>Avval 1 faylda sinab, keyin qolganlarini</td></tr>
    <tr><td>Arxitektura o'zgartirish</td><td>CLAUDE.md da yangi pattern yozing, keyin bosqichma-bosqich</td></tr>
    <tr><td>Dependency yangilash</td><td>"pom.xml dagi Spring Boot versiyani 3.3 ga yangilab, barcha deprecated API'larni tuzat"</td></tr>
  </tbody>
</table>

<h3>Muhim qoidalar</h3>
<ul>
  <li><strong>Har bosqichda commit qiling</strong> \u2014 xato bo'lsa orqaga qaytarish oson</li>
  <li><strong>/compact har 3\u20135 fayldan keyin</strong> \u2014 context toza bo'lsin</li>
  <li><strong>Testlarni har bosqichda ishga tushiring</strong> \u2014 regression'ni darhol aniqlang</li>
  <li><strong>Pattern faylini ko'rsating</strong> \u2014 "UserService.java uslubida" \u2014 izchillik kafolati</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 14 — IDE INTEGRATSIYA
  // ═══════════════════════════════════════
  {
    id: 'ide',
    num: '14',
    title: "IDE Integratsiya",
    icon: '\uD83D\uDDA5\uFE0F',
    desc: "VS Code, IntelliJ IDEA sozlash va xarajat nazorati",
    content: `
<h2>14. IDE Integratsiya va Xarajat Optimallashtirish</h2>
<p>VS Code va IntelliJ IDEA'da Claude Code'ni optimal ishlatish va token xarajatini nazorat qilish.</p>

<h3>VS Code ichidan</h3>
${tb('VS Code terminal',
  comment('# Terminal ochish: Ctrl+\`'),
  prompt('cd ./mening-loyiham && claude'),
  gap(),
  comment('# VS Code terminal shortcut sozlash:'),
  comment('# Settings > Terminal > Integrated > Shift+Enter'),
  comment('# Bu yangi qator qo\'shadi (yuborish emas)')
)}

<h3>IntelliJ IDEA ichidan</h3>
${tb('IntelliJ terminal',
  comment('# Alt+F12 bilan terminal ochish'),
  prompt('claude'),
  gap(),
  comment('# IntelliJ terminalida ham xuddi shunday ishlaydi.'),
  comment('# CLAUDE.md da IntelliJ-specific buyruqlar qo\'shing:'),
  plain('mvn spring-boot:run -Dspring-boot.run.profiles=dev')
)}

<h3>Xarajat Optimallashtirish</h3>
<table>
  <thead><tr><th>Vazifa turi</th><th>Model</th><th>Oylik xarajat (API)</th></tr></thead>
  <tbody>
    <tr><td>Individual dasturchi</td><td>Sonnet asosan</td><td>~$15\u201325</td></tr>
    <tr><td>Java katta refactoring</td><td>Opus + Sonnet aralash</td><td>~$50\u201380</td></tr>
    <tr><td>CI/CD PR review</td><td>Sonnet headless</td><td>~$20\u201330</td></tr>
    <tr><td>Pro obuna ($20 flat)</td><td>Haftalik limit ichida</td><td>$20</td></tr>
    <tr><td>Max 5x ($100 flat)</td><td>5x limit</td><td>$100</td></tr>
  </tbody>
</table>

<h3>Token tejash texnikalari</h3>
<ul>
  <li><strong>/compact qo'lda ~50% da</strong> \u2014 avtomatikni kutmang</li>
  <li><strong>Aniq @fayl referenslar</strong> \u2014 butun src/ emas, faqat kerakli fayl</li>
  <li><strong>Haiku'dan maksimal foydalaning</strong> \u2014 fayl o'qish, qidirishda</li>
  <li><strong>CI/CD'da Sonnet</strong> \u2014 Opus qimmat, Sonnet yetarli</li>
  <li><strong>/cost bilan nazorat</strong> \u2014 har sessiya oxirida xarajatni tekshiring</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 15 — JAMOAVIY ISH
  // ═══════════════════════════════════════
  {
    id: 'team',
    num: '15',
    title: "Jamoa Bilan Hamkorlik",
    icon: '\uD83D\uDC65',
    desc: "Umumiy sozlamalar, PR tekshiruv, yangi a'zo qo'shish",
    content: `
<h2>15. Jamoaviy Ish va Hamkorlik</h2>
<p>Claude Code jamoada ishlaganda ham kuchli. Shared konfiguratsiya orqali barcha a'zolar bir xil sifatda ishlaydi.</p>

<h3>Git'ga qo'shiladigan fayllar</h3>
<table>
  <thead><tr><th>Fayl</th><th>Vazifasi</th><th>Git'ga qo'shish</th></tr></thead>
  <tbody>
    <tr><td><code>CLAUDE.md</code></td><td>Loyiha konteksti va konventsiyalar</td><td><strong>Ha \u2713</strong></td></tr>
    <tr><td><code>.claude/rules/</code></td><td>Yo'l bo'yicha qoidalar</td><td><strong>Ha \u2713</strong></td></tr>
    <tr><td><code>.claude/skills/</code></td><td>Qayta foydalanish bilimlari</td><td><strong>Ha \u2713</strong></td></tr>
    <tr><td><code>.claude/agents/</code></td><td>Maxsus agentlar</td><td><strong>Ha \u2713</strong></td></tr>
    <tr><td><code>.claude/settings.json</code></td><td>Ruxsatlar, hooklar</td><td><strong>Ha \u2713</strong></td></tr>
    <tr><td><code>.mcp.json</code></td><td>MCP server konfiguratsiya</td><td><strong>Ha \u2713</strong> (tokenlar muhit o'zgaruvchisida)</td></tr>
  </tbody>
</table>

<h3>Jamoa CLAUDE.md misoli</h3>
${tb('CLAUDE.md \u2014 jamoa uchun',
  comment('# TaskManager \u2014 Jamoa Qoidalari'),
  plain('Java 21 + Spring Boot 3.2 + PostgreSQL 16'),
  plain('Frontend: Vue 3 + TypeScript 5.3 + Vite'),
  gap(),
  comment('## Buyruqlar'),
  plain('mvn spring-boot:run    # Backend'),
  plain('cd frontend && npm dev # Frontend'),
  plain('mvn test               # Barcha testlar'),
  gap(),
  comment('## Konventsiyalar (BARCHA JAMOA A\'ZOLARI UCHUN)'),
  plain('- Conventional Commits: feat|fix|refactor(scope): message'),
  plain('- Har endpoint uchun JUnit 5 test MAJBURIY'),
  plain('- Lombok: @Builder @Data @RequiredArgsConstructor'),
  plain('- API: ResponseEntity qaytarsin, global ExceptionHandler'),
  plain('- Frontend: Composition API, Pinia store, Zod validatsiya'),
  gap(),
  comment('## PR Qoidalari'),
  plain('- PR description yozilsin'),
  plain('- Kamida 1 ta review kerak'),
  plain('- CI testlar o\'tishi shart')
)}

<h3>PR Review Workflow</h3>
${tb('terminal \u2014 PR review',
  comment('# Jamoadosh PR ni Claude bilan review qilish:'),
  prompt('git diff main...feature-branch | \\'),
  prompt('  claude -p "Bu PR ni tekshir: \\'),
  prompt('    1. Konventsiyalarga moslik \\'),
  prompt('    2. Xavfsizlik muammolari \\'),
  prompt('    3. Test coverage \\'),
  prompt('    4. Performance"')
)}

<h3>Yangi jamoa a'zosi uchun onboarding</h3>
<ul>
  <li><strong>1.</strong> Repo'ni clone qiling \u2014 CLAUDE.md, rules, skills avtomatik keladi</li>
  <li><strong>2.</strong> <code>claude</code> ishga tushiring \u2014 loyiha konteksti avtomatik yuklanadi</li>
  <li><strong>3.</strong> <code>/init</code> \u2014 yangi a'zo uchun qo'shimcha kontekst yaratadi</li>
  <li><strong>4.</strong> Loyiha konventsiyalari haqida so'rang \u2014 Claude CLAUDE.md dan javob beradi</li>
</ul>
`
  },

  // ═══════════════════════════════════════
  // 16 — REAL LOYIHA
  // ═══════════════════════════════════════
  {
    id: 'real-loyiha',
    num: '16',
    title: "Amaliy Loyiha: Spring + Vue",
    icon: '\uD83C\uDFD7\uFE0F',
    desc: "Spring Boot + Vue 3 \u2014 noldan to'liq loyiha yaratish",
    content: `
<h2>16. Real Loyiha: Java Spring + PostgreSQL + Vue 3 + TypeScript</h2>
<p>Noldan to'liq full-stack loyiha \u2014 bosqichma-bosqich, har birida terminal ko'rinishi bilan.</p>

<h3>Loyiha: TaskManager</h3>
<table>
  <thead><tr><th>Stack</th><th>Texnologiya</th></tr></thead>
  <tbody>
    <tr><td>Backend</td><td>Java 21 + Spring Boot 3.2 + Spring Security + PostgreSQL</td></tr>
    <tr><td>Frontend</td><td>Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS</td></tr>
    <tr><td>Auth</td><td>JWT token autentifikatsiya</td></tr>
    <tr><td>Tests</td><td>JUnit 5 (34 test) + Vitest (20 test)</td></tr>
    <tr><td>Deploy</td><td>Docker Compose</td></tr>
  </tbody>
</table>

<h3>Qadam 1: /init</h3>
${tb('claude \u2014 /init natijasi',
  prompt('/init'),
  action('Scanning project structure...'),
  action('Found: backend/ (Java 21, Spring Boot 3.2)'),
  action('Found: frontend/ (Vue 3, TypeScript, Vite)'),
  success('\u2713 CLAUDE.md created (42 lines)'),
  plain('Edit it to add your conventions and patterns.')
)}

<h3>Qadam 2: CLAUDE.md sozlash</h3>
${tb('claude \u2014 CLAUDE.md tahrirlash',
  prompt('/memory'),
  comment('# CLAUDE.md ochiladi, quyidagilarni qo\'shing:'),
  plain('- UserService.java uslubiga amal qil'),
  plain('- Lombok @Builder, @Data majburiy'),
  plain('- Har endpoint uchun JUnit 5 test'),
  success('\u2713 CLAUDE.md yangilandi')
)}

<h3>Qadam 3\u20135: CRUD + Entity + Repository</h3>
${tb('claude \u2014 backend yaratish',
  prompt('Task entity yarat: id, title, description, status,'),
  prompt('createdAt, userId. JPA annotatsiyalar bilan.'),
  prompt('TaskRepository, TaskService, TaskController ham kerak.'),
  prompt('UserService.java uslubida yoz.'),
  success('\u2713 6 fayl yaratildi | Tests: 8/8 passed')
)}

<h3>Qadam 6: JWT Auth</h3>
${tb('claude \u2014 JWT plan',
  plain('  REJA (7 qadam):'),
  plain('  1. model/User.java  \u2014 UserDetails impl'),
  plain('  2. repository/UserRepository.java'),
  plain('  3. service/JwtService.java'),
  plain('  4. service/AuthService.java'),
  plain('  5. controller/AuthController.java'),
  plain('  6. config/SecurityConfig.java'),
  plain('  7. filter/JwtAuthFilter.java'),
  success('  \u2713 8 fayl yaratildi | Tests: 12/12 passed')
)}

<h3>Qadam 7\u201310: Frontend + Docker</h3>
${tb('claude \u2014 frontend va deploy',
  prompt('Vue 3 frontend yarat: Login, TaskList, TaskForm.'),
  prompt('Pinia store, axios interceptor, JWT token saqlash.'),
  success('\u2713 Frontend: 12 komponent | Vitest: 20/20 passed'),
  gap(),
  prompt('Docker Compose yoz: backend, frontend, postgres.'),
  success('\u2713 docker-compose.yml yaratildi'),
  prompt('docker compose up'),
  success('\u2713 Barcha servislar ishga tushdi!')
)}

<h3>Vaqt taqqoslash</h3>
<table>
  <thead><tr><th>Bosqich</th><th>Qo'lda</th><th>Claude Code bilan</th></tr></thead>
  <tbody>
    <tr><td>Loyiha tuzilmasi</td><td>1\u20132 soat</td><td><strong>15 daqiqa</strong></td></tr>
    <tr><td>CRUD + Entity</td><td>2\u20133 soat</td><td><strong>20 daqiqa</strong></td></tr>
    <tr><td>JWT autentifikatsiya</td><td>3\u20134 soat</td><td><strong>30 daqiqa</strong></td></tr>
    <tr><td>Frontend</td><td>4\u20135 soat</td><td><strong>40 daqiqa</strong></td></tr>
    <tr><td>54 ta test</td><td>3\u20134 soat</td><td><strong>20 daqiqa</strong></td></tr>
    <tr><td>Docker</td><td>1\u20132 soat</td><td><strong>10 daqiqa</strong></td></tr>
    <tr><td><strong>JAMI</strong></td><td><strong>~16 soat</strong></td><td><strong>~2.5 soat (6x tezroq)</strong></td></tr>
  </tbody>
</table>
`
  },

  // ═══════════════════════════════════════
  // 17 — TOOL TAQQOSLASH
  // ═══════════════════════════════════════
  {
    id: 'taqqoslash',
    num: '17',
    title: "Tool Taqqoslash",
    icon: '\u2696\uFE0F',
    desc: "Claude Code vs Cursor vs Antigravity \u2014 qaysi birini tanlash",
    content: `
<h2>17. Claude Code vs Cursor vs Antigravity</h2>
<p>Uchala tool ham Claude modelini ishlatishi mumkin. Lekin natija tubdan farqli \u2014 model emas, uni <strong>qanday ishlatish</strong> muhim.</p>

<h3>SWE-bench Verified \u2014 Benchmark Taqqoslash</h3>
<table>
  <thead><tr><th>Tool</th><th>Model</th><th>SWE-bench</th><th>Token sarfi</th><th>Narx/oy</th></tr></thead>
  <tbody>
    <tr><td><strong>Claude Code</strong></td><td>Opus</td><td><strong>~72\u201381% \u2605</strong></td><td>Tejamkor (1x)</td><td>$20\u2013200</td></tr>
    <tr><td><strong>Cursor + Claude</strong></td><td>Opus</td><td>Past (~5\u201310% kam)</td><td>~5x ko'proq</td><td>$20\u2013200</td></tr>
    <tr><td><strong>Antigravity</strong></td><td>Gemini</td><td>Raqobatbardosh</td><td>O'rtacha</td><td>Bepul (preview)</td></tr>
  </tbody>
</table>
<p><strong>Eslatma:</strong> Aniq raqamlar benchmark versiyasi va sanalarga qarab o'zgaradi. Muhimi \u2014 bir xil model bilan ham Claude Code sezilarli samaraliroq ishlaydi.</p>

<h3>Nima uchun bir xil model bilan farq bor?</h3>
${tb('Bir xil vazifa \u2014 farqli natija',
  comment('# Bir xil vazifa: "Auth qo\'sh" \u2014 bir xil model'),
  gap(),
  comment('# Cursor (Claude Opus):'),
  error('  Token: ~180K  |  Ortiqcha context  |  Ko\'proq xato'),
  gap(),
  comment('# Claude Code (Claude Opus):'),
  success('  Token: ~33K   |  Optimal context   |  Kam xato'),
  gap(),
  plain('  ~5x tejamkor \u2014 chunki Claude Code model uchun'),
  plain('  maxsus optimizatsiya qilingan (Anthropic o\'zi yaratgan).')
)}
<p><strong>Sababi:</strong> Claude Code \u2014 Anthropic tomonidan yaratilgan, model bilan <strong>optimal muloqot</strong> qiladi. Boshqa toollar modelni "orqali" ishlatadi \u2014 ortiqcha context, takroriy so'rovlar.</p>

<h3>Qaysi birini tanlash?</h3>
<table>
  <thead><tr><th>Vazifa / Holat</th><th>Tavsiya</th></tr></thead>
  <tbody>
    <tr><td>Murakkab bug, arxitektura</td><td><strong>Claude Code (Opus)</strong></td></tr>
    <tr><td>Katta codebase refactoring</td><td><strong>Claude Code (Opus)</strong></td></tr>
    <tr><td>Kunlik yangi feature, tez iteratsiya</td><td><strong>Cursor</strong></td></tr>
    <tr><td>Tab autocomplete muhim</td><td><strong>Cursor</strong></td></tr>
    <tr><td>Bepul sinab ko'rish</td><td><strong>Antigravity</strong></td></tr>
    <tr><td>CI/CD, GitHub Actions</td><td><strong>Claude Code (headless)</strong></td></tr>
    <tr><td>Java Spring murakkab loyiha</td><td><strong>Claude Code (Opus)</strong></td></tr>
    <tr><td>Vue 3 / React tezkor prototip</td><td><strong>Cursor</strong></td></tr>
  </tbody>
</table>

<h3>Optimal stack ($40/oy)</h3>
<ul>
  <li><strong>Cursor Pro ($20/oy)</strong> \u2014 kunlik asosiy tool: tab autocomplete, tezkor edit, visual UI</li>
  <li><strong>Claude Code Pro ($20/oy)</strong> \u2014 og'ir muammolar: bug tuzatish, CI/CD, katta context, multi-file refactoring</li>
  <li><strong>Antigravity (bepul)</strong> \u2014 eksperimental sinov, parallel agent</li>
</ul>

<h3>Xulosa</h3>
<p>Hech qaysi tool "eng yaxshi" emas \u2014 har birining o'z kuchli tomoni bor. Professional dasturchi <strong>hammmasini birgalikda</strong> ishlatadi: Cursor kunlik ish uchun, Claude Code murakkab vazifalar uchun, Antigravity sinov uchun.</p>
`
  },
]

export const stats = [
  { value: '17',    label: "Bo'lim" },
  { value: '3000+', label: 'Paragraf' },
  { value: '3',     label: 'Dasturlash tili' },
  { value: '50+',   label: 'Kod misoli' },
]
