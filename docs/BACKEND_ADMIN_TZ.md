# Техническое задание: универсальный бэкенд-админка для лендингов

> Цель: воспроизвести модель «лендинг + админка через query-параметр» (как у проекта ГОСАШ) на любом другом лендинге poehali.dev.
> Стек: Vite + React + TypeScript (фронт), Python 3.11 Cloud Functions (бэк), PostgreSQL, S3.

---

## 1. Назначение системы

Универсальная админ-панель для лендинга, позволяющая:

1. Управлять контентом всех секций лендинга без правки кода.
2. Принимать и обрабатывать заявки клиентов.
3. Скрывать/показывать целые секции.
4. Загружать изображения через единый интерфейс (в S3).
5. Изменять SEO и брендинг (логотип, фон, цвета, контакты).
6. Работать в обход публичных роутов: админка открывается по `?cp` без отдельного URL.

---

## 2. Архитектура

```
[Браузер]
    │
    ├── Лендинг (React)       — публичные actions (без авторизации)
    │       └── usePublicList / usePublicSettings
    │
    └── Админка (React, ?cp)  — приватные actions (X-Admin-Token)
            └── api(action, method, body, token)
                    │
                    ▼
    [Cloud Function: admin-api (Python)]
            ├── Маршрутизация через ?action=
            ├── Авторизация по SHA-256 токену
            ├── psycopg2 → PostgreSQL
            └── boto3 → S3 (cdn.poehali.dev)
```

**Принципы:**
- Один Cloud Function на всю админку (`/backend/admin-api/index.py`).
- Все CRUD-операции маршрутизируются по `?action=<имя>` и HTTP-методу.
- Параллельно работают «публичные» actions с префиксом `public-` (без авторизации, только GET).
- Авторизация — Bearer-подобный токен в заголовке `X-Admin-Token` (Cloud Provider фильтрует Authorization).
- Лендинг и админка используют один и тот же фронт-проект.

---

## 3. Структура БД

Префикс таблиц: `{project}_` (например `gosash_`). В этом ТЗ — `app_`.

### 3.1 Контентные таблицы (CRUD)

#### `app_settings` — пары ключ-значение
```sql
CREATE TABLE app_settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```
Хранит SEO, контакты, заголовки секций, URL логотипа/фона, флаги видимости блоков (`block_<id>` = `"true"`/`"false"`).

#### `app_tariffs` — тарифы/услуги/товары
```sql
CREATE TABLE app_tariffs (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    subtitle     TEXT DEFAULT '',
    price        INTEGER NOT NULL DEFAULT 0,
    old_price    INTEGER,
    badge        TEXT,
    color        TEXT DEFAULT '',
    featured     BOOLEAN DEFAULT FALSE,
    features     JSONB DEFAULT '[]'::jsonb,
    restrictions JSONB DEFAULT '[]'::jsonb,
    bonuses      JSONB DEFAULT '[]'::jsonb,
    cta_label    TEXT DEFAULT 'Заказать',
    active       BOOLEAN DEFAULT TRUE,
    sort_order   INTEGER DEFAULT 0,
    updated_at   TIMESTAMP DEFAULT NOW()
);
```

