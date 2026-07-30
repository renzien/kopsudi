import urllib.request
import re

req = urllib.request.Request("https://en.wikipedia.org/wiki/Instant_noodle", headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode("utf-8")
links = re.findall(r'src="(//upload\.wikimedia\.org/wikipedia/commons/thumb/.*?/\d+px-.*?)"', html)
for l in links:
    if "Mama" in l or "Indomie" in l:
        print("https:" + l)
