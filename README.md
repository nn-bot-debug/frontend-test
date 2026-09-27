# Інструкція запуску

Три завдання лежать в окремих каталогах: `task-1`, `task-2`, `task-3`.

## Завдання 1. Елемент списку на позиції [2n/3] − 1

Каталог: `task-1`.  
Мова: Java 21. Збірка: Maven.

Потрібно: JDK 21 і Maven.

```powershell
cd task-1
mvn compile
```

Клас `ua.kazmirchuk.TwoThirdsOfLinkedList` і метод `getTwoThirdsNode` знаходяться у файлі `src/main/java/ua/kazmirchuk/TwoThirdsOfLinkedList.java`. Окремої точки входу `main` у проєкті немає: команда вище збирає класи. Виклик методу зручно перевірити з IDE (у каталозі вже є конфігурація IntelliJ IDEA).

## Завдання 2. Студенти і дисципліни

Каталог: `task-2`.  
Файл: `db.sql`. Діалект: PostgreSQL.

Потрібно: PostgreSQL і клієнт `psql` (або pgAdmin).

З кореня репозиторію:

```powershell
psql -U postgres -f task-2/db.sql
```

Скрипт створює таблиці `Students`, `Disciplines` і `Student_Disciplines`, а потім виконує вибірку ПІБ та email студентів 5-ї групи дисципліни «Програмування». Поки в таблицях немає відповідних рядків, вибірка поверне порожній результат.

## Завдання 3. Вебзастосунок цитат

Каталог: `task-3`.  
Бекенд: Docker Compose (`task-3/quotes`).  
Фронтенд: React, TypeScript, Vite (`task-3/quotes-front`).

Потрібно: Docker Desktop, Node.js і npm. Спочатку піднімається бекенд, потім фронтенд.

### Бекенд

```powershell
cd task-3/quotes
docker compose up --pull=always
```

- API: [http://localhost:8080](http://localhost:8080)
- Swagger: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- PostgreSQL на `127.0.0.1:5432`, база `quotes_db`, користувач `postgres`, пароль `root`

Зупинка: `Ctrl+C`, потім `docker compose down` у тому ж каталозі.

### Фронтенд

У другому терміналі:

```powershell
cd task-3/quotes-front
npm install
npm run dev
```

Відкрийте адресу, яку Vite виведе в терміналі (зазвичай [http://localhost:5173](http://localhost:5173)). Запити на `/quotes` проксуються на бекенд `http://127.0.0.1:8080`, тому бекенд має бути запущений.