#### `app_promos` — акции/баннеры
```sql
CREATE TABLE app_promos (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    subtitle    TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image_url   TEXT DEFAULT '',
    badge       TEXT DEFAULT '',
    link_url    TEXT DEFAULT '',
    active      BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

#### `app_branches` — точки/филиалы/локации
```sql
CREATE TABLE app_branches (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    addr       TEXT NOT NULL,
    rating     NUMERIC(3,1) DEFAULT 5.0,
    map_url    TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

#### `app_team` — команда/сотрудники/инструкторы
```sql
CREATE TABLE app_team (
    id             SERIAL PRIMARY KEY,
    name           TEXT NOT NULL,
    role           TEXT DEFAULT '',
    experience     TEXT DEFAULT '',
    specialization TEXT DEFAULT '',
    photo_url      TEXT DEFAULT '',
    is_top         BOOLEAN DEFAULT FALSE,
    active         BOOLEAN DEFAULT TRUE,
    sort_order     INTEGER DEFAULT 0
);
```

#### `app_reviews` — отзывы
```sql
CREATE TABLE app_reviews (
    id         SERIAL PRIMARY KEY,
    author     TEXT NOT NULL,
    text       TEXT NOT NULL,
    rating     INTEGER DEFAULT 5,
    photo_url  TEXT DEFAULT '',
    source     TEXT DEFAULT '',
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### `app_faq` — вопрос-ответ
```sql
CREATE TABLE app_faq (
    id         SERIAL PRIMARY KEY,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

#### `app_stats` — цифры/показатели
```sql
CREATE TABLE app_stats (
    id         SERIAL PRIMARY KEY,
    value      TEXT NOT NULL,
    label      TEXT NOT NULL,
    icon       TEXT DEFAULT 'Star',
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

#### `app_finance` — блоки с параметрами (рассрочка/кредит/тарифы услуг)
```sql
CREATE TABLE app_finance (
    id         SERIAL PRIMARY KEY,
    title      TEXT NOT NULL,
    subtitle   TEXT DEFAULT '',
    icon       TEXT DEFAULT 'Percent',
    rows       JSONB DEFAULT '[]'::jsonb,  -- [["ключ","значение"], ...]
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

#### `app_marquee` — бегущая строка
```sql
CREATE TABLE app_marquee (
    id         SERIAL PRIMARY KEY,
    label      TEXT NOT NULL,
    shape      TEXT DEFAULT 'circle',
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

#### `app_hero_features` — буллеты под главным заголовком
```sql
CREATE TABLE app_hero_features (
    id         SERIAL PRIMARY KEY,
    label      TEXT NOT NULL,
    icon       TEXT DEFAULT 'Check',
    active     BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);
```

### 3.2 Системные таблицы

#### `app_leads` — заявки
```sql
CREATE TABLE app_leads (
    id         SERIAL PRIMARY KEY,
    name       TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    email      TEXT DEFAULT '',
    tariff     TEXT DEFAULT '',
    promo      TEXT DEFAULT '',
    source     TEXT DEFAULT '',
    note       TEXT DEFAULT '',
    utm_source TEXT DEFAULT '',
    utm_medium TEXT DEFAULT '',
    utm_campaign TEXT DEFAULT '',
    status     TEXT DEFAULT 'new',  -- new / contacted / done / cancelled
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_leads_created_at ON app_leads(created_at DESC);
CREATE INDEX idx_leads_status ON app_leads(status);
```

### 3.3 Сидинг

Миграция должна включать `INSERT ... ON CONFLICT DO NOTHING` для всех `settings`-ключей и стандартных значений (заголовки секций, цвета, дефолтный логотип) — чтобы лендинг сразу работал.

---

## 4. Бэкенд: спецификация API

### 4.1 Общие требования

**Файл:** `/backend/admin-api/index.py`
**Entry point:** `def handler(event: dict, context) -> dict`
**Маршрутизация:** `?action=<name>` + `httpMethod`.

**Обязательно:**
- Обработка `OPTIONS` (CORS preflight) в первой же строке.
- CORS-заголовки во всех ответах (`Access-Control-Allow-Origin: *`).
- Нормализация action: `action.lstrip("/").strip()` — допустить ведущий слэш.
- Безопасный JSON-парсинг тела (`try/except`, fallback на `parse_qs`).
- Все DELETE принимают `id` как из body, так и из `queryStringParameters`.
- `psycopg2` строго в режиме Simple Query Protocol (без `%s` placeholder'ов кроме как через `cur.execute(sql, tuple)` — это допустимо, не путать с asyncpg).

### 4.2 CORS

```python
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
}
```

### 4.3 Авторизация

- Логин/пароль захардкожены в коде (для MVP) или вынесены в секреты.
- Хэш токена: `SHA-256(login + ":" + SHA-256(password))`.
- Заголовок: `X-Admin-Token` (НЕ `Authorization` — он фильтруется провайдером).
- В `check_auth` читать и `headers["X-Admin-Token"]`, и `headers["x-admin-token"]` (регистр может меняться).

### 4.4 Карта endpoints

#### Публичные (без авторизации, только GET)

| Action | Назначение |
|--------|------------|
| `public-tariffs` | Только `active=TRUE`, упрощённый список колонок |
| `public-promos` | Активные акции |
| `public-branches` | Активные точки |
| `public-team` | Активная команда |
| `public-reviews` | Активные отзывы |
| `public-faq` | Активные вопросы |
| `public-stats` | Активная статистика |
| `public-finance` | Активные блоки |
| `public-marquee` | Активная бегущая строка |
| `public-hero-features` | Активные буллеты |
| `public-settings` | Полная карта `key→value` |

#### Публичный POST для приёма заявок

| Action | Метод | Поля body |
|--------|-------|-----------|
| `lead` | POST | `name, phone, email?, tariff?, promo?, source?, note?, utm_*?` |

#### Авторизация

| Action | Метод | Body |
|--------|-------|------|
| `login` | POST | `{login, password}` → `{token, ok}` |

#### Приватные CRUD (требуют `X-Admin-Token`)

Для каждого ресурса — единый набор:

| Метод | Поведение |
|-------|-----------|
| `GET` | Полный список с пагинацией не требуется (лимит 500). |
| `POST` | Создание, возвращает `{ok, id}`. |
| `PUT` | Обновление, требует `id` в body. |
| `DELETE` | Удаление по `id` из body или query. |

**Ресурсы (action):**
`settings, tariffs, promos, branches, team, reviews, faq, stats, finance, marquee, hero-features, leads, upload`

Особенности:
- `settings` POST принимает `{data: {key: value, ...}}` и делает UPSERT по `key`.
- `leads` поддерживает только GET/PUT (статус, заметка)/DELETE. POST для лидов — публичный `lead`.
- `upload` POST: `{image: base64, filename}` → `{url}`.

### 4.5 Загрузка файлов

```python
def upload_image(b64_data: str, filename: str) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    key = f"admin/{uuid.uuid4()}.{ext}"
    s3.put_object(Bucket="files", Key=key, Body=base64.b64decode(b64_data),
                  ContentType=f"image/{ext}" if ext != "jpg" else "image/jpeg")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
```

### 4.6 tests.json (обязательно)

Минимум 10 тестов: OPTIONS, неавторизованный доступ, все `public-*` actions, нормализация слэша, неизвестный action.

```json
{
  "tests": [
    {"name": "OPTIONS preflight", "method": "OPTIONS", "path": "/", "expectedStatus": 200, "expectedBody": "", "bodyMatcher": "partial"},
    {"name": "unauthorized", "method": "GET", "path": "/?action=tariffs", "expectedStatus": 401, "bodyMatcher": "partial"},
    {"name": "public tariffs", "method": "GET", "path": "/?action=public-tariffs", "expectedStatus": 200, "bodyMatcher": "partial"}
  ]
}
```

---

## 5. Фронтенд: спецификация

### 5.1 Структура папок

```
/src
├── pages/
│   ├── Index.tsx           — публичный лендинг
│   └── Admin.tsx           — корень админки
├── components/
│   ├── admin/
│   │   ├── adminApi.ts             — fetch-обёртка, useToast, useImageUpload, useAdminList
│   │   ├── AdminUi.tsx             — LoginForm, Field, SaveBtn, Toast, ImageUpload, DiagModal
│   │   ├── AdminCrudTabs.tsx       — реэкспорт типов + табов
│   │   ├── AdminSettingsTabs.tsx   — SettingsTab + BlocksTab
│   │   ├── AdminTariffsTab.tsx
│   │   ├── AdminPromosTab.tsx
│   │   ├── AdminBranchesTab.tsx
│   │   ├── AdminTeamTab.tsx
│   │   ├── AdminReviewsTab.tsx
│   │   ├── AdminFaqTab.tsx
│   │   ├── AdminStatsTab.tsx
│   │   ├── AdminFinanceTab.tsx
│   │   ├── AdminListTabs.tsx       — общий компонент простых списков (marquee, hero-features)
│   │   └── AdminLeadsTab.tsx
│   └── landing/
│       ├── shared/
│       │   ├── publicApi.ts        — fetchPublic, usePublicList, usePublicSettings
│       │   ├── LeadForm.tsx
│       │   └── analytics.ts
│       ├── HeroSection.tsx
│       ├── TariffsSection.tsx
│       └── ... (по числу секций)
```

### 5.2 Точка входа `App.tsx`

```tsx
const isAdmin = new URLSearchParams(window.location.search).has("cp");
// ...
{isAdmin ? <Admin /> : <BrowserRouter>...</BrowserRouter>}
```

Админка открывается по `https://site.ru/?cp`. Никаких отдельных роутов, никакого SSR.

### 5.3 `adminApi.ts` — обязательные утилиты

```ts
export const ADMIN_API = "https://functions.poehali.dev/<id>";

export function api(action: string, method = "GET", body?: unknown, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Admin-Token"] = token;
  const cleanAction = action.replace(/^\/+/, "");
  return fetch(`${ADMIN_API}?action=${cleanAction}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export function useAdminList<T>(action: string, token: string) { /* useEffect + refresh */ }
export function useImageUpload(token: string, onChange: (url: string) => void) { /* ... */ }
export function useToast() { /* ... */ }
```

**Критично:** загрузка данных в вкладках — ВСЕГДА через `useEffect`, никогда через `useState(() => loader())`.

### 5.4 `publicApi.ts` — для лендинга

```ts
export function usePublicList<T>(action: string): { items: T[] | null; loading: boolean };
export function usePublicSettings(): { settings: Record<string, string>; loading: boolean };
```

### 5.5 Принцип fallback на лендинге

Каждая секция:
1. Грузит данные из БД через `usePublicList(...)`.
2. Если `items` пустой или `null` — рендерит хардкод-fallback (массив прямо в файле).
3. Проверяет `settings.block_<id> === "false"` — если да, секция не отображается.
4. Заголовок секции берёт из `settings.<section>_title` с фолбэком.

Это даёт:
- Лендинг работает даже без БД.
- Постепенное наполнение без поломок.
- Возможность скрыть секцию без удаления данных.

### 5.6 Админка — UI/UX

- Sidebar 256px (на десктопе), drawer на мобильных.
- Топ-бар с заголовком активного раздела.
- Все формы: модалка с `position: fixed`, overflow-y: auto.
- Toast в правом нижнем углу, исчезает через 3 сек.
- Кнопка «Выйти» — очищает `localStorage.gosash_admin_token` (или аналог).
- Кнопка «Открыть сайт» в сайдбаре.
- Раздел «Заявки» — первый по умолчанию.

### 5.7 Авторизация на фронте

- `LoginForm` с диагностическим модальным окном (логи запроса для дебага).
- Токен сохраняется в `localStorage`.
- При логауте — удаляется + перерендер.

---

## 6. Чек-лист переноса на новый лендинг

1. **Скопировать** `/backend/admin-api/` целиком, переименовать таблицы (`gosash_*` → `<project>_*`).
2. **Применить миграцию** через `migrate_db` (все таблицы + сидинг настроек).
3. **Заменить логин/пароль** в `ADMIN_LOGIN` / `ADMIN_PASSWORD_HASH`.
4. **Скопировать** `/src/components/admin/` и `/src/components/landing/shared/publicApi.ts`.
5. **Заменить `ADMIN_API`** на URL новой функции (из `func2url.json` после `sync_backend`).
6. **Скопировать** `Admin.tsx` и `App.tsx` с проверкой `?cp`.
7. **В каждой секции лендинга:**
   - Импортировать `usePublicList` / `usePublicSettings`.
   - Сохранить старый хардкод как `FALLBACK_*`.
   - Подключить к БД с проверкой `block_*`.
8. **Запустить `sync_backend`** — все тесты должны пройти.
9. **Открыть `?cp`** и проверить логин.
10. **Заполнить настройки и контент** через админку.

---

## 7. Стандарты безопасности

- Никогда не возвращать пароль/хэш в ответе.
- Все мутации — только с `X-Admin-Token`.
- Лиды — единственный публичный POST. Защищать в будущем капчей/rate-limit.
- При логировании ошибок — не выводить значения `os.environ`.
- Не сохранять в БД raw HTML с пользовательского input без санитизации.

---

## 8. Расширение системы

Чтобы добавить новый тип контента (например `app_team`):

1. Создать миграцию с таблицей и сидингом.
2. Добавить ветку `if action == "team":` в `handler` (по шаблону существующих).
3. Добавить публичную ветку `public-team` в `public_map`.
4. Добавить тест в `tests.json` для GET `public-team`.
5. Создать `AdminTeamTab.tsx` по шаблону `AdminBranchesTab.tsx`.
6. Зарегистрировать вкладку в `TABS` массиве `Admin.tsx`.
7. На лендинге — создать секцию с `usePublicList<TeamMember>("public-team")` и fallback.
8. Запустить `sync_backend`.

---

## 9. Известные грабли (которых нужно избегать)

| Проблема | Решение |
|----------|---------|
| `useState(() => load())` не перезагружает данные | Использовать `useEffect` |
| `api("/tariffs")` со слэшем не матчится с `action == "tariffs"` | Нормализовать `lstrip("/")` на бэке + `replace(/^\/+/, "")` на фронте |
| Имена колонок в админке не совпадают с БД | Один источник правды: типы в `AdminCrudTabs.tsx` точно соответствуют БД |
| `SCHEMA = "public"` хардкодом | Не указывать схему в SQL — Postgres использует `search_path` соединения |
| Authorization-заголовок не доходит до бэка | Использовать `X-Admin-Token` |
| jsonb-поля приходят как массив, а сохраняются как строка | Сериализовать через `json.dumps(..., ensure_ascii=False)` перед `cur.execute` |
| Заявки с разных форм не попадают в админку | Все формы должны дублировать POST в `?action=lead` |

---

## 10. Результат внедрения

После выполнения ТЗ заказчик получает:
- Лендинг, в котором редактируется ВСЁ — без программиста.
- Журнал заявок с фильтрацией по статусу.
- Возможность за 10 минут скрыть/показать любую секцию.
- Загрузку фото в один клик с автоматической раздачей через CDN.
- Базу, готовую к дополнительным интеграциям (CRM, email, Telegram).
