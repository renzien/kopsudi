import urllib.request
import re

html = urllib.request.urlopen('https://html.duckduckgo.com/html/?q=pop+mie+tori+miso+indofood').read().decode('utf-8')
matches = re.findall(r'src="(//external-content\.duckduckgo\.com/iu/\?u=[^"]+)"', html)
for m in matches:
    print("https:" + m)
