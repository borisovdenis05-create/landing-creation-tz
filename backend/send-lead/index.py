import json
import urllib.request
import urllib.parse

BITRIX_WEBHOOK = "https://gosavtoschool.bitrix24.ru/rest/45768/9nij678yep7wc72c/"


def handler(event: dict, context) -> dict:
    """Создаёт лид в Bitrix24 CRM с UTM-метками из URL"""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")

    name = body.get("name", "")
    phone = body.get("phone", "")
    comment = body.get("comment", "")
    utm_source = body.get("utm_source", "")
    utm_medium = body.get("utm_medium", "")
    utm_campaign = body.get("utm_campaign", "")
    utm_content = body.get("utm_content", "")
    utm_term = body.get("utm_term", "")

    title_parts = ["Заявка с сайта"]
    if comment:
        title_parts.append(comment)
    title = " — ".join(title_parts)

    params = {
        "FIELDS[STATUS_ID]": "NEW",
        "FIELDS[NAME]": name,
        "FIELDS[PHONE][0][VALUE]": phone,
        "FIELDS[PHONE][0][VALUE_TYPE]": "WORK",
        "FIELDS[TITLE]": title,
        "FIELDS[UF_CRM_1612510024]": "702",
        "FIELDS[SOURCE_ID]": "11",
        "FIELDS[UF_CRM_1611737507]": "646",
    }

    if utm_source:
        params["FIELDS[UTM_SOURCE]"] = utm_source
    if utm_medium:
        params["FIELDS[UTM_MEDIUM]"] = utm_medium
    if utm_campaign:
        params["FIELDS[UTM_CAMPAIGN]"] = utm_campaign
    if utm_content:
        params["FIELDS[UTM_CONTENT]"] = utm_content
    if utm_term:
        params["FIELDS[UTM_TERM]"] = utm_term

    url = BITRIX_WEBHOOK + "crm.lead.add.json?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=10) as resp:
        result = json.loads(resp.read())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True, "lead_id": result.get("result")}),
    }
