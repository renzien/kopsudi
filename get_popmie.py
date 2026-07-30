import urllib.request
import re

req = urllib.request.Request("https://commons.wikimedia.org/wiki/File:Pop_Mie_Ayam_Bawang.jpg", headers={"User-Agent": "Mozilla/5.0"})
try:
    html = urllib.request.urlopen(req).read().decode("utf-8")
    links = re.findall(r'href="(https://upload\.wikimedia\.org/wikipedia/commons/[^"]+)"', html)
    for l in links: print(l)
except Exception as e:
    print(e)
