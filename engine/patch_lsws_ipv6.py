import os

path = "/usr/local/lsws/conf/httpd_config.conf"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

target = "listener SSL IPv6 {"
pos = c.find(target)
if pos != -1:
    end_pos = c.find("}", pos)
    block = c[pos:end_pos]
    if "map                     srv691444.hstgr.cloud srv691444.hstgr.cloud" not in block:
        addition = "  map                     srv691444.hstgr.cloud srv691444.hstgr.cloud\n  map                     loki.warga-digital.com loki.warga-digital.com\n"
        c = c[:end_pos] + addition + c[end_pos:]
        with open(path, "w", encoding="utf-8") as f:
            f.write(c)
        print("Successfully added mappings to listener SSL IPv6")
    else:
        print("Mappings already present")
else:
    print("Could not find listener SSL IPv6 block")
