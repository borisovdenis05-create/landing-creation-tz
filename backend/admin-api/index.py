"""
Административный API для лендинга ГОСАШ.
Поддерживает: авторизацию, управление настройками, тарифами, филиалами, инструкторами, отзывами, загрузку фото.
"""
import json
import os
import hashlib
import base64
import uuid
import psycopg2
import boto3
from psycopg2.extras import RealDictCursor

ADMIN_LOGIN = "gosash_admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("Gosash2024!".encode()).hexdigest()
SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
}

def get_db():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.autocommit = False
    return conn

def json_response(data, status=200):
    return {
        "statusCode": status,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }

def error(msg, status=400):
    return json_response({"error": msg}, status)

def check_auth(event):
    token = event.get("headers", {}).get("X-Admin-Token", "")
    expected = hashlib.sha256(f"{ADMIN_LOGIN}:{ADMIN_PASSWORD_HASH}".encode()).hexdigest()
    return token == expected

def upload_image(b64_data: str, filename: str) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    key = f"admin/{uuid.uuid4()}.{ext}"
    content_type = f"image/{ext}" if ext != "jpg" else "image/jpeg"
    img_bytes = base64.b64decode(b64_data)
    s3.put_object(Bucket="files", Key=key, Body=img_bytes, ContentType=content_type)
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return cdn_url

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            body = {}

    # ── AUTH ──────────────────────────────────────────────────────────────────
    if path.endswith("/login"):
        login = body.get("login", "")
        password = body.get("password", "")
        pw_hash = hashlib.sha256(password.encode()).hexdigest()
        if login == ADMIN_LOGIN and pw_hash == ADMIN_PASSWORD_HASH:
            token = hashlib.sha256(f"{ADMIN_LOGIN}:{ADMIN_PASSWORD_HASH}".encode()).hexdigest()
            return json_response({"token": token, "ok": True})
        return error("Неверный логин или пароль", 401)

    # ── Все остальные маршруты требуют авторизации ──────────────────────────
    if not check_auth(event):
        return error("Не авторизован", 401)

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # ── UPLOAD IMAGE ──────────────────────────────────────────────────────
        if path.endswith("/upload"):
            img_b64 = body.get("image", "")
            filename = body.get("filename", "photo.jpg")
            url = upload_image(img_b64, filename)
            return json_response({"url": url})

        # ── SETTINGS ──────────────────────────────────────────────────────────
        if "/settings" in path:
            if method == "GET":
                cur.execute(f"SELECT key, value FROM {SCHEMA}.gosash_settings ORDER BY key")
                rows = cur.fetchall()
                result = {r["key"]: r["value"] for r in rows}
                return json_response(result)
            if method == "POST":
                data = body.get("data", {})
                for k, v in data.items():
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.gosash_settings (key, value, updated_at) VALUES (%s, %s, NOW()) "
                        "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                        (k, str(v))
                    )
                conn.commit()
                return json_response({"ok": True})

        # ── TARIFFS ───────────────────────────────────────────────────────────
        if "/tariffs" in path:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.gosash_tariffs ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.gosash_tariffs "
                    "(name, hours, hours_label, theory, instructor, price, gsm, badge, color, featured, installment, duration, features, restrictions, bonuses, sort_order, active) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("hours",56), d.get("hours_label",""), d.get("theory",""),
                     d.get("instructor",""), d.get("price",0), d.get("gsm",0), d.get("badge"),
                     d.get("color",""), d.get("featured",False), d.get("installment"), d.get("duration"),
                     json.dumps(d.get("features",[]), ensure_ascii=False),
                     json.dumps(d.get("restrictions",[]), ensure_ascii=False),
                     json.dumps(d.get("bonuses",[]), ensure_ascii=False),
                     d.get("sort_order",0), d.get("active",True))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                tid = d.get("id")
                cur.execute(
                    f"UPDATE {SCHEMA}.gosash_tariffs SET name=%s, hours=%s, hours_label=%s, theory=%s, instructor=%s, "
                    "price=%s, gsm=%s, badge=%s, color=%s, featured=%s, installment=%s, duration=%s, "
                    "features=%s, restrictions=%s, bonuses=%s, sort_order=%s, active=%s, updated_at=NOW() WHERE id=%s",
                    (d.get("name",""), d.get("hours",56), d.get("hours_label",""), d.get("theory",""),
                     d.get("instructor",""), d.get("price",0), d.get("gsm",0), d.get("badge"),
                     d.get("color",""), d.get("featured",False), d.get("installment"), d.get("duration"),
                     json.dumps(d.get("features",[]), ensure_ascii=False),
                     json.dumps(d.get("restrictions",[]), ensure_ascii=False),
                     json.dumps(d.get("bonuses",[]), ensure_ascii=False),
                     d.get("sort_order",0), d.get("active",True), tid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                tid = body.get("id") or (event.get("queryStringParameters") or {}).get("id")
                cur.execute(f"DELETE FROM {SCHEMA}.gosash_tariffs WHERE id=%s", (tid,))
                conn.commit()
                return json_response({"ok": True})

        # ── BRANCHES ──────────────────────────────────────────────────────────
        if "/branches" in path:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.gosash_branches ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.gosash_branches (name, addr, rating, map_url, active, sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("addr",""), d.get("rating",5.0), d.get("map_url",""), d.get("active",True), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.gosash_branches SET name=%s, addr=%s, rating=%s, map_url=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("name",""), d.get("addr",""), d.get("rating",5.0), d.get("map_url",""), d.get("active",True), d.get("sort_order",0), d.get("id"))
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                bid = body.get("id") or (event.get("queryStringParameters") or {}).get("id")
                cur.execute(f"DELETE FROM {SCHEMA}.gosash_branches WHERE id=%s", (bid,))
                conn.commit()
                return json_response({"ok": True})

        # ── INSTRUCTORS ───────────────────────────────────────────────────────
        if "/instructors" in path:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.gosash_instructors ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.gosash_instructors (name, experience, specialization, photo_url, is_top, is_lady, active, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("experience",""), d.get("specialization",""), d.get("photo_url",""), d.get("is_top",False), d.get("is_lady",False), d.get("active",True), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.gosash_instructors SET name=%s, experience=%s, specialization=%s, photo_url=%s, is_top=%s, is_lady=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("name",""), d.get("experience",""), d.get("specialization",""), d.get("photo_url",""), d.get("is_top",False), d.get("is_lady",False), d.get("active",True), d.get("sort_order",0), d.get("id"))
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                iid = body.get("id") or (event.get("queryStringParameters") or {}).get("id")
                cur.execute(f"DELETE FROM {SCHEMA}.gosash_instructors WHERE id=%s", (iid,))
                conn.commit()
                return json_response({"ok": True})

        # ── REVIEWS ───────────────────────────────────────────────────────────
        if "/reviews" in path:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.gosash_reviews ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.gosash_reviews (author, text, rating, photo_url, source, active, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("author",""), d.get("text",""), d.get("rating",5), d.get("photo_url",""), d.get("source",""), d.get("active",True), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.gosash_reviews SET author=%s, text=%s, rating=%s, photo_url=%s, source=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("author",""), d.get("text",""), d.get("rating",5), d.get("photo_url",""), d.get("source",""), d.get("active",True), d.get("sort_order",0), d.get("id"))
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                rid = body.get("id") or (event.get("queryStringParameters") or {}).get("id")
                cur.execute(f"DELETE FROM {SCHEMA}.gosash_reviews WHERE id=%s", (rid,))
                conn.commit()
                return json_response({"ok": True})

        return error("Маршрут не найден", 404)

    except Exception as e:
        conn.rollback()
        return error(str(e), 500)
    finally:
        cur.close()
        conn.close()
