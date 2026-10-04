import urllib.request
import json

with urllib.request.urlopen("http://127.0.0.1:18090/api/live") as resp:
    data = json.loads(resp.read().decode("utf-8"))

print("=== TIMESTAMP ===")
print(data["timestamp_wib"])

print("=== OBSERVER ===")
print(data["observer"])

print("=== ASTRAL DAY RULER ===")
print(data["chronometry"]["astral_day_ruler"])

print("=== SUNRISE / SUNSET ===")
print("Sunrise:", data["chronometry"]["sunrise_wib"])
print("Sunset: ", data["chronometry"]["sunset_wib"])

print("=== ACTIVE HOUR ===")
print(json.dumps(data["chronometry"]["active_hour"], indent=2))

print("=== BODIES ===")
for b in ["sun", "moon", "mars", "saturn", "venus", "mercury", "jupiter"]:
    info = data["bodies"][b]
    fmt = info["formatted_dms"]
    alt = info["altitude"]
    az = info["azimuth"]
    dig = info["dignity"]
    print(f"{b:<8}: {fmt} | Alt: {alt:6.2f}° | Az: {az:6.2f}° | {dig}")

print("=== ASC / MC ===")
print("ASC:", data["houses"]["ascendant"]["formatted"], "| MC:", data["houses"]["midheaven"]["formatted"])
