# pg-plv-demo


## Steps to Run Server

### 0. install `bun` if not yet installed

```bash
npm i -g bun
```

### 1. Install dependencies:

```bash
bun install --frozen-lockfile
```

### 2. Generate SQL Scripts

```bash
./index.ts --init
```

### 3. Run the server:

Using docker compose:

```bash
docker compose -f docker-compose.yml up
```

## Public Demo Server

The public demo server is available at [https://plv8-demo.mustosoft.io/](https://plv8-demo.mustosoft.io/) (mind the HTTPS protocol!).

<details>

<summary> Examples: </summary>

### Get All Books

```bash
curl -sL http://plv8-demo.mustosoft.io/books | jq
```

### Get All Authors

```bash
curl -sL http://plv8-demo.mustosoft.io/authors | jq
```

### Create Author

```bash
curl -sLX POST \
 -d '{"name": "mustosoft","bio": "the author"}' \
 http://plv8-demo.mustosoft.io/author | jq
```

### Create Books

```bash
curl -sLX POST \
 -d \
'['\
'  {"title":"PostgreSQL: a Not Only DBMS","author":1,"description":"lol","isbn":1234567890123},'\
'  {"title":"PLV8: Make PostgreSQL Great Again","author":1,"description":"lol again","isbn":1234567890123}'\
']' \
 http://plv8-demo.mustosoft.io/books | jq
```

</details>

---

This project was created using `bun init` in bun v1.1.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
