"""
Административный API для лендинга ГОСАШ.
Поддерживает: авторизацию, настройки, тарифы, акции, филиалы, инструкторы, отзывы,
FAQ, статистику, финансы, бегущую строку, hero-преимущества, заявки, загрузку фото.
Маршрутизация через ?action=. Допускается ведущий слэш (нормализуется).
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
    headers = event.get("headers", {}) or {}
    # Cloud provider может менять регистр заголовков
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    expected = hashlib.sha256(f"{ADMIN_LOGIN}:{ADMIN_PASSWORD_HASH}".encode()).hexdigest()
    return token == expected


def upload_image(b64_data: str, filename: str):
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
    return {
        "url": cdn_url,
        "key": key,
        "size": len(img_bytes),
        "content_type": content_type,
    }


def s3_delete(key: str):
    if not key:
        return
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.delete_object(Bucket="files", Key=key)


def to_json_field(value):
    """Pydantic-like безопасное приведение к JSON для jsonb-полей."""
    if value is None:
        return json.dumps([], ensure_ascii=False)
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False)


def handler(event: dict, context) -> dict:
    """Главный обработчик. Маршрутизация по ?action=."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    raw_action = qs.get("action", "") or ""
    # Нормализуем: убираем ведущие слэши на случай "/tariffs"
    action = raw_action.lstrip("/").strip()

    body = {}
    raw_body = event.get("body", "") or ""
    if raw_body:
        try:
            body = json.loads(raw_body)
        except Exception:
            from urllib.parse import parse_qs
            parsed = parse_qs(raw_body)
            body = {k: v[0] for k, v in parsed.items()}

    # ── PUBLIC: TARIFFS ──────────────────────────────────────────────────────
    if action == "public-tariffs" and method == "GET":
        conn_pub = get_db()
        cur_pub = conn_pub.cursor(cursor_factory=RealDictCursor)
        try:
            cur_pub.execute(
                "SELECT id, name, hours, hours_label, theory, instructor, price, old_price, gsm, "
                "badge, color, featured, installment, duration, features, restrictions, bonuses "
                "FROM gosash_tariffs WHERE active = TRUE ORDER BY sort_order, id"
            )
            items = [dict(r) for r in cur_pub.fetchall()]
            return json_response({"items": items})
        finally:
            cur_pub.close()
            conn_pub.close()

    # ── PUBLIC: PROMOS ───────────────────────────────────────────────────────
    if action == "public-promos" and method == "GET":
        conn_p = get_db()
        cur_p = conn_p.cursor(cursor_factory=RealDictCursor)
        try:
            cur_p.execute(
                "SELECT id, title, subtitle, description, image_url, badge "
                "FROM gosash_promos WHERE active = TRUE ORDER BY sort_order, id"
            )
            return json_response({"items": [dict(r) for r in cur_p.fetchall()]})
        finally:
            cur_p.close()
            conn_p.close()

    # ── PUBLIC: BRANCHES / INSTRUCTORS / REVIEWS / FAQ / STATS / FINANCE / MARQUEE / HERO ──
    public_map = {
        "public-branches": ("gosash_branches", "id, name, addr, rating, map_url, type, embed_url"),
        "public-instructors": ("gosash_instructors", "id, name, experience, specialization, photo_url, is_top, is_lady"),
        "public-reviews": ("gosash_reviews", "id, author, text, rating, photo_url, source"),
        "public-faq": ("gosash_faq", "id, question, answer"),
        "public-stats": ("gosash_stats", "id, value, label, icon"),
        "public-finance": ("gosash_finance", "id, title, subtitle, icon, rows"),
        "public-marquee": ("gosash_marquee", "id, label, shape"),
        "public-hero-features": ("gosash_hero_features", "id, label"),
        "public-documents": ("gosash_documents", "id, slug, title, content"),
    }
    if action in public_map and method == "GET":
        table, cols = public_map[action]
        conn_x = get_db()
        cur_x = conn_x.cursor(cursor_factory=RealDictCursor)
        try:
            cur_x.execute(f"SELECT {cols} FROM {table} WHERE active = TRUE ORDER BY sort_order, id")
            return json_response({"items": [dict(r) for r in cur_x.fetchall()]})
        finally:
            cur_x.close()
            conn_x.close()

    # ── PUBLIC: SETTINGS ──────────────────────────────────────────────────────
    if action == "public-settings" and method == "GET":
        conn_s = get_db()
        cur_s = conn_s.cursor(cursor_factory=RealDictCursor)
        try:
            cur_s.execute("SELECT key, value FROM gosash_settings")
            rows = cur_s.fetchall()
            return json_response({r["key"]: r["value"] for r in rows})
        finally:
            cur_s.close()
            conn_s.close()

    # ── PUBLIC: LEAD ──────────────────────────────────────────────────────────
    if action == "lead" and method == "POST":
        conn_l = get_db()
        cur_l = conn_l.cursor()
        try:
            cur_l.execute(
                "INSERT INTO gosash_leads (name, phone, tariff, promo, source, note) "
                "VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                (body.get("name", ""), body.get("phone", ""), body.get("tariff", ""),
                 body.get("promo", ""), body.get("source", ""), body.get("note", ""))
            )
            conn_l.commit()
            return json_response({"ok": True})
        finally:
            cur_l.close()
            conn_l.close()

    # ── AUTH ──────────────────────────────────────────────────────────────────
    if action == "login":
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
        if action == "upload":
            img_b64 = body.get("image", "")
            filename = body.get("filename", "photo.jpg")
            info = upload_image(img_b64, filename)
            try:
                cur.execute(
                    "INSERT INTO gosash_media (url, filename, s3_key, size_bytes, mime_type, alt, tag) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s)",
                    (info["url"], filename, info["key"], info["size"], info["content_type"], "", body.get("tag", ""))
                )
                conn.commit()
            except Exception:
                conn.rollback()
            return json_response({"url": info["url"]})

        # ── SETTINGS ──────────────────────────────────────────────────────────
        if action == "settings":
            if method == "GET":
                cur.execute("SELECT key, value FROM gosash_settings ORDER BY key")
                rows = cur.fetchall()
                return json_response({r["key"]: r["value"] for r in rows})
            if method == "POST":
                data = body.get("data", {})
                for k, v in data.items():
                    cur.execute(
                        "INSERT INTO gosash_settings (key, value, updated_at) VALUES (%s, %s, NOW()) "
                        "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                        (k, str(v))
                    )
                conn.commit()
                return json_response({"ok": True})

        # ── TARIFFS ───────────────────────────────────────────────────────────
        if action == "tariffs":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_tariffs ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_tariffs "
                    "(name, hours, hours_label, theory, instructor, price, old_price, gsm, badge, color, featured, installment, duration, features, restrictions, bonuses, sort_order, active) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("hours",56), d.get("hours_label",""), d.get("theory",""),
                     d.get("instructor",""), d.get("price",0), d.get("old_price"), d.get("gsm",0), d.get("badge"),
                     d.get("color",""), bool(d.get("featured", False)), d.get("installment"), d.get("duration"),
                     to_json_field(d.get("features", [])),
                     to_json_field(d.get("restrictions", [])),
                     to_json_field(d.get("bonuses", [])),
                     d.get("sort_order",0), bool(d.get("active", True)))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                tid = d.get("id")
                cur.execute(
                    "UPDATE gosash_tariffs SET name=%s, hours=%s, hours_label=%s, theory=%s, instructor=%s, "
                    "price=%s, old_price=%s, gsm=%s, badge=%s, color=%s, featured=%s, installment=%s, duration=%s, "
                    "features=%s, restrictions=%s, bonuses=%s, sort_order=%s, active=%s, updated_at=NOW() WHERE id=%s",
                    (d.get("name",""), d.get("hours",56), d.get("hours_label",""), d.get("theory",""),
                     d.get("instructor",""), d.get("price",0), d.get("old_price"), d.get("gsm",0), d.get("badge"),
                     d.get("color",""), bool(d.get("featured", False)), d.get("installment"), d.get("duration"),
                     to_json_field(d.get("features", [])),
                     to_json_field(d.get("restrictions", [])),
                     to_json_field(d.get("bonuses", [])),
                     d.get("sort_order",0), bool(d.get("active", True)), tid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                tid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_tariffs WHERE id=%s", (tid,))
                conn.commit()
                return json_response({"ok": True})

        if action == "tariffs-reorder" and method == "POST":
            order = body.get("order", [])
            if not isinstance(order, list):
                return error("order must be a list of ids")
            for idx, raw_id in enumerate(order):
                try:
                    tid = int(raw_id)
                except (TypeError, ValueError):
                    continue
                cur.execute(
                    "UPDATE gosash_tariffs SET sort_order=%s, updated_at=NOW() WHERE id=%s",
                    ((idx + 1) * 10, tid),
                )
            conn.commit()
            return json_response({"ok": True})

        # ── BRANCHES ──────────────────────────────────────────────────────────
        if action == "branches":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_branches ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_branches (name, addr, rating, map_url, type, embed_url, active, sort_order) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("addr",""), d.get("rating",5.0), d.get("map_url",""),
                     d.get("type","Учебный класс"), d.get("embed_url",""),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                bid = d.get("id")
                cur.execute(
                    "UPDATE gosash_branches SET name=%s, addr=%s, rating=%s, map_url=%s, type=%s, embed_url=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("name",""), d.get("addr",""), d.get("rating",5.0), d.get("map_url",""),
                     d.get("type","Учебный класс"), d.get("embed_url",""),
                     bool(d.get("active", True)), d.get("sort_order",0), bid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                bid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_branches WHERE id=%s", (bid,))
                conn.commit()
                return json_response({"ok": True})

        # ── INSTRUCTORS ───────────────────────────────────────────────────────
        if action == "instructors":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_instructors ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_instructors (name, experience, specialization, photo_url, is_top, is_lady, active, sort_order) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("name",""), d.get("experience",""), d.get("specialization",""),
                     d.get("photo_url",""), bool(d.get("is_top", False)), bool(d.get("is_lady", False)),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                iid = d.get("id")
                cur.execute(
                    "UPDATE gosash_instructors SET name=%s, experience=%s, specialization=%s, photo_url=%s, is_top=%s, is_lady=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("name",""), d.get("experience",""), d.get("specialization",""),
                     d.get("photo_url",""), bool(d.get("is_top", False)), bool(d.get("is_lady", False)),
                     bool(d.get("active", True)), d.get("sort_order",0), iid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                iid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_instructors WHERE id=%s", (iid,))
                conn.commit()
                return json_response({"ok": True})

        # ── REVIEWS ───────────────────────────────────────────────────────────
        if action == "reviews":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_reviews ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_reviews (author, text, rating, photo_url, source, active, sort_order) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("author",""), d.get("text",""), d.get("rating",5), d.get("photo_url",""),
                     d.get("source",""), bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                rid = d.get("id")
                cur.execute(
                    "UPDATE gosash_reviews SET author=%s, text=%s, rating=%s, photo_url=%s, source=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("author",""), d.get("text",""), d.get("rating",5), d.get("photo_url",""),
                     d.get("source",""), bool(d.get("active", True)), d.get("sort_order",0), rid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                rid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_reviews WHERE id=%s", (rid,))
                conn.commit()
                return json_response({"ok": True})

        # ── PROMOS ────────────────────────────────────────────────────────────
        if action == "promos":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_promos ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_promos (title, subtitle, description, image_url, badge, active, sort_order) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("title",""), d.get("subtitle",""), d.get("description",""),
                     d.get("image_url",""), d.get("badge",""),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                pid = d.get("id")
                cur.execute(
                    "UPDATE gosash_promos SET title=%s, subtitle=%s, description=%s, image_url=%s, badge=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("title",""), d.get("subtitle",""), d.get("description",""),
                     d.get("image_url",""), d.get("badge",""),
                     bool(d.get("active", True)), d.get("sort_order",0), pid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                pid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_promos WHERE id=%s", (pid,))
                conn.commit()
                return json_response({"ok": True})

        # ── DOCUMENTS ─────────────────────────────────────────────────────────
        if action == "documents":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_documents ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_documents (slug, title, content, active, sort_order) "
                    "VALUES (%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("slug",""), d.get("title",""), d.get("content",""),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                did = d.get("id")
                cur.execute(
                    "UPDATE gosash_documents SET slug=%s, title=%s, content=%s, active=%s, sort_order=%s, updated_at=NOW() WHERE id=%s",
                    (d.get("slug",""), d.get("title",""), d.get("content",""),
                     bool(d.get("active", True)), d.get("sort_order",0), did)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                did = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_documents WHERE id=%s", (did,))
                conn.commit()
                return json_response({"ok": True})

        # ── FAQ ────────────────────────────────────────────────────────────────
        if action == "faq":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_faq ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_faq (question, answer, active, sort_order) VALUES (%s,%s,%s,%s) RETURNING id",
                    (d.get("question",""), d.get("answer",""), bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                fid = d.get("id")
                cur.execute(
                    "UPDATE gosash_faq SET question=%s, answer=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("question",""), d.get("answer",""), bool(d.get("active", True)), d.get("sort_order",0), fid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                fid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_faq WHERE id=%s", (fid,))
                conn.commit()
                return json_response({"ok": True})

        # ── STATS ──────────────────────────────────────────────────────────────
        if action == "stats":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_stats ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_stats (value, label, icon, active, sort_order) VALUES (%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("value",""), d.get("label",""), d.get("icon","Star"),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                sid = d.get("id")
                cur.execute(
                    "UPDATE gosash_stats SET value=%s, label=%s, icon=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("value",""), d.get("label",""), d.get("icon","Star"),
                     bool(d.get("active", True)), d.get("sort_order",0), sid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                sid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_stats WHERE id=%s", (sid,))
                conn.commit()
                return json_response({"ok": True})

        # ── FINANCE ────────────────────────────────────────────────────────────
        if action == "finance":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_finance ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_finance (title, subtitle, icon, rows, active, sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("title",""), d.get("subtitle",""), d.get("icon","Percent"),
                     to_json_field(d.get("rows", [])),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                fid = d.get("id")
                cur.execute(
                    "UPDATE gosash_finance SET title=%s, subtitle=%s, icon=%s, rows=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("title",""), d.get("subtitle",""), d.get("icon","Percent"),
                     to_json_field(d.get("rows", [])),
                     bool(d.get("active", True)), d.get("sort_order",0), fid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                fid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_finance WHERE id=%s", (fid,))
                conn.commit()
                return json_response({"ok": True})

        # ── MARQUEE ────────────────────────────────────────────────────────────
        if action == "marquee":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_marquee ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_marquee (label, shape, active, sort_order) VALUES (%s,%s,%s,%s) RETURNING id",
                    (d.get("label",""), d.get("shape","circle"),
                     bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                mid = d.get("id")
                cur.execute(
                    "UPDATE gosash_marquee SET label=%s, shape=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("label",""), d.get("shape","circle"),
                     bool(d.get("active", True)), d.get("sort_order",0), mid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                mid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_marquee WHERE id=%s", (mid,))
                conn.commit()
                return json_response({"ok": True})

        # ── HERO FEATURES ──────────────────────────────────────────────────────
        if action == "hero-features":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_hero_features ORDER BY sort_order, id")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_hero_features (label, active, sort_order) VALUES (%s,%s,%s) RETURNING id",
                    (d.get("label",""), bool(d.get("active", True)), d.get("sort_order",0))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                hid = d.get("id")
                cur.execute(
                    "UPDATE gosash_hero_features SET label=%s, active=%s, sort_order=%s WHERE id=%s",
                    (d.get("label",""), bool(d.get("active", True)), d.get("sort_order",0), hid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                hid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_hero_features WHERE id=%s", (hid,))
                conn.commit()
                return json_response({"ok": True})

        # ── LEADS ──────────────────────────────────────────────────────────────
        if action == "leads":
            if method == "GET":
                cur.execute("SELECT * FROM gosash_leads ORDER BY created_at DESC, id DESC LIMIT 500")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "PUT":
                d = body
                lid = d.get("id")
                cur.execute(
                    "UPDATE gosash_leads SET status=%s, note=%s WHERE id=%s",
                    (d.get("status","new"), d.get("note",""), lid)
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                lid = body.get("id") or qs.get("id")
                cur.execute("DELETE FROM gosash_leads WHERE id=%s", (lid,))
                conn.commit()
                return json_response({"ok": True})

        # ── MEDIA LIBRARY ─────────────────────────────────────────────────────
        if action == "media":
            if method == "GET":
                tag = qs.get("tag", "")
                if tag:
                    cur.execute("SELECT * FROM gosash_media WHERE tag=%s ORDER BY created_at DESC, id DESC LIMIT 500", (tag,))
                else:
                    cur.execute("SELECT * FROM gosash_media ORDER BY created_at DESC, id DESC LIMIT 500")
                return json_response({"items": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    "INSERT INTO gosash_media (url, filename, s3_key, size_bytes, mime_type, alt, tag) "
                    "VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (d.get("url",""), d.get("filename","external"), d.get("s3_key"), d.get("size_bytes",0),
                     d.get("mime_type","image/jpeg"), d.get("alt",""), d.get("tag",""))
                )
                new_id = cur.fetchone()["id"]
                conn.commit()
                return json_response({"ok": True, "id": new_id})
            if method == "PUT":
                d = body
                cur.execute(
                    "UPDATE gosash_media SET alt=%s, tag=%s WHERE id=%s",
                    (d.get("alt",""), d.get("tag",""), d.get("id"))
                )
                conn.commit()
                return json_response({"ok": True})
            if method == "DELETE":
                mid = body.get("id") or qs.get("id")
                cur.execute("SELECT s3_key FROM gosash_media WHERE id=%s", (mid,))
                row = cur.fetchone()
                if row and row.get("s3_key"):
                    try:
                        s3_delete(row["s3_key"])
                    except Exception:
                        pass
                cur.execute("DELETE FROM gosash_media WHERE id=%s", (mid,))
                conn.commit()
                return json_response({"ok": True})

        return error(f"Неизвестный action: {action}", 404)

    finally:
        cur.close()
        conn.close